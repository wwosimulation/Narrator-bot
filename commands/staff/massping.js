module.exports = {
    name: "massping",
    description: "Massping an innocent user so they wake up.",
    usage: `${process.env.PREFIX}massping <nickname>`,
    aliases: ["sjjsjs", "wake"],
    narratorOnly: true,
    run: async (message, args) => {
        for (let i = 0; i < 10; i++) {
            let a = message.guild.members.cache.find((m) => m.nickname === args[0])
            message.channel.send(`${a} wakey wakey`)
        }
    },
}
