//648620

const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "playerinfo",
    description: "Get the playerinfo.",
    usage: `${process.env.PREFIX}playerinfo`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let content = ""
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive").members.size
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead").members.size
        let c = message.guild.channels.cache.filter((c) => c.name.startsWith("priv") && c.type !== "GUILD_CATEGORY")
        let ch = c.map((x) => x.id)
        for (let i = 1; i <= alive + dead; i++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === i.toString())
            if (!guy) return message.channel.send("Something went wrong... Make sure that all of the players only have 1 role (Alive or Dead)!")
            for (let b = 0; b < ch.length; b++) {
                let cha = message.guild.channels.cache.find((channel) => channel.id === ch[b])
                if (cha.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    let ro = cha.name.replace("priv-", "")
                    let rol = ro.toLowerCase()
                    let role = rol.replace("-", "_")
                    let autoRole
                    if (ro.includes("-")) {
                        autoRole = ro.replace(/(\w+)-(\w+)/g, (_, m1, m2) => `${m1[0].toUpperCase()}${m1.slice(1).toLowerCase()} ${m2[0].toUpperCase()}${m2.slice(1).toLowerCase()}`)
                    } else {
                        autoRole = `${ro[0].toUpperCase()}${ro.slice(1).toLowerCase()}`
                    }

                    db.set(`role_${guy.id}`, autoRole)
                    let emoji = client.emojis.cache.find((e) => e.name === role)
                    if (!emoji) emoji = role
                    content += `${emoji} ${guy.nickname}. ${guy.user.tag}\n`
                }
            }
        }
        if (args[0] == "raw") {
            message.channel.send(`**Player Info**\n${content}`)
        } else if (args[0] == "block") {
            message.channel.send(`\`\`\`**Player Info**\n${content}\`\`\``)
        } else {
            let embed = new Discord.MessageEmbed({ title: "Player Info", description: content, color: "#648620" })
            message.channel.send({ embeds: [embed] }).catch((e) => message.channel.send(`An error occured: ${e.message}`))
        }
    },
}
