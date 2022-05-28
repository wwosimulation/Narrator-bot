const db = require("quick.db")
const { fn, xp, roles, getRole } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "win",
    description: "Announce the winning team and its players.",
    usage: `${process.env.PREFIX}win <team> <player...>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let winTeam = args[0]?.toLowerCase()
        let tie = false
        if (args[0] && args?.[0].toLowerCase() == "tie") tie = true
        else if (args.length < 2 || !xp.teamMultipliers[winTeam]) return message.channel.send("Please specify the winning team and its players! Valid teams are the following:\n" + Object.keys(xp.teamMultipliers).join(", "))

        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        if (alive.members.size != "0") {
            client.commands.get("killall").run(message, args, client)
            return message.channel.send("All players killed. Please use the command again.")
        }
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")

        let allPlayers = [],
            winners = [],
            losers = []
        for (let i = 1; i <= dead.members.size; i++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === i.toString() && m.roles.cache.has(dead.id) && !db.get("xpExclude").includes(m.nickname))

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
        let tieXP = xp.tie(allPlayers.length)

        for await (x of allPlayers) {
            let data = await players.findOne({ user: x }).exec()
            let xpStreak = 0,
                xpBase = 0

            if (winners.includes(x)) {
                xpBase = winXP
                let wt = winTeam
                if (wt == "evil") {
                    let role = getRole(db.get(`role_${x}`))
                    wt = role.name == "Unknown Role" || role.name == "Modded" ? "modded" : role.team != "Solo" ? role.team : role.soloKiller == true ? "solokiller" : "solovoting"
                }
                data.winStreak += 1
                data.stats[wt] ? (data.stats[wt].win += 1) : (data.stats.modded.win += 1)
            } else if (losers.includes(x)) {
                let role = getRole(db.get(`role_${x}`))
                let team = role.name == "Unknown Role" || role.name == "Modded" ? "modded" : role.team != "Solo" ? role.team : role.soloKiller == true ? "solokiller" : "solovoting"
                xpBase = loseXP
                data.winStreak = 0
                data.stats[team] ? data.stats[team].lose++ : data.stats.modded.lose++
            } else {
                data.stats.tie++
                data.winStreak = 0
                xpBase = tieXP
            }
            if (data.winStreak > 0) {
                xpStreak = xp.streakXP(data.winStreak) || 0
            }

            // send each x an embed with their xp
            let xpEmbed = { color: 0x008800, title: "Game ended!", thumbnail: { url: client.user.avatarURL() }, description: `Result: ${tie ? "Tie!" : winners.includes(x) ? "You won!" : "You lost."}\n\nXP gained: ${xpBase} XP${data.winStreak > 1 ? `\n${data.winStreak} Game Streak - ${xpStreak} Bonus XP` : ""}` }
            data.save()
            xp.level(client.users.cache.get(x), xpBase + xpStreak, xpEmbed, message.guild.channels.cache.get("892046258737385473"))
        }

        message.channel.send("XP is being given! Thanks for playing :)")
        message.channel.send(`Winners: ${winners.map((x) => `<@${x}> `)}\nLosers: ${losers.map((x) => `<@${x}> `)}`)
        db.set("xpGiven", true)
        db.set("xpExclude", [])
    },
}
