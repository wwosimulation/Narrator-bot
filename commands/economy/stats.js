const { fn, emojis } = require("../../config")
const { players } = require("../../db")
const { getLangNameFromCode } = require("language-name-map")

module.exports = {
    name: "stats",
    description: "",
    usage: `${process.env.PREFIX}stats [user]`,
    run: async (message, args, client) => {
        let member = fn.getUser(args.join(" "), message)
        if (!member) member = message.author
        let data = await players.findOne({ user: member.id })
        let totalWin = 0
        let totalLoss = 0
        let fields = []
        let color = 0x00ffff
        let footer = { text: "Requested by " + message.author.tag }

        Object.entries(data.stats)
            .filter((a) => typeof a[1] == "object")
            .forEach((team) => {
                let obj = { name: fn.capitalizeFirstLetter(team[0]), value: `Wins: ${team[1].win}\nLosses: ${team[1].lose}`, inline: true }
                totalWin += team[1].win
                totalLoss += team[1].lose
                fields.push(obj)
            })
        data.tie = data.tie ?? 0
        let total = totalLoss + totalWin + data.tie
        let description = `The user's language is: ${getLangNameFromCode(data.language) ? (getLangNameFromCode(data.language)?.native + " - " + getLangNameFromCode(data.language)?.name) : data.language}\n\nWin Streak: ${data.winStreak}\nGames played: ${total}\n\nTotal Wins: ${totalWin}\nTotal Losses: ${totalLoss}\nTies: ${data.stats.tie}\nFlees: ${data.stats.flee}\n\nWinrate: ${((totalWin / total) * 100 + "").slice(0, 5)}%`
        let title = member.user.tag + "'s Stats"

        let embed = { description, fields, color, title, timestamp: Date.now(), footer, thumbnail: { url: member.user.avatarURL() } }
        message.channel.send({ embeds: [embed] })
    },
}
