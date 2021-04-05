const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
  name: "custom",
  gameOnly: true,
  run: async (message, args, client) => {
    
    if (!db.get(`cmi_${message.author.id}`)) return message.reply("You do not have the Custom Maker Item")
    
    message.channel.send("Please insert 16 roles, one by one!")
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
        
        let rolesPlayerHas = ["Villager", "Gunner", "Doctor", "Bodyguard", "Seer", "Jailer", "Priest", "Aura Seer", "Medium", "Werewolf", "Alpha Werewolf", "Wolf Shaman", "Wolf Seer", "Fool", "Headhunter", "Serial Killer"]
    
        let boughtroles = db.get(`boughtroles_${message.author.id}`) || []
        
        boughtroles.forEach(role => {
          rolesPlayerHas.push(role)
        })
    
        args.forEach(role => {
          args[args.indexOf(role)] = `${role[0].toUpperCase()}${role.slice(1).toLowerCase()}`
        })
    
        let rolelist = []
    
	console.log(args)
	console.log(rolesPlayerHas)
        let filter = m => m.author.id == message.author.id && rolesPlayerHas.includes(args.join(" "))
        const collector = message.channel.createMessageCollector(filter, {time: 120000, limit: 16})
        db.set(`rolecmitime_${message.author.id}`, true)
        
        collector.on("collect", async m => {
          
          // collecting wohoo
          let therole = m.content
          rolelist.push(therole.toLowerCase().replace(/\s/g, "-"))
          
        })
    
        collector.on("end", async (collected, reason) => {
          db.delete(`rolecmitime_${message.author.id}`)
          if (reason == "time") {
            message.reply("This action has been canceled! You took too long to respond!")
          } else {
            message.reply("Done! Sent your rolelist!")
            message.guild.channels.cache.get("607185743172861952").send(`${message.member.nickname} suggested: ${rolelist}`)
          }
        })
    
        
    
    
    
    
    
    
    
    
  }
}
