module.exports = {
    name: "hohoho",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-santa-claus") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")

            message.guild.channels.cache.find((c) => c.name === "day-chat").send(`${alive} HO HO HO`)
        }
    },
}
