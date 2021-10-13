const { fn, emojis } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "rm",
    description: "Remove money from a user.",
    usage: `${process.env.PREFIX}rm <amount> <user>`,
    aliases: ["removemoney"],
    staffOnly: true,
    run: async (message, args) => {
        let amount = parseInt(args[0])
        if (!amount) return message.channel.send(message.l10n("amountInvalid", { amount: args[0] }))
        args.shift()
        msg = ``
        amount = 0 - amount
        args.forEach(async (x) => {
            let user = fn.getUser(x, message)
            if (user) {
                let data = players.findOneAndUpdate({ user: user.id }, { $inc: { coins: amount } }).exec()
                msg += `${message.l10n("coinsRemoved", { amount: `${amount} ${emojis.coin}`, user: user.user.tag })}\n`
            } else {
                msg += `${message.l10n("userInvalid", { user: x })}\n`
            }
        })
        message.channel.send(msg)
    },
}
