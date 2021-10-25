const { fn } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "xp",
    description: "Change the xp of a user. You can `<add | remove | set>` the amount.",
    usage: `${process.env.PREFIX}xp (add | remove | set) <user> <amount>`,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (!args.length == 3) return message.channel.send(message.l10n("xpFormatInvalid"))
        let run = args[0]
        let user = fn.getUser(args[1], message)
        let amount = parseInt(args[2])
        let data = await players.findOne({ user: user.id })
        if (!user || !amount) return message.channel.send(message.l10n("xpFormatInvalid"))

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
        fn.updateXP(user.id, client)

        message.channel.send(message.l10n("commandRan", { command: `${run} ${amount}`, user: user.id }))
    },
}
