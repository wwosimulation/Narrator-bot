const { getUser } = require("../../config/src/fn")

module.exports = {
    name: "massping",
    description: "Massping an innocent user so they wake up.",
    usage: `${process.env.PREFIX}massping <nickname>`,
    aliases: ["sjjsjs", "wake"],
    narratorOnly: true,
    run: async (message, args) => {
        for (let i = 0; i < 10; i++) {
            let a = getUser(args.join(" "), message)
            message.channel.send(`${a} wakey wakey`)
        }
    },
}
