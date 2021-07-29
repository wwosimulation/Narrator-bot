const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "corrupt",
    gameOnly: true,
    aliases: ["glitch"],
    run: async (message, args, client) => {
        if (message.channel.name == "priv-corruptor") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("If i let you do that, I'd be more corrupt than you...")
            if (!args[0]) return message.channel.send("Why glitch someone when you can glitch NOTHING!! Genius, right?")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (!guy || guy == message.member) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("So you want to glitch someone who can't talk or vote. Very usefull. Here's another tip: `+suicide` kills all players and makes you win alone!")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").keyArray("id")
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`)
                if (message.author.nickname === couple[0]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not eat your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not eat your lover!")
                }
            }
            message.channel.send(`${getEmoji("corrupt", client)} You have decided to corrupt **${guy.nickname} ${guy.user.username}**!`)
            db.set(`corrupt_${message.channel.id}`, guy.nickname)
        }
    },
}
