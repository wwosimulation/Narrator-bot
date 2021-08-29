const { fn, emojis } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "am",
    description: "Add money to a user's balance.",
    usage: `${process.env.PREFIX}am <amount> <user>`,
    aliases: ["addmoney"],
    staffOnly: true,
    run: async (message, args) => {
        let amount = parseInt(args[0])
        if (!amount) return message.channel.send(message.i10n("amountInvalid", { amount: args[0] }))
        args.shift()
        msg = ``
        args.forEach(async (x) => {
            let user = fn.getUser(x, message)
            if (user) {
                let data = players.findOneAndUpdate({ user: user.id }, { $inc: { coins: amount } }).exec()
                msg += `${message.i10n("coinsAdded", { amount: `${amount} ${emojis.coin}`, user: user.user.tag })}\n`
            } else {
                msg += `${message.i10n("userInvalid", { user: x })}\n`
            }
        })
        message.channel.send(msg)
    },
}
