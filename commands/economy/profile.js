module.exports = {
    name: "profile",
    description: "Sends your or another user's profile if unlocked already.",
    usage: `${process.env.PREFIX}profile [user]`,
    run: async (message, args, client) => {
<<<<<<< HEAD
        message.reply({ content: "Sadly this command is currently not available due to technical problems with the hosting platform." })
=======
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
            wins = wins + (data.stats[team]?.win || 0)
            losses = losses + (data.stats[team]?.loss || 0)
            console.log(data.stats[team])
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`${guy.user ? guy.user.tag : guy.tag}'s ${message.l10n("profile")}`)
            .setDescription(data.profileDesc)
            .setThumbnail(data.profileIcon)
            .addField("XP", `${data.xp} XP`, true)
            .addField("Badges", badges === "" ? "No badges" : badges)
            .addField("Stats", `Wins: ${wins}\nLosses: ${losses}\nTies: ${data.stats.tie}\nWin Streak: ${data.winStreak}`)

        message.channel.send("We are currently testing a new buy system. During this time we have some changes as well:\n`buy` - doesn't work. use `+buydep` instead\n`shop` - does not contain the currencies\n`profile` - is back to the original format")
        message.channel.send({ embeds: [embed] })
>>>>>>> d86bf93a9d10483f94e4dee909638aeded4242c7
    },
}

// const { players } = require("../../db.js")
// const { fn } = require("../../config")
// const Canvas = require("canvas")
// const { MessageAttachment, MessageEmbed } = require("discord.js")

// Canvas.registerFont("../../.config/fonts", {familiy: "sans-serif, ffont"})

// const applyName = (canvas, name) => {
//     const context = canvas.getContext("2d")
//     let fontSize = 110
//     do {
//         context.font = `${(fontSize -= 5)}px sans-serif, ffont`
//     } while (context.measureText(name).width > canvas.width - 2 * 240)
//     return context.font
// }
// function wrapText(context, text, x, y, maxWidth, lineHeight) {
//     var words = text.split(" ")
//     var line = ""
//     var lines = 0

//     for (var n = 0; n < words.length; n++) {
//         if (lines === 3) return
//         var testLine = line + words[n] + " "
//         var metrics = context.measureText(testLine)
//         var testWidth = metrics.width
//         if (testWidth > maxWidth && n > 0) {
//             context.fillText(line, x, y)
//             line = words[n] + " "
//             y += lineHeight
//             lines += 1
//         } else {
//             line = testLine
//         }
//     }
//     context.fillText(line, x, y)
// }

// module.exports = {
//     name: "profile",
//     description: "Sends your or another user's profile if unlocked already.",
//     usage: `${process.env.PREFIX}profile [user]`,
//     run: async (message, args, client) => {
//         let guyz
//         if (args[0]) {
//             guyz = fn.getUser(args[0], message)
//         } else {
//             guyz = message.author
//         }
//         if (!guyz) return message.channel.send("Unable to find that user.")
//         if (guyz.author) guyz = guyz.author
//         let guy = await players.findOne({ user: guyz.id })
//         let inventory = guy.profile
//         if (inventory != true && !client.botAdmin(message.author.id)) return message.channel.send(message.l10n("profileNeedToBuy"))
//         if (!guy.profile && !fn.isNarrator(message.member)) return message.channel.send(message.l10n("profileLocked"))

//         let name = guyz.user ? guyz.user.tag : guyz.tag
//         if (name.length > 20) {
//             name = name.slice(0, 15) + "...#" + (guyz.discriminator || guyz.user.discriminator || "N/A")
//         }

//         const canvas = Canvas.createCanvas(1392, 2475)
//         const context = canvas.getContext("2d")

//         const background = await Canvas.loadImage("https://i.imgur.com/RgMrkyD.png")

//         context.drawImage(background, 0, 0, canvas.width, canvas.height)

//         // Name
//         context.font = applyName(canvas, name)
//         context.fillStyle = "#000"
//         context.textAlign = "center"
//         context.textBaseline = "middle"
//         context.fillText(name, canvas.width / 2, 516 - 115, canvas.width - 2 * 233)

//         // XP WINS LOSSES TIES WIN_STREAK
//         let wins = 0
//         let losses = 0
//         for (const team in guy.stats) {
//             if (guy.stats[team].win) wins += guy.stats[team].win
//             if (guy.stats[team].lose) losses += guy.stats[team].lose
//         }
//         let stats = [guy.xp, wins, losses, guy.stats.tie, guy.winStreak]
//         context.font = "80px sans-serif, ffont"
//         context.fillStyle = "#000"
//         context.textAlign = "end"
//         context.textBaseline = "bottom"
//         stats.forEach((stat, i) => context.fillText(stat, canvas.width - 240, 655 + i * 99, canvas.width / 2 - 240))

//         // COINS ROSES GEMS
//         let currencies = [guy.coins, guy.roses, guy.gems]
//         context.font = "80px sans-serif, ffont"
//         context.fillStyle = "#000"
//         context.textAlign = "end"
//         context.textBaseline = "bottom"
//         currencies.forEach((curr, i) => context.fillText(curr, canvas.width - 240, 1295 + i * 99, canvas.width / 2 - 240))

//         // BADGES
//         let desc = ""
//         let count = 0
//         for (const badge in guy.badges) {
//             if (badge === "invite" && guy.badges.invite.unlocked) (desc += `${fn.capitalizeFirstLetter(badge)} `), (count += 1)
//             if (guy.badges[badge] === true && badge !== "invite") (desc += `${fn.capitalizeFirstLetter(badge)} `), (count += 1)
//         }
//         context.font = "70px sans-serif, ffont"
//         context.fillStyle = "#000"
//         context.textAlign = "start"
//         context.textBaseline = "middle"
//         context.fillText(`(${count})`, 560, 1677, canvas.width - 2 * 235)
//         wrapText(context, desc, 250, 1690 + 85, canvas.width - 2 * 235, 80)

//         // DATE
//         context.font = "50px sans-serif, ffont"
//         context.fillStyle = "#7F7F7F"
//         context.textAlign = "end"
//         context.textBaseline = "middle"
//         context.fillText(new Date().toLocaleString("en-GB"), canvas.width - 240, 2112, canvas.width - 2 * 235)

//         let embed = new MessageEmbed().setTitle(name.split("#")[0] + "'s Profile").setColor(guy.displayHexColor || "#1FFF43")
//         if (guy.profileDesc !== "") embed.setDescription(guy.profileDesc)
//         if (guy.profileIcon !== "") embed.setThumbnail(guy.profileIcon, { dynamic: true })

//         const attachment = new MessageAttachment(canvas.toBuffer(), `profile-${message.author.username}-${Date.now()}.png`)
//         if (guy.profileDesc !== "" || guy.profileIcon !== "") message.channel.send({ embeds: [embed] })
//         return message.channel.send({ files: [attachment] })
//     },
// }
