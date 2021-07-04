const db = require("quick.db")

module.exports = {
    name: "snap",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-illusionist") {
            let disguises = db.get(`disguised_${message.channel.id}`) || []
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let isDay = db.get(`isDay`)
            let commandEnabled = db.get(`commandEnabled`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You need to be alive to do this dumb.")
            if (disguises.length == 0) return message.channel.send("You did not disguise anyone yet sike.")
            if (isDay != "yes") return message.channel.send("You only can kill players during the day, when it's the discussion time...")
            if (commandEnabled == "yes") return message.channel.send("You only can kill players during the day, discussion time!")
            for (let i = 0; i < disguises.length; i++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === disguises[i])
                if (guy) {
                    if (guy.roles.cache.has(alive.id)) {
                        let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                        day.send(`<:delusionise:745632680623996969> The Illusionist killed **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
                        guy.roles.add(dead.id)
                        guy.roles.remove(alive.id)
                    }
                }
            }
            db.delete(`disguised_${message.channel.id}`)
        }
    },
}
