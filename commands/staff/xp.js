const { fn } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "xp",
    narratorOnly: true,
    run: async (message, args) => {
        if (!args.length == 3) return message.channel.send("Invalid arguments! Use `+xp <add/remove/set> <user> <amount>`")
        let run = args[0]
        let user = fn.getUser(args[1], message)
        let amount = parseInt(args[2])
        let data = await players.findOne({ user: user.id })
        if (!user || !amount) return message.channel.send("Invalid arguments! Use `+xp <add/remove/set> <user> <amount>`")

        if (!data) {
            data = await players.create({
                user: user.id,
            })
            data.save()
        }

        if (run == "add" || run == "remove") {
            if (run == "remove") {
                amount = -amount
            }
            run = "$inc"
        }
        if (run == "set") {
            run = "$set"
        }

        var obj = {}
        obj[run] = {
            xp: amount,
        }
        await data.updateOne(obj)

        message.channel.send(`Successfully ran \`${run} ${amount}\` on ${user.id}`)
    },
}
