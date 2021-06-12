const Discord = require("discord.js");
const ms = require("parse-ms");
const db = require('quick.db')
const config = require("../../config.js")


module.exports = {
  name: "daily",
  run: async (message, args, client) => {
    let item = ""
    let amount = ""
    let cooldown = 86400000
    let smessage = '' 
    let emote = ""
    let boost = (client.guilds.cache.get(config.ids.server.sim).members.cache.get(message.author.id).premiumSinceTimestamp > 0)
    let date = db.get(`thedate_${message.author.id}`) || 0

    let daily = db.get(`daily_${message.author.id}`) || 0
    
    if (daily !== null && cooldown - (Date.now() - daily) > 0) {
      let time = ms(cooldown - (Date.now() - daily)) 
      let hrs = `${time.hours} hours`
      let min = `${time.minutes} minutes and`
      let sec = `${time.seconds} seconds`
      if (hrs == 0) hrs = ''
      if (min == 0) min = ''
      if (sec == 0) sec = ''
      console.log(hrs)
      message.reply(`No. Come back in ${hrs} ${min} ${sec}`)
    } else {
     
      if (date == 0) {
        amount = 10 * (boost ? 2 : 1)
        emote = "<:coin:606434686931173377>"
        item = "coins"
        db.add(`money_${message.author.id}`, amount)
      } else if (date == 1) {
        item = "rose"
        emote = "<:rosesingle:807256844191793158>"
        amount = 1 * (boost ? 2 : 1)
        db.add(`roseG_${message.author.id}`, amount)
      } else if (date == 2) {
        amount = 1 * (boost ? 2 : 1)
        item = "rose bouquet"
        emote = "<:rosebouquet:808545517209387008>"
        db.add(`roseBouquet_${message.author.id}`, amount)
      } else if (date == 3) {
        amount = 1 * (boost ? 2 : 1)
        emote = "<:lootbox:808548473548963861>"
        item = "lootbox!\n\nTo use it, do `+use lootbox`"
        db.add(`lootbox_${message.author.id}`, amount)
      } else if (date == 4) {
        item = "coins"
        emote = "<:coin:606434686931173377>"
        amount = 20 * (boost ? 2 : 1)
        db.add(`money_${message.author.id}`, amount)
      } else if (date == 5) {
        item = "roses"
        emote = "<:rosesingle:807256844191793158>"
        amount = 5 * (boost ? 2 : 1)
        db.add(`roseG_${message.author.id}`, amount)
      } else if (date == 6) {
        amount = 30 * (boost ? 2 : 1)
        item = "coins"
        emote = "<:coin:606434686931173377>"
        db.set(`thedate_${message.author.id}`, -1)
        db.add(`money_${message.author.id}`, amount)
      } 

      message.channel.send(
      	new Discord.MessageEmbed()
        .setTitle("Daily Rewards! Woohooo!") 
        .setDescription(`${emote} Nice! You have recieved ${amount} ${item}!${boost ? "\nBecause you are a booster, you received double the normal rewards amount!" : ""}`) 
      
      ) 
        db.add(`thedate_${message.author.id}`, 1)
        db.set(`daily_${message.author.id}`, Date.now())
    } 
  }
};
