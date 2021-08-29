const db = require("quick.db")

module.exports = {
    name: "terror",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-prognosticator") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let ability = db.get(`terror_${message.channel.id}`) || "no"
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let isDay = db.get(`isDay`)
            let dayCount = db.get(`dayCount`) || 1
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send({ content: "You are dead..." })
            if (ability !== "no") return message.channel.send({ content: "You already used that ability!" })
            if (!guy || !guy.roles.cache.has(alive.id)) return message.channel.send({ content: "Invalid target!" })
            if (isDay) {
                dayChat.send({ content: `**${guy.nickname + " " + guy.user.username || guy}** won't be able to vote anymore from tomorrow on.` })
                db.set(`terror_${message.channel.id}`, { day: dayCount + 1, guy: guy.nickname })
                message.channel.send({ content: "The villagers are informed!" })
            }
        }
    },
}
