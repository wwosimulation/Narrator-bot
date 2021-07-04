const { fn, emojis } = require("../../config.js")
const { players } = require("../../db")

module.exports = {
    name: "balance",
    aliases: ["bal", "coins", "money"],
    run: async (message, args) => {
        let user = fn.getUser(args.join(" "), message)
        if (!user) user = message.author

        let data = await players.findOne({ user: user.id })
        return message.channel.send(`${user.id == message.author.id ? "You" : user.user.tag} currently ${user.id == message.author.id ? "have" : "has"} ${data.coins} coins ${emojis.coin}`)
    },
}
