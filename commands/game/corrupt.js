const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "corrupt",
    gameOnly: true,
    aliases: ["glitch"],
    run: async (message, args, client) => {
        if (message.channel.name == "priv-corruptor") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot corrupt someone being dead!")
            if (!args[0]) return message.channel.send("Who are you glitching? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            else if (guy == message.member) {
                return message.channel.send("You cannot glitch yourself.")
            }
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("That player is dead!")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").keyArray("id")
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                if (message.author.nickname === couple[0]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not corrupt your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not corrupt your lover!")
                }
            }
            message.channel.send(`${getEmoji("corrupt", client)} You have decided to corrupt **${guy.nickname} ${guy.user.username}**!`)
            db.set(`corrupt_${message.channel.id}`, guy.nickname)
        }
    },
}
