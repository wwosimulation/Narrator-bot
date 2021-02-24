const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "cmi",
    run: async (message, args, client) => {
        
        if (message.channel.type != "dm") return message.channel.send("Please try this command in DMs!")
        
        let allroles = [
	"Alchemist",
	"Grave Robber",
        "Fortune Teller",
        "Kitten Wolf",
        "Pacifist",
        "Spirit Seer",
        "Sheriff", 
        "Werewolf Berserk",
        "Wolf Pacifist", 
        "Cupid",
        "President",
        "Mayor",
        "Grumpy Grandma",
        "Seer Apprentice",
        "Tough Guy",
        "Loudmouth", 
        "Sorcerer", 
        "Flower Child",
        "Guardian Wolf",
        "Beast Hunter",
        "Avenger",
        "Witch",
        "Detective",
        "Forger",
        "Cursed",
        "Marksman",
        "Red Lady",
        "Junior Werewolf", 
        "Nightmare Werewolf",
        "Shadow Wolf",         
        "Random Regular Villager",
        "Random Strong Villager", 
        "Random Werewolf", 
        "Random Killer", 
        "Random Voting", 
        "Random",
        "Arsonist", 
        "Sect Leader",
        "Bomber", 
        "Zombie",
        "Corruptor", 
        "Cannibal",
        "Illusionist",
        "Bandit" 
        ]
        
        let msg = ""
        let boughtroles = db.get(`boughtroles_${message.author.id}`) || []
       
        let roses25 = ["Grave Robber", "Fortune Teller", "Pacifist", "Spirit Seer", "Sheriff", "Werewolf Berserk", "Kitten Wolf"]
        let roses50 = ["Cupid", "President"]
        let coins75 = ["Mayor", "Grumpy Grandma", "Seer Apprentice", "Tough Guy", "Loudmouth", "Sorcerer", "Flower Child", "Guardian Wolf"]
        let coins250 = ["Beast Hunter", "Avenger", "Witch", "Detective", "Forger", "Cursed", "Marksman", "Red Lady", "Junior Werewolf", "Nightmare Werewolf", "Shadow Wolf", "Random Regular Villager", "Random Strong Villager", "Random Werewolf", "Random Killer", "Random Voting", "Random"]
        let coins1000 = ["Arsonist", "Sect Leader", "Bomber", "Zombie", "Corruptor", "Cannibal", "Illusionist", "Bandit", "Alchemist"]
        
        if (boughtroles.length > 0) {
            boughtroles.forEach(e => {
                allroles.splice(allroles.indexOf(e), 1)
                if (roses25.indexOf(e) != -1) {
                    roses25.splice(roses25.indexOf(e), 1)
                }
                if (roses50.indexOf(e) != -1) {
                    roses50.splice(roses50.indexOf(e), 1)
                }
                if (coins75.indexOf(e) != -1) {
                    coins75.splice(coins75.indexOf(e), 1)
                }
                if (coins250.indexOf(e) != -1) {
                    coins250.splice(coins250.indexOf(e), 1)
                }
                if (coins1000.indexOf(e) != -1) {
                    coins1000.splice(coins1000.indexOf(e), 1)
                }
            })
        } 
        let ehek = ""
        roses25.forEach(e => {
	  if (e == "Grave Robber") {
	  	ehek += `~~${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>~~\n` 
          	msg += `~~${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>~~\n`
	  } else {
	  	ehek += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>\n` 
          	msg += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 25<:rosesingle:807256844191793158>\n`
	  } 
        })
        roses50.forEach(e => {
	  ehek += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 50<:rosesingle:807256844191793158>\n`
          msg += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 50<:rosesingle:807256844191793158>\n`
        })
        coins75.forEach(e => {
	  ehek += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 75<:coin:606434686931173377>\n`
	  if (args.length == 0 && ehek.length > 1980) {
	  	message.channel.send(
			new Discord.MessageEmbed() 
			.setTitle("Roles to buy:") 
			.setDescription(msg + "\n\n- Copyright © Ashish Emmanuel") 
			.setColor("#008800")
	  	) 
	  	msg = ""
		ehek = ""
	  } 
          msg += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 75<:coin:606434686931173377>\n`
        })
        coins250.forEach(e => {
		ehek += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 75<:coin:606434686931173377>\n`
		if (args.length == 0 && ehek.length > 1980) {
	  		message.channel.send(
			new Discord.MessageEmbed() 
			.setTitle("Roles to buy:") 
			.setDescription(msg + "\n\n- Copyright © Ashish Emmanuel") 
			.setColor("#008800")
	  		) 
	  		msg = ""  
			ehek = ""
	 	}
          	msg += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(/ /g, "_"))} ${e} - 250<:coin:606434686931173377>\n`
        })
        coins1000.forEach(e => {
	  ehek += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 1000<:coin:606434686931173377>\n` 
	  if (args.length == 0 && ehek.length > 1980) {
	  		message.channel.send(
			new Discord.MessageEmbed() 
			.setTitle("Roles to buy:") 
			.setDescription(msg + "\n\n- Copyright © Ashish Emmanuel") 
			.setColor("#008800")
	  		) 
		  	ehek = ""
	  		msg = ""  
	 	} 
          msg += `${client.emojis.cache.find(x => x.name === e.toLowerCase().replace(" ", "_"))} ${e} - 1000<:coin:606434686931173377>\n`
        })
        
        if (msg == "") msg = "None"
        
        if (args.length == 0) {
            message.author.send(
              new Discord.MessageEmbed()
              .setTitle("Roles to buy:")
              .setDescription(msg + "\n\n- Copyright © Ashish Emmanuel")
              .setColor("#008800")
            )
        } else if (args[0] == "buy") {
            
            if (db.get(`cmi_${message.author.id}`) != true) return message.author.send("You need to buy the Custom Maker Item before you can buy the other roles!")
            
            let totalag = ""
            for (let i = 1 ; i < args.length ; i++) {
              if (i == args.length - 1) {
                  totalag += args[i][0].toUpperCase() + args[i].slice(1).toLowerCase()
              } else {
                  totalag += args[i][0].toUpperCase() + args[i].slice(1).toLowerCase() + " "
              }
            }
            
            if (!allroles.includes(totalag)) return message.author.send("Role not found!")
            if (boughtroles.includes(totalag)) return message.author.send("You already bought this role!")
	    if (totalag == "Grave Robber") return message.author.send("You can see that this role is under stricketthrough (or crossed). Any idiot knows that this role can't be bought...")
            let money = db.get(`money_${message.author.id}`)
            let roses = db.get(`roses_${message.author.id}`) || 0
            if (roses25.includes(totalag)) {
                
                if (roses < 25) return message.author.send("You do not have enough roses to buy this role!")
                db.subtract(`roses_${message.author.id}`, 25)
                
            } else if (roses50.includes(totalag)) {
            
                if (roses < 50) return message.author.send("You do not have enough roses to buy this role!")                
                db.subtract(`roses_${message.author.id}`, 50)
                boughtroles.push(totalag)
                db.set(`boughtroles_${message.author.id}`, boughtroles)
                
            } else if (coins75.includes(totalag)) {
                
                if (money < 75) return message.author.send("You do not have enough gold to buy this role!")                
                db.subtract(`money_${message.author.id}`, 75)
                boughtroles.push(totalag)
                db.set(`boughtroles_${message.author.id}`, boughtroles)
                
            } else if (coins250.includes(totalag)) {
            
                if (money < 250) return message.author.send("You do not have enough gold to buy this role!")                
                db.subtract(`money_${message.author.id}`, 250)
                boughtroles.push(totalag)
                db.set(`boughtroles_${message.author.id}`, boughtroles)
                
            } else if (coins1000.includes(totalag)) {
                
                if (money < 1000) return message.author.send("You do not have enough gold to buy this role!")                
                db.subtract(`money_${message.author.id}`, 1000)
                boughtroles.push(totalag)
                db.set(`boughtroles_${message.author.id}`, boughtroles)
                
            } else {
              return message.channel.send("Role not found!")
            }
            
        }
        
    }
}
