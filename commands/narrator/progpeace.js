module.exports = {
    name: "progpeace",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        dayChat.send({ content: `${alive}\nPeace be upon you dear villagers. No one can die the following night!` })
    },
}
