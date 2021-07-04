let sentMessage = (sentMessage) => sentMessage.react
module.exports = {
    name: "sow",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let channel = message.guild.channels.cache.find((c) => c.name === "vote-chat")
        message.delete()
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let m = await channel.send(`<@&${alive.id}> Start or Wait?`)
        await m.react("👍")
        await m.react("👎")
    },
}
