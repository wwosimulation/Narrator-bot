console.log("Booting bot...")
require("dotenv").config()
const fs = require("fs")
const db = require("quick.db")
const mongo = require("./db.js")
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_PRESENCES"] })
const config = require("./config")
//const shadowadmin = require("shadowadmin")
client.db = db
client.dbs = mongo

const { createAppAuth } = require("@octokit/auth-app")
const { Octokit } = require("@octokit/core")

client.commands = new Discord.Collection()
// const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"))
// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`)
//   client.commands.set(command.name, command)
// }
fs.readdir("./commands/", (err, files) => {
    files.forEach((file) => {
        let path = `./commands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find commands in the ${file} category.`)
                return
            }
            jsfile.forEach((f, i) => {
                let props = require(`./commands/${file}/${f}`)
                props.category = file
                try {
                    client.commands.set(props.name, props)
                    if (props.alias) props.alias.forEach((alias) => client.commands.set(alias, props))
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
    require(`./events/${file}`)(client)
}

client.botAdmin = (id) => {
    if (["439223656200273932", "406412325973786624", "263472056753061889"].includes(id)) return true
    return false
}

client.paginator = async (author, msg, embeds, pageNow, addReactions = true) => {
    if (embeds.length === 1) return
    if (addReactions) {
        await msg.react("⏪")
        await msg.react("◀️")
        await msg.react("▶️")
        await msg.react("⏩")
    }
    let reaction = await msg.awaitReactions((reaction, user) => user.id == author && ["◀", "▶", "⏪", "⏩"].includes(reaction.emoji.name), { time: 30 * 1000, max: 1, errors: ["time"] }).catch(() => {})
    if (!reaction) return msg.reactions.removeAll().catch(() => {})
    reaction = reaction.first()
    //console.log(msg.member.users.tag)
    if (msg.channel.type == "dm" || !msg.guild.me.permissions.has("MANAGE_MESSAGES")) {
        if (reaction.emoji.name == "◀️") {
            let m = await msg.channel.send(embeds[Math.max(pageNow - 1, 0)])
            msg.delete()
            client.paginator(author, m, embeds, Math.max(pageNow - 1, 0))
        } else if (reaction.emoji.name == "▶️") {
            let m = await msg.channel.send(embeds[Math.min(pageNow + 1, embeds.length - 1)])
            msg.delete()
            client.paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1))
        } else if (reaction.emoji.name == "⏪") {
            let m = await msg.channel.send(embeds[0])
            msg.delete()
            client.paginator(author, m, embeds, 0)
        } else if (reaction.emoji.name == "⏩") {
            let m = await msg.channel.send(embeds[embeds.length - 1])
            msg.delete()
            client.paginator(author, m, embeds, embeds.length - 1)
        }
    } else {
        if (reaction.emoji.name == "◀️") {
            await reaction.users.remove(author)
            let m = await msg.edit(embeds[Math.max(pageNow - 1, 0)])
            client.paginator(author, m, embeds, Math.max(pageNow - 1, 0), false)
        } else if (reaction.emoji.name == "▶️") {
            await reaction.users.remove(author)
            let m = await msg.edit(embeds[Math.min(pageNow + 1, embeds.length - 1)])
            client.paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1), false)
        } else if (reaction.emoji.name == "⏪") {
            await reaction.users.remove(author)
            let m = await msg.edit(embeds[0])
            client.paginator(author, m, embeds, 0, false)
        } else if (reaction.emoji.name == "⏩") {
            await reaction.users.remove(author)
            let m = await msg.edit(embeds[embeds.length - 1])
            client.paginator(author, m, embeds, embeds.length - 1, false)
        }
    }
}

client.buttonPaginator = async (authorID, msg, embeds, page, addButtons = true) => {
    // buttons
    let buttonBegin = new Discord.MessageButton({ style: "SUCCESS", emoji: "⏪", customId: "begin" })
    let buttonBack = new Discord.MessageButton({ style: "SUCCESS", emoji: "◀", customId: "back" })
    let buttonNext = new Discord.MessageButton({ style: "SUCCESS", emoji: "▶", customId: "next" })
    let buttonEnd = new Discord.MessageButton({ style: "SUCCESS", emoji: "⏩", customId: "end" })
    // rows
    let activeRow = new Discord.MessageActionRow().addComponents([buttonBegin, buttonBack, buttonNext, buttonEnd])
    let deadRow = new Discord.MessageActionRow().addComponents([buttonBegin.setDisabled(), buttonBack.setDisabled(), buttonNext.setDisabled(), buttonEnd.setDisabled()])
    // adding buttons
    if (addButtons) msg = msg.edit({ components: [activeRow] })

    page = page - 1
    // collecting interactions
    let filter = (interaction) => interaction.isButton() === true && interaction.user.id === authorID
    let interaction = msg.awaitMessageComponent({ filter, time: 30 * 1000, max: 1 }).catch(console.error)
    if (!interaction) return msg.edit({ components: [deadRow], content: "This message is now inactive." })

    if (interaction.customId === "begin") page = 1
    else if (interaction.customId === "back") {
        if (!page === 0) page -= 1
        else page = embeds.length
    } else if (interaction.customId === "next") {
        if (!page === embeds.length - 1) page += 1
        else page = 1
    } else if (interaction.customId === "end") page = embeds.length
    let m = interaction.update({ embeds: [embeds[page]] })
    client.buttonPaginator(authorID, m, embeds, page, false).catch(console.error)

    /*/if(!addButtons) msg.edit({embeds:[embeds[page]]})
    collector.on("collect", (interaction) => {
        if (interaction.customId === "begin") page = 1
        else if (interaction.customId === "back") {
            if (!page === 0) page -= 1
            else page = embeds.length
        } else if (interaction.customId === "next") {
            if (!page === embeds.length - 1) page += 1
            else page = 1
        } else if (interaction.customId === "end") page = embeds.length
        interaction.update({ embeds: [embeds[page]] })
        client.buttonPaginator(authorID, msg, embeds, page, false)
    })
    client.setTimeout(() => {
        msg.edit({ components: [deadRow], content: "This message is now inactive." })
    }, 30 * 1000)*/
}

client.debug = async (options = { game: false }) => {
    let data = {}
    data.night = db.get(`nightCount`)
    data.day = db.get(`dayCount`)
    data.isNight = db.get(`isNight`)
    data.isDay = db.get(`isDay`)
    let alive = client.guilds.cache.get(config.ids.server.game).roles.cache.find((r) => r.name === "Alive")
    let dead = client.guilds.cache.get(config.ids.server.game).roles.cache.find((r) => r.name === "Dead")
    let players = []
    alive.members.forEach((x) => players.push({ status: "alive", id: x.id, tag: x.user.tag, role: db.get(`role_${x.id}`) }))
    dead.members.forEach((x) => players.push({ status: "dead", id: x.id, tag: x.user.tag, role: db.get(`role_${x.id}`) }))
    data.players = players
    return data
}

//Bot on startup
client.on("ready", async () => {
    client.config = {}
    let commit = require("child_process").execSync("git rev-parse --short HEAD").toString().trim()
    let branch = require("child_process").execSync("git rev-parse --abbrev-ref HEAD").toString().trim()
    client.user.setActivity(client.user.username.toLowerCase().includes("beta") ? "testes gae on branch " + branch + " and commit " + commit : "Wolvesville Simulation!")
    console.log("Connected!")
    client.channels.cache.get("832884582315458570").send(`Bot has started, running commit \`${commit}\` on branch \`${branch}\``)
    //ShadowAdmin initialize
    //shadowadmin.init(client, {prefix, owners: config.botAdmin})
    //     if (!client.user.username.includes("Beta")) {
    //         let privateKey = fs.readFileSync("./ghnb.pem")
    //         client.github = new Octokit({
    //             authStrategy: createAppAuth,
    //             auth: {
    //                 appId: 120523,
    //                 privateKey,
    //                 clientSecret: process.env.GITHUB,
    //                 installationId: 17541999,
    //             },
    //         })
    //     }
})

let maint = db.get("maintenance")
if (typeof maint == "string" && maint.startsWith("config-")) {
    client.channels.cache.get(maint.split("-")[1])?.send("Config has successfully been reloaded!")
    db.set("maintenance", false)
}
//require("./slash.js")(client)
client.userEmojis = client.emojis.cache.filter((x) => config.ids.emojis.includes(x.guild.id))

client.login(process.env.TOKEN)

function cleanStackTrace(reason) {
    return require("callsite-record")({
        forError: reason,
    }).renderSync({
        stackFilter(frame) {
            return !frame.getFileName().includes("node_modules")
        },
    })
}

process.on("unhandledRejection", (reason) => {
    console.log(cleanStackTrace(reason))
})

client.on("error", (e) => console.error)

module.exports = { client }
