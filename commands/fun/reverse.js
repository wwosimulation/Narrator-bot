const Discord = require("discord.js")
module.exports = {
    name: "reverse",
    aliases: ["rev"],
    run: async (message, args, client) => {
        const newargs = args.join(" ")
        const msg = newargs.split("").reverse().join("")

        message.channel.send(msg)
    },
}
