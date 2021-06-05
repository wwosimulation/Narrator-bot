const { players } = require("../../db.js")
const Discord = require("discord.js")
const { emojis, fn } = require("../../config.js")

module.exports = {
  name: "profile",
  run: async (message, args, client) => {
    let data = await players.findOne({user: message.author.id})
    let inventory = db.get(`profile_${message.author.id}`)

    if (inventory != true && !client.botAdmin(message.author.id)) return message.channel.send("You need to buy the profile command in order to use it!")
    let guy
    if (args[0]) {
      guy = fn.getUser(args[0], message)
    } else {
      guy = message.author
    }
    if(!guy) return message.channel.send("Unable to find that user")
    if(guy.author) guy = guy.author

    if (db.get(`profile_${guy.id}`) != true && !config.fn.isNarrator(message.member)) return message.channel.send("This player does not have their profile unlocked from the shop!")

    let icon = db.get(`icon_${guy.id}`) || ""
    let desc = db.get(`profiledesc_${guy.id}`) || "A really cool user!"
    let xp = db.get(`xp_${guy.id}`) || 0
    let level = db.get(`level_${guy.id}`) || 0
    let xpreq = fn.nextLevel(level)
    let wins = villagewin + wwwin + solokwin + solovwin + couplewin
    let lost = villagelost + wwlost + soloklost + solovlost + couplelost
    let tie = db.get(`tie_${guy.id}`) || 0
    let coins = db.get(`money_${guy.id}`) || 0
    let roses = db.get(`roses_${guy.id}`) || 0 // roses to spend
    let gems = db.get(`gems_${guy.id}`) || 0 // gems
    let winstreak = db.get(`winstreak_${guy.id}`) || 0

    // TODO: reformat this
    let embed = new Discord.MessageEmbed()
      .setTitle(`${guy.user ? guy.user.tag : guy.tag}'s Profile`)
      .setDescription(desc)
      .setThumbnail(icon)
      .addField("Coins", `${coins} ${emojis.coin}`, true)
      .addField("Roses", `${roses} ${emojis.rose}`, true)
      .addField("Gems", `${gems} ${emojis.gem}`, true)
      .addField("Level", `${level}`, true)
      .addField("XP", `${xp}/${xpreq}`, true)
      //.addField("Stats", `Wins: ${wins}\nLoses: ${lost}\nTies: ${tie}\nWin Streak: ${winstreak}\n\nWin as Village: ${villagewin}\nLost as Village: ${villagelost}\n\nWin as Werewolf: ${wwwin}\nLost as Werewolf: ${wwlost}\n\nWin as Solo Voting: ${solovwin}\nLost as Solo Voting: ${solovlost}\n\nWin as Solo Killer: ${solokwin}\nLost as Solo Killing: ${soloklost}\n\nWins as Couple: ${couplewin}\nLost as Couple: ${couplelost}`)

    message.channel.send(embed)
  },
}
