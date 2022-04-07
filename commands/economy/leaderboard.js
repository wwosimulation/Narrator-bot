const { MessageEmbed } = require("discord.js")
const { players } = require("../../db")

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    description: "Displays the current leaderboard for coins, roses, gems, XP or wins!",
    usage: `${process.env.PREFIX}leaderboard [page] [coins | roses | gems | xp | wins]`,
    run: async (message, args, client) => {
        args.forEach((arg, i) => {
            args[i] = arg.toLowerCase()
        })
        function getPage() {
            if (!isNaN(parseInt(args?.[0]))) return parseInt(args[0])
            if (!isNaN(parseInt(args?.[1]))) return parseInt(args[1])
            return 1
        }
        let page = getPage()
        let lbInfo = ["Coin", "Rose", "Gem", "XP", "Win"].find((v) => args?.[0]?.startsWith(v.toLowerCase()) || args?.[1]?.startsWith(v.toLowerCase())) ?? "Coin"
        let dbVar = ["XP"].includes(lbInfo) ? lbInfo.toLowerCase() : lbInfo.toLowerCase() + "s"
        let guys
        if (lbInfo == "Win") {
            guys = await players.find({})
            guys.forEach((e) => {
                let totalWin = 0
                Object.entries(e.stats)
                    .filter((a) => typeof a[1] == "object")
                    .forEach((team) => {
                        totalWin += team[1].win
                    })
                e.wins = totalWin
            })
            guys = guys.filter((e) => e.wins > 0).sort((a, b) => b.wins - a.wins)
        } else {
            let sorting = {}
            sorting[dbVar] = -1
            let filter = {}
            filter[dbVar] = { $gt: lbInfo == "Coin" ? 25 : 0 }
            guys = await players.find(filter).sort(sorting)
        }
        guys = guys.filter((guy) => client.users.cache.has(guy.user))
        let embeds = [{ title: `${lbInfo} Leaderboard`, timestamp: Date.now(), footer: { text: `Page 1/${Math.ceil(guys.length / 10)}` }, description: "", color: 0x1fff43 }]
        guys.forEach((element, i, guyz) => {
            if (i % 10 == 0 && i != 0) {
                embeds.push({ title: `${lbInfo} Leaderboard`, timestamp: Date.now(), footer: { text: `Page ${embeds.length + 1}/${Math.ceil(guyz.length / 10)}` }, description: "", color: 0x1fff43 })
            }
            embeds[embeds.length - 1].description += `${element[dbVar]} - ${client.users.resolve(element.user)?.tag ?? "*Error*"}\n`
        })
        let msg = await message.channel.send({ embeds: [embeds[page - 1] ?? embeds[0]] })

        client.buttonPaginator(message.author.id, msg, embeds, page)
    },
}
