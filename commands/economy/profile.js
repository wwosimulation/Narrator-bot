const { players } = require("../../db.js")
const { emojis, fn, xp } = require("../../config")
const Canvas = require("canvas")
const { MessageAttachment } = require("discord.js")

const applyName = (canvas, name) => {
    const context = canvas.getContext('2d');
    let fontSize = 110;
    do {
        context.font = `${fontSize -= 5}px sans-serif`;
    } while (context.measureText(name).width > canvas.width - 2 * 240);
    return context.font;
};
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var lines = 0

    for(var n = 0; n < words.length; n++) {
        if(lines === 3) return
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            lines += 1
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
  }

module.exports = {
    name: "profile",
    description: "Sends your or another user's profile if unlocked already.",
    usage: `${process.env.PREFIX}profile [user]`,
    run: async (message, args, client) =>{
        let guyz
        if(args[0]) guyz = fn.getUser(args[0], message) || message.member

        let guy = await players.findOne({ user: guyz.id })
        let inventory = guy.profile
        if (inventory != true && !client.botAdmin(message.author.id)) return message.channel.send(message.l10n("profileNeedToBuy"))
        if (!guy.profile && !fn.isNarrator(message.member)) return message.channel.send(message.l10n("profileLocked"))

        let name  = guyz.user ? guyz.user.tag : guy.tag
        if(name.length > 20) {
            name = name.slice(0, 15) + '...#' +  message.author.discriminator
        }

        const canvas = Canvas.createCanvas(1392, 2475)
        const context = canvas.getContext("2d")

        const background = await Canvas.loadImage("https://media.discordapp.net/attachments/840938544129638420/905840884195688538/profile_raw.png" )
        
        context.drawImage(background, 0, 0, canvas.width, canvas.height)

        // Name
        context.font = applyName(canvas, name)
        context.fillStyle = "#000"
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.fillText(name, canvas.width / 2, 516 - 115, canvas.width - 2 * 233)

        // XP WINS LOSSES TIES WIN_STREAK
        let stats = `${[guy.xp, guy.stats.wins, guy.stats.losses,guy.stats.ties, guy.stats.streak].join("\n")}`
        context.font = "80px sans-serif"
        context.fillStyle = "#000"
        context.textAlign = "end"
        context.textBaseline = "middle"
        context.fillText(stats, canvas.width - 240, 623, canvas.width / 2 - 240)

        // COINS ROSES GEMS
        let currencies = `${[guy.coins, guy.roses, guy.gems].join("\n")}`
        context.font = "80px sans-serif"
        context.fillStyle = "#000"
        context.textAlign = "end"
        context.textBaseline = "middle"
        context.fillText(currencies, canvas.width - 240, 1255, canvas.width / 2 - 240)

        // BADGES
        let desc = ""
        let count = 0
        for (const badge in guy.badges) {
            if (badge === "invite" && guy.badges.invite.unlocked) (desc += `${fn.capitalizeFirstLetter(badge)} `, count += 1)
            if (guy.badges[badge] === true && badge !== "invite") (desc += `${fn.capitalizeFirstLetter(badge)} `, count += 1)
        }
        context.font = "70px sans-serif"
        context.fillStyle = "#000"
        context.textAlign = "start"
        context.textBaseline = "middle"
        context.fillText(`(${count})`, 560, 1677 , canvas.width - 2 * 235)
        wrapText(context, desc, 250, 1690 + 85, canvas.width - 2 * 235, 80)

        // DATE
        context.font = "50px sans-serif"
        context.fillStyle = "#7F7F7F"
        context.textAlign = "end"
        context.textBaseline = "middle"
        context.fillText(new Date().toLocaleString("en-GB"),  canvas.width - 240, 2112 , canvas.width - 2 * 235)
        
        const attachment = new MessageAttachment(canvas.toBuffer(), `profile-${message.author.username}-${Date.now()}.png`)
        message.channel.send({files: [attachment]})
        }
    }