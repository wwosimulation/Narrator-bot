const db = require("quick.db")

module.exports = {
    name: "revall",
    aliases: ["reviveall", "wolfmed", "allrev"],
    narratorOnly: true,
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")

        if (dead.members.size == 0) return message.channel.send("There is no one to revive!")

        let daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")

        dead.members.forEach((m) => {
            m.roles.add(alive.id)
            m.roles.remove(dead.id)
            daychat.send(`**${m.nickname} ${m.user.username} (${db.get(`role_${m.id}`)})** was revived by the narrator!`)
        })
    },
}
