const db = require("quick.db")

module.exports = {
    name: "killall",
    aliases: ["suicideall", "gameend", "alldie", "dieall"],
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (message.guild.id != "472261911526768642") return

        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")

        if (alive.members.size == 0) return message.channel.send("There is no one to kill!")

        let daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")

        alive.members.forEach((m) => {
            m.roles.add(dead.id)
            m.roles.remove(alive.id)
            daychat.send(`**${m.nickname} ${m.user.username} (${db.get(`role_${m.id}`)})** was killed by the narrator!`)
        })
    },
}
