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
        let total = 0
        let totalWin = 0
        let totalLoss = 0
        let fields = []
        let description = ""

        Object.entries(data.stats).filter(a => typeof a[1] == "object").forEach((team) => {
            let obj = {name: fn.capitalizeFirstLetter(team[0]), value: `Wins: ${team[1].win}\nLoss: ${team[1].lose}`, inline: true}
            totalWin += team[1].win
            totalLoss += team[1].lose
            fields.push(obj)
        })
        total = totalLoss + totalWin + data.ties

        let embed = new MessageEmbed({description, fields})
    },
}