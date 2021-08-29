const { fn, emojis } = require("../../config")
const { players } = require("../../db")

module.exports = {
    name: "balance",
    description: "Shows your or another user's balance.",
    usage: `${process.env.PREFIX}balance [user]`,
    aliases: ["bal", "coins", "money"],
    run: async (message, args) => {
        let user = fn.getUser(args.join(" "), message)
        if (!user) user = message.author

        let data = await players.findOne({ user: user.id })
        return message.channel.send(`${user.id == message.author.id ? "You" : user.user.tag} currently ${user.id == message.author.id ? "have" : "has"} ${data.coins ? data.coins : "0"} coins ${emojis.coin}`)
    },
}
