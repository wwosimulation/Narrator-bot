const db = require("quick.db")

module.exports = {
    name: "peace",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-prognosticator") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let ability = db.get(`peace_${message.channel.id}`) || "no"
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let isNight = db.get(`isNight`)
            let nightCount = db.get(`nightCount`) || 1
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send({ content: "You are dead..." })
            if (!ability == "no") return message.channel.send({ content: "You already used that ability!" })
            if (isNight == "yes" && nightCount > 1) {
                dayChat.send({ content: `${alive}\nPeace be upon you dear villagers. No one can die the following night!` })
                db.set(`peace_${message.channel.id}`, nightCount + 1)
                message.channel.send({ content: "Your message has reached the villagers." })
            } else return message.channel.send("You can use this command in only in nights and not during the first one.")
        }
    },
}
