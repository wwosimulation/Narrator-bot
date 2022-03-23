const db = require("quick.db")

module.exports = {
    name: "terror",
    description: "Prevent somebody from voting. This will affect the player from tomorrow on",
    usage: `${process.env.PREFIX}terror <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-prognosticator") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let ability = db.get(`terror_${message.channel.id}`) || "no"
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let gamePhase = db.get(`gamePhase`)
            let dayCount = Math.floor(gamePhase / 3) + 1
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send({ content: "You are dead..." })
            if (ability !== "no") return message.channel.send({ content: "You already used that ability!" })
            if (!guy || !guy.roles.cache.has(alive.id)) return message.channel.send({ content: "Invalid target!" })
            if (gamePhase % 3 == 1 || gamePhase % 3 == 2) {
                dayChat.send({ content: `**${guy.nickname + " " + guy.user.username || guy}** won't be able to vote anymore from tomorrow on.` })
                db.set(`terror_${message.channel.id}`, { day: dayCount + 1, guy: guy.nickname })
                message.channel.send({ content: "The villagers are informed!" })
            } else return message.channel.send("You can use this command only at days.")
        }
    },
}
