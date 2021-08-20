const db = require("quick.db")
const Discord = require("discord.js")
const { fn } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "xp",
    description: "Change the xp of a user. You can `<add | remove | set>` the amount.",
    usage: `${process.env.PREFIX}xp (add | remove | set) <user> <amount>`,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (!args.length == 3) return message.channel.send("Invalid arguments! Use `+xp <add/remove/set> <user> <amount>`")
        let run = args[0]
        let user = fn.getUser(args[1], message)
        let amount = parseInt(args[2])
        let data = await players.findOne({ user: user.id })
        if (!user || !amount) return message.channel.send("Invalid arguments! Use `+xp <add/remove/set> <user> <amount>`")

        if (run == "add") data.xp += amount
        if (run == "remove") data.xp = data.xp - amount
        if (run == "set") data.xp = amount

        data.save()
        message.channel.send(`Successfully ran \`${run} ${amount}\` on ${user.id}`)
    },
}
