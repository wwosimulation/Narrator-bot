const db = require("quick.db")
const Discord = require("discord.js")
const { fn } = require("../../config.js")

module.exports = {
    name: "xp",
    narratorOnly: true,
    run: async (message, args, client) => {
        if (!args.length == 3) return message.channel.send("Invalid arguments! Use `+xp <add/remove/set> <user> <amount>`")
        let run = args[0]
        let user = fn.getUser(args[1], message)
        let amount = parseInt(args[2])

        if (!user || !amount) return message.channel.send("Invalid arguments! Use `+xp <add/remove/set> <user> <amount>`")

        if(run == "add") db.add(`xp_${user.id}`, amount)
        if(run == "remove") db.subtract(`xp_${user.id}`, amount)
        if(run == "set") db.set(`xp_${user.id}`, amount)

        message.channel.send(`Successfully ran \`${run} ${amount}\` on ${user.id}`)
    },
}
