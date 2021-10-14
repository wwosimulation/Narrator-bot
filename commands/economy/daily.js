const { MessageEmbed } = require("discord.js")
const ms = require("parse-ms")
const config = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "daily",
    description: "Claim your daily reward.",
    usage: `${process.env.PREFIX}daily`,
    run: async (message, args, client) => {
        let item = ""
        let amount = ""
        let cooldown = 86400000
        let emote = ""
        let data = await players.findOne({ user: message.author.id })
        let date = data.daily.day // say that 5 times fast xD

        let lastDaily = data.daily.last
        let extra = ""
        let bonus = 1
        if (client.guilds.cache.get(config.ids.server.sim).members.cache.get(message.author.id).premiumSince) {
            bonus = 2
            extra = `\n${message.l10n("boosterDaily")}`
        }
        if (!lastDaily) lastDaily = 0
        let timeLeft = cooldown - (Date.now() - lastDaily)
        if (timeLeft > 0) {
            message.reply(message.l10n("dailyNotReady", { time: `<t:${Math.floor(new Date(Date.now() + timeLeft) / 1000)}:R>` }))
        } else {
            if (date == 0) {
                amount = 10 * bonus
                emote = `${config.getEmoji("coin", client)}`
                item = "coins"
                await data.updateOne({ $inc: { coins: amount } })
            } else if (date == 1) {
                item = "rose"
                emote = `${config.getEmoji("rosesingle", client)}`
                amount = 1 * bonus
                await data.updateOne({ $inc: { "inventory.rose": amount } })
            } else if (date == 2) {
                amount = 1 * bonus
                item = "rose bouquet"
                emote = `${config.getEmoji("rosebouquet", client)}`
                await data.updateOne({ $inc: { "inventory.bouquet": amount } })
            } else if (date == 3) {
                amount = 1 * bonus
                emote = `${config.getEmoji("lootbox", client)}`
                item = "lootbox!"
                extra = `\nTo use it, do \`+use lootbox\`${extra}`
                await data.updateOne({ $inc: { "inventory.lootbox": amount } })
            } else if (date == 4) {
                item = "coins"
                emote = `${config.getEmoji("coin", client)}`
                amount = 20 * bonus
                await data.updateOne({ $inc: { coins: amount } })
            } else if (date == 5) {
                item = "roses"
                emote = `${config.getEmoji("rosesingle", client)}`
                amount = 5 * bonus
                await data.updateOne({ $inc: { "inventory.rose": amount } })
            } else if (date == 6) {
                amount = 30 * bonus
                item = "coins"
                emote = `${config.getEmoji("coin", client)}`
                await data.updateOne({ $set: { "daily.day": -1 } })
                await data.updateOne({ $inc: { coins: amount } })
            }
            let dailymsg = new MessageEmbed().setTitle("Daily Rewards! Woohooo!").setDescription(`${message.l10n("daily", { emoji: emote, number: amount, prize: item })}${extra}`)
            message.channel.send({ embeds: [dailymsg] })

            await data.updateOne({ $inc: { "daily.day": 1 } })
            await data.updateOne({ $set: { "daily.last": Date.now() } })
        }
    },
}
