const { rosewheel } = require("../../config/src")
const { sleep } = require("../../config/src/fn")
const players = require("../../schemas/players")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "rosewheel",
    description: "Spin the rosewheel for 20 roses and win awsome prizes!",
    usage: `${process.env.PREFIX}rosewheel`,
    aliases: ["rw", "spin"],
    run: async (message, args, client) => {
        let guy = await players.findOne({ user: message.author.id })
        if (!guy || guy.roses < 20) return message.channel.send(message.l10n("notEnoughCurrency", { currency: "roses" }))
        let prizes = []

        rosewheel.forEach((item) => {
            for (let i = item.rate; i > 0; i--) {
                prizes.push(item)
            }
        })
        let prize = prizes[Math.floor(Math.random() * prizes.length)]
        let res = ["1", "2", "3", "4"]

        let update = { roses: -20 }
        let response = message.l10n("rosewheel" + res[Math.floor(Math.random() * res.length)], { prize: prize.name, prizeAmount: prize.amount, prizeName: prize.name.split(" ").slice(-1)[0] })

        update[prize.item] = prize.amount
        await guy.updateOne({ $inc: update })
        message
            .reply({
                embeds: [new MessageEmbed({ title: "The wheel is spinning...", author: { name: message.author.tag + "'s rose wheel", iconURL: message.author.avatarURL() }, color: "#1FFF43", image: { url: "https://i.imgur.com/NZzTW8h.gif" } }).setTimestamp()],
            })
            .then((msg) => {
                setTimeout(() => {
                    msg.edit({
                        embeds: [new MessageEmbed({ color: "#1FFF43", title: `You won ${prize.name}!`, description: response, author: { name: message.author.tag + "'s rose wheel", iconURL: message.author.avatarURL() }, thumbnail: { url: prize.icon ? `https://www.wolvesville.com/static/media/${prize.icon}.png` : "https://static.thenounproject.com/png/340719-200.png" } }).setTimestamp()],
                    })
                }, 4000)
            })
    },
}
