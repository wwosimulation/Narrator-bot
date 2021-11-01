const { players } = require("../../db.js")
const Discord = require("discord.js")
const { emojis, fn, xp } = require("../../config")

module.exports = {
    name: "profile",
    description: "Sends your or another user's profile if unlocked already.",
    usage: `${process.env.PREFIX}profile [user]`,
    run: async (message, args, client) => {
        let guy
        if (args[0]) {
            guy = fn.getUser(args[0], message)
        } else {
            guy = message.author
        }
        if (!guy) return message.channel.send("Unable to find that user.")
        if (guy.author) guy = guy.author
        let data = await players.findOne({ user: guy.id })
        let inventory = data.profile

        if (inventory != true && !client.botAdmin(message.author.id)) return message.channel.send(message.l10n("profileNeedToBuy"))

        if (!data.profile && !fn.isNarrator(message.member)) return message.channel.send(message.l10n("profileLocked"))

        let badges = ""
        for (const badge in data.badges) {
            if (badge === "invite" && data.badges.invite.unlocked) badges = badges + fn.capitalizeFirstLetter(badge)
            if (badge !== "invite") badges = badges + `\`${fn.capitalizeFirstLetter(badge)}\``
        }

        let wins = 0,
            losses = 0
        for (let team in xp.teamMultipliers) {
            wins = wins + data.stats[team].win
            losses = losses + data.stats[team].loss
            console.log(data.stats[team])
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`${guy.user ? guy.user.tag : guy.tag}'s ${message.l10n("profile")}`)
            .setDescription(data.profileDesc)
            .setThumbnail(data.profileIcon)
            .addField("XP", `${data.xp} XP`, true)
            .addField("Badges", badges === "" ? "No badges" : badges)
            .addField("Stats", `Wins: ${wins}\nLosses: ${losses}\nTies: ${data.stats.tie}\nWin Streak: ${data.winStreak}`)

        message.channel.send({ embeds: [embed] })
    },
}
