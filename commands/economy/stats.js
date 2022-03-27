const { MessageEmbed } = require("discord.js")
const { fn, emojis } = require("../../config")
const { players } = require("../../db")

module.exports = {
    name: "stats",
    description: "",
    usage: `${process.env.PREFIX}stats <user>`,
    run: async (message, args, client) => {
        let user = fn.getUser(args.join(" "), message)
        if (!user) user = message.author
        let data = await players.findOne({ user: user.id })
        let total 
        let totalWin
        let totalLoss
        let fields = []

        let embed = new MessageEmbed().addFields(fields)
    },
}