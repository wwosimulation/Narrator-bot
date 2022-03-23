const Discord = require("discord.js")
const db = require("quick.db")
const { fn, xp, roles, soloKillers } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "win",
    description: "Announce the winning team and its players.",
    usage: `${process.env.PREFIX}win <team> <player...>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let winTeam = args[0]?.toLowerCase()
        if (args.length < 2 || !xp.teamMultipliers[winTeam]) return message.channel.send("Please specify the winning team and its players! Valid teams are the following:\n" + Object.keys(xp.teamMultipliers).join(", "))

        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        if (alive.members.size != "0") return message.channel.send('To use this command, everyone must have the "Dead" role! Use `+suicideall` if you need to kill everyone at once.')
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")

        let allPlayers = [],
            winners = [],
            losers = []
        for (let i = 1; i <= dead.members.size; i++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === i.toString() && m.roles.cache.has(dead.id))

            if (guy) {
                allPlayers.push(guy.id)
                if (args.includes(guy.nickname)) {
                    winners.push(guy.id)
                } else {
                    losers.push(guy.id)
                }
            }
        }

        let winXP = xp.win(allPlayers.length, winTeam)
        let loseXP = xp.lose(allPlayers.length)

        for await (x of allPlayers) {
            let data = await players.findOne({ user: x }).exec()
            let xpStreak = 0,
                xpBase = 0

            if (winners.includes(x)) {
                xpBase = winXP
                data.winStreak += 1
                if (data.stats[winTeam]) data.stats[winTeam].win += 1
            } else if (losers.includes(x)) {
                xpBase = loseXP
                client.channels.cache.get("606123726966358037").send(`Add one loss to ${x} for the ${db.get(`role_${x}`)} role in game ${db.get("game")}.`)
                data.winStreak = 0
            }
            if (data.winStreak > 0) {
                xpStreak = xp.streakXP(data.winStreak) || 0
            }

            // send each x an embed with their xp
            let xpEmbed = new Discord.MessageEmbed({ color: "#008800", title: "Game ended!", thumbnail: { url: client.user.avatarURL() }, description: `Result: ${winners.includes(x) ? "You won!" : "You lost."}\n\nXP gained: ${xpBase} XP${data.winStreak > 1 ? `\n${data.winStreak} Game Streak - ${xpStreak} Bonus XP` : ""}` })
            client.users.cache.get(x).send({ embeds: [xpEmbed] }).catch(e => {
                client.channels.cache.get("892046258737385473")?.send({ embeds: [xpEmbed], content: `<@${x}>, I couldn't DM you!` })
            })
            console.log(xpBase, xpStreak)
            data.xp += xpBase + xpStreak
            data.save()
        }

        message.channel.send("XP is being given! Thanks for playing :)")
        message.channel.send(`Winners: ${winners.map((x) => `<@${x}> `)}\nLosers: ${losers.map((x) => `<@${x}> `)}`)
        db.set("xpGiven", true)
    },
}
