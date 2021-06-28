const Discord = require("discord.js")
const ms = require("parse-ms")
const config = require("../../config.js")
const { players } = require("../../db.js")

module.exports = {
    name: "daily",
    run: async (message, args, client) => {
        let item = ""
        let amount = ""
        let cooldown = 86400000
        let emote = ""
        let data = await players.findOne({ user: message.author.id })
        let date = data.daily.day // say that 5 times fast xD

        let lastDaily = data.daily.last
        let extra = ""

        if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
            let time = ms(cooldown - (Date.now() - lastDaily))
            let hrs = `${time.hours} hours`
            let min = `${time.minutes} minutes and`
            let sec = `${time.seconds} seconds`
            if (hrs == 0) hrs = ""
            if (min == 0) min = ""
            if (sec == 0) sec = ""
            console.log(hrs)
            message.reply(`No. Come back in ${hrs} ${min} ${sec}`)
        } else {
            if (date == 0) {
                amount = 10
                emote = "<:coin:606434686931173377>"
                item = "coins"
                data.coins += 10
            } else if (date == 1) {
                item = "rose"
                emote = "<:rosesingle:807256844191793158>"
                amount = 1
                data.inventory.rose += 1
            } else if (date == 2) {
                amount = 1
                item = "rose bouquet"
                emote = "<:rosebouquet:808545517209387008>"
                data.inventory.bouquet += 1
            } else if (date == 3) {
                amount = 1
                emote = "<:lootbox:808548473548963861>"
                item = "lootbox!\n\nTo use it, do `+use lootbox`"
                data.inventory.lootbox += 1
            } else if (date == 4) {
                item = "coins"
                emote = "<:coin:606434686931173377>"
                amount = 20
                data.coins += 20
            } else if (date == 5) {
                item = "roses"
                emote = "<:rosesingle:807256844191793158>"
                amount = 5
                data.inventory.roses += 5
            } else if (date == 6) {
                amount = 30
                item = "coins"
                emote = "<:coin:606434686931173377>"
                data.daily.day = -1
                data.coins += 30
            }
            if(client.guilds.cache.get(config.ids.server.sim).members.cache.get(message.author.id).premiumSinceTimestamp > 0) {
                amount = amount * 2
                extra = "\nBecause you are a booster, you received double the normal rewards amount!"
            }

            message.channel.send(new Discord.MessageEmbed().setTitle("Daily Rewards! Woohooo!").setDescription(`${emote} Nice! You have recieved ${amount} ${item}!${extra}`))
            data.daily.dau += 1
            data.daily.last = Date.now()
        }
        data.save()
    },
}
