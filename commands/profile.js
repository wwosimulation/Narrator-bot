const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "profile",
    run: async (message, args, client) => {
        let inventory = db.get(`profile_${message.author.id}`)

        if (inventory != true && message.author.id != "552814709963751425") return message.channel.send("You need to buy the profile command in order to use it!")
        let guy
        if (args[0]) {
        guy = message.guild.members.cache.find(m => m.nickname === args[0]) || 
        message.guild.members.cache.get(args[0]) || 
        message.guild.members.cache.find(m => m.user.username === args[0]) || 
        message.guild.members.cache.find(m => m.user.tag === args[0]) ||
        message.mentions.members.first() 
        } else {
            console.log("test")
            guy = message.member
        }

        if (!guy) {
            let t = await message.channel.send("User not found")
            await t.delete({timeout: 7000})
            return
        }

        if (db.get(`profile_${guy.id}`) != true && message.author.id != "552814709963751425") return message.channel.send("This player does not have the profile command! In order for you to view it, they must buy it!\n\n\nGood luck.. you can't share coins")
        
        let icon = db.get(`icon_${message.author.id}`) || 'https://cdn.discordapp.com/emojis/6064307760235860697.png'
        let villagewin = db.get(`vwin_${guy.id}`) || 0
        let villagelost = db.get(`vlose_${guy.id}`) || 0
        let wwwin = db.get(`wwin_${guy.id}`) || 0
        let wwlost = db.get(`wlose_${guy.id}`) || 0
        let solovwin =  db.get(`svwin_${guy.id}`) || 0
        let solovlost = db.get(`svlose_${guy.id}`) || 0
        let solokwin = db.get(`skwin_${guy.id}`) || 0
        let soloklost = db.get(`sklose_${guy.id}`) || 0
        let couplewin = db.get(`cwin_${guy.id}`) || 0
        let couplelost = db.get(`close_${guy.id}`) || 0
        let xp = db.get(`xp_${guy.id}`) || 0
        let level = db.get(`level_${guy.id}`) || 0
        let xpreq = db.get(`xpreq_${guy.id}`) || 1000
        let wins = villagewin + wwwin + solokwin + solovwin + couplewin
        let lost = villagelost + wwlost + soloklost + solovlost + couplelost
        let tie = db.get(`tie_${guy.id}`) || 0
        let coins = db.get(`money_${guy.id}`) || 0
        let roses = db.get(`roses_${guy.id}`) || 0 // roses to spend
        let roseG = db.get(`roseG_${guy.id}`) || 0 // Roses to GIVE
        let roseBouquet = db.get(`roseBouquet_${guy.id}`) || 0 // bouquets 
        let winstreak = db.get(`winstreak_${guy.id}`) || 0

        message.channel.send(
            new Discord.MessageEmbed()
            .setTitle(`Profile - ${guy.user.username}`)
            .setDescription(`Gold: ${coins}\nRoses: ${roses}\nRoses (bought): ${roseG}\n\nLevel :${level}\n${xp}/${xpreq}\n\nWins: ${wins}\nLoses: ${lost}\nTies: ${tie}\nWin Streak: ${winstreak}\n\nWin as Village: ${villagewin}\nLost as Village: ${villagelost}\n\nWin as Werewolf: ${wwwin}\nLost as Werewolf: ${wwlost}\n\nWin as Solo Voting: ${solovwin}\nLost as Solo Voting: ${solovlost}\n\nWin as Solo Killer: ${solokwin}\nLost as Solo Killing: ${soloklost}\n\nWins as Couple: ${couplewin}\nLost as Couple: ${couplelost}`)
            .setThumbnail(icon)
            )
    }
}