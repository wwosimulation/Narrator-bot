const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "snap",
    description: "Kill all players you disguised before.",
    usage: `${process.env.PREFIX}snap`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-illusionist") {
            let disguises = db.get(`disguised_${message.channel.id}`) || []
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let gamePhase = db.get(`gamePhase`)
            let commandEnabled = db.get(`commandEnabled`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (disguises.length == 0) return message.channel.send("You haven't disguised any player yet!")
            if (gamePhase % 3 != 1) return message.channel.send("You can kill players during the day, when it's the discussion time.")
            if (commandEnabled == "yes") return message.channel.send("You can kill players during the day, when it's the discussion time.")
            for (let i = 0; i < disguises.length; i++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === disguises[i])
                if (guy) {
                    if (guy.roles.cache.has(alive.id)) {
                        let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                        day.send(`${getEmoji("delusionise", client)} The Illusionist killed **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
                        guy.roles.add(dead.id)
                        guy.roles.remove(alive.id)
                    }
                }
            }
            db.delete(`disguised_${message.channel.id}`)
        }
    },
}
