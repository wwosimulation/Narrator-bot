console.log("Booting bot...")
require("dotenv").config()

const fs = require("fs")
const db = require("quick.db")
const { fn, getEmoji } = require("./config")

const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")

if (db.get("emergencystop")) {
    console.log("Bot has been emergency stopped")
    process.exit(0)
}

const mongo = require("./db.js")
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_PRESENCES"] })
const config = require("./config")
client.db = db
client.dbs = mongo
client.Sentry = Sentry

const { createAppAuth } = require("@octokit/auth-app")
const { Octokit } = require("@octokit/core")
const players = require("./schemas/players.js")

if (process.env.DEBUG) {
    client.on("debug", console.debug)
    client.on("messageCreate", (x) => console.debug(`${x.content} - ${x.author.tag} ${x.author.id}`))
}

client.commands = new Discord.Collection()
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
                    if (props.aliases) props.aliases.forEach((alias) => client.commands.set(alias, props))
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})
client.slashCommands = new Discord.Collection()
fs.readdir("./slashCommands/", (err, files) => {
    files.forEach((file) => {
        let path = `./slashCommands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find slash commands in the ${file} category.`)
            }
            jsfile.forEach((f, i) => {
                let props = require(`./slashCommands/${file}/${f}`)
                props.category = file
                try {
                    client.slashCommands.set(props.command.name, props)
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
    if (["439223656200273932", "406412325973786624", "263472056753061889", "517335997172809728"].includes(id)) return true
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
    if (embeds.length <= 1) return

    // buttons
    let buttonBegin = new Discord.MessageButton({ style: "SUCCESS", emoji: "⏪", customId: "begin" })
    let buttonBack = new Discord.MessageButton({ style: "SUCCESS", emoji: "◀", customId: "back" })
    let buttonNext = new Discord.MessageButton({ style: "SUCCESS", emoji: "▶", customId: "next" })
    let buttonEnd = new Discord.MessageButton({ style: "SUCCESS", emoji: "⏩", customId: "end" })

    // rows
    let activeRow = new Discord.MessageActionRow().addComponents([buttonBegin, buttonBack, buttonNext, buttonEnd])

    // adding buttons
    if (addButtons) msg.edit({ components: [activeRow] })

    // collecting interactions
    let filter = (interaction) => interaction.isButton() === true && interaction.user.id === authorID
    let collector = msg.createMessageComponentCollector({ filter, idle: 15 * 1000 })

    let p = --page

    collector.on("collect", async (button) => {
        if (button.customId === "begin") p = 0
        else if (button.customId === "back") {
            if (p != 0) p--
            else p = embeds.length - 1
        } else if (button.customId === "next") {
            if (p != embeds.length - 1) p++
            else p = 0
        } else if (button.customId === "end") p = embeds.length - 1
        await button.update({ embeds: [embeds[p]] })
    })
    collector.on("end", () => {
        let deadRow = new Discord.MessageActionRow().addComponents([buttonBegin.setDisabled(), buttonBack.setDisabled(), buttonNext.setDisabled(), buttonEnd.setDisabled()])
        msg.edit({ components: [deadRow] })
    })
}

client.debug = async (options = { game: false }) => {
    let data = {}
    data.night = Math.floor(db.get(`gamePhase`) / 3) + 1
    data.day = Math.floor(db.get(`gamePhase`) / 3) + 1
    data.gamePhase = db.get(`gamePhase`)
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
    client.userEmojis = client.emojis.cache.filter((x) => config.ids.emojis.includes(x.guild.id))
    client.channels.cache.get("832884582315458570").send(`Bot has started, running commit \`${commit}\` on branch \`${branch}\``)
    if (!client.user.username.includes("Beta")) {
        Sentry.init({
            dsn: process.env.SENTRY,
            tracesSampleRate: 1.0,
        })
        let privateKey = fs.readFileSync("./ghnb.pem")
        client.github = new Octokit({
            authStrategy: createAppAuth,
            auth: {
                appId: 120523,
                privateKey,
                clientSecret: process.env.GITHUB,
                installationId: 17541999,
            },
        })
    }

    setInterval(async () => {
        let lottery = require("./schemas/lottery")
        let lotteries = await lottery.find()
        if (lotteries.length != 0) {
            let lot = lotteries[0]
            if (new Date().getTime() > lot.endDate) {
                let chan = client.channels.cache.get("947930500725616700")
                let logs = client.channels.cache.get("949248776500031508")
                if (lot.participants.length == 0) {
                    chan.send(`No one has joined this lottery, so no winner.`)
                } else {
                    let winner = fn.randomWeight(lot.participants)
                    let person = client.users.cache.find((u) => u.id === winner)
                    chan.send(`Congratulations to ${person} for winning the lottery! You have won ${lot.pot} ${getEmoji("coin", client)}, they have been added to your balance.`)
                    let msg = await chan.messages.fetch(lot.msg)
                    msg.edit({ components: [] })
                    let player = await players.findOne({ user: person.id })
                    player.coins += lot.pot
                    logs.send(`${lot}`)
                    player.save()
                    lot.remove()
                }
            }
        }
    }, 2000)

    //Invite Tracker
    client.allInvites = await client.guilds.cache.get(config.ids.server.sim).invites.fetch()
})

let maint = db.get("maintenance")
if (typeof maint == "string" && maint.startsWith("config-")) {
    client.channels.cache.get(maint.split("-")[1])?.send("Config has successfully been reloaded!")
    db.set("maintenance", false)
}
//require("./slash.js")(client)

client.login(process.env.TOKEN)

client.on("error", (e) => console.error)

module.exports = { client }
