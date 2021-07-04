module.exports = {
    name: "massping",
    aliases: ["sjjsjs", "wake"],
    narratorOnly: true,
    run: async (message, args, client) => {
        for (let i = 0; i < 10; i++) {
            let a = message.guild.members.cache.find((m) => m.nickname === args[0])
            message.channel.send(`${a} wakey wakey`)
        }
    },
}
