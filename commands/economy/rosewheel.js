const { rosewheel } = require("../../config/src")
const { sleep } = require("../../config/src/fn")
const players = require("../../schemas/players")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "rosewheel",
    description: "Spin the rosewheel for 30 roses and win awsome prizes!",
    usage: `${process.env.PREFIX}rosewheel`,
    aliases: ["rw", "spin"],
    run: async (message, args, client) => {
        let guy = await players.findOne({ user: message.author.id })
        if (!guy || !guy.roses >= 30) return message.channel.send(message.l10n("notEnoughCurrency", { currency: "roses" }))
        let prizes = []

        rosewheel.forEach((item) => {
            for (let i = item.rate; i > 0; i--) {
                prizes.push(item)
            }
        })

        let prize = rosewheel[Math.floor(Math.random() * rosewheel.length)]
        let res = ["1", "2", "3", "4"]

        let update = { roses: -30 }
        let response = message.l10n("rosewheel" + res[Math.floor(Math.random() * res.length)], { prize: prize.name, prizeAmount: prize.amount, prizeName: prize.name.split(" ").slice(-1)[0] })

        update[prize.item] = prize.amount
        await guy.updateOne({ $inc: update})
        message.reply({embeds:[
            new MessageEmbed().setColor("#1FFF43").setImage("https://i.imgur.com/NZzTW8h.gif" ).setTimestamp().setTitle("The wheel is spinning...").setAuthor(message.author.tag +"'s rose wheel", message.author.avatarURL())
        ]}).then((msg) => {
            setTimeout(() => {
                msg.edit({embeds:[
                    new MessageEmbed().setColor("#1FFF43").setTimestamp().setTitle(`You won ${prize.name}!`).setDescription(response).setAuthor(message.author.tag +"'s rose wheel", message.author.avatarURL()).setThumbnail(`https://www.wolvesville.com/static/media/${prize.icon}.png`)
                ]})
            }, 2500)
        })
    },
}
