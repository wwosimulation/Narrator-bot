const { players } = require("../../db.js")
const Discord = require("discord.js")
const { emojis, fn } = require("../../config")

module.exports = {
    name: "profile",
    run: async (message, args, client) => {
        let data = await players.findOne({ user: message.author.id })
        let inventory = data.profile

        if (inventory != true && !client.botAdmin(message.author.id)) return message.channel.send(message.i10n("profileNeedToBuy"))
        let guy
        if (args[0]) {
            guy = fn.getUser(args[0], message)
        } else {
            guy = message.author
        }
        if (!guy) return message.channel.send("Unable to find that user.")
        if (guy.author) guy = guy.author

        if (!data.profile && !fn.isNarrator(message.member)) return message.channel.send(message.i10n("profileLocked"))

        console.log(data.roses)
        // TODO: reformat this
        let embed = new Discord.MessageEmbed()
            .setTitle(`${guy.user ? guy.user.tag : guy.tag}'s ${message.i10n("profile")}`)
            .setDescription(data.profileDesc)
            .setThumbnail(data.profileIcon)
            .addField("XP", `${data.xp} XP`, true)
            .addField("Stats", "Coming soon!")
        //.addField("Stats", `Wins: ${wins}\nLoses: ${lost}\nTies: ${tie}\nWin Streak: ${winstreak}\n\nWin as Village: ${villagewin}\nLost as Village: ${villagelost}\n\nWin as Werewolf: ${wwwin}\nLost as Werewolf: ${wwlost}\n\nWin as Solo Voting: ${solovwin}\nLost as Solo Voting: ${solovlost}\n\nWin as Solo Killer: ${solokwin}\nLost as Solo Killing: ${soloklost}\n\nWins as Couple: ${couplewin}\nLost as Couple: ${couplelost}`)

        message.channel.send({ embeds: [embed] })
    },
}
