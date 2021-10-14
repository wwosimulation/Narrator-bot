const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "shadow",
    description: "Manipulate the voting.",
    usage: `${process.env.PREFIX}shadow`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-shadow-wolf") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let abil = db.get(`shadow_${message.channel.id}`)
            let gamePhase = db.get(`gamePhase`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (abil == "yes") return message.channel.send("You have already used your ability!")
            if (gamePhase % 3 != 1) return message.channel.send("You can use your ability only at night!")
            message.guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("shadow", client)} The Shadow Wolf has manipulated voting today!`)
            db.set(`vtshadow`, true)
            db.set(`shadow_${message.channel.id}`, "yes")
            message.guild.channels.cache
                .find((c) => c.name === "vote-chat")
                .permissionOverwrites.edit(alive.id, {
                    VIEW_CHANNEL: false,
                })
            message.guild.channels.cache
                .find((c) => c.name === "vote-chat")
                .permissionOverwrites.edit(dead.id, {
                    VIEW_CHANNEL: false,
                })
        }
    },
}
