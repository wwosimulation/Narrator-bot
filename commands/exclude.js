const db = require("quick.db")

module.exports = {
  name: "exclude",
  gameOnly: true,
  run: async (message, args, client) => {
    
    let narrator = message.guild.roles.cache.find(r => r.name === "Narrator")
    let mininarr = message.guild.roles.cache.find(r => r.name === "Narrator Trainee")
    
    args.forEach(arg => {
      args[args.indexOf(arg)] = arg.toLowerCase()
    })
    
    if (!message.member.roles.cache.has(narrator.id) && !message.member.roles.cache.has(mininarr.id)) return
    
    
    let roles = [
        "aura-seer", "avenger", "beast-hunter", "bodyguard", 
        "cupid", "cursed", "doctor", "flower-child", 
        "grave-robber", "grumpy-grandma", "loudmouth", 
        "marksman", "mayor", "pacifist", "priest", 
        "red-lady", "seer-apprentice", "sheriff", "spirit-seer", 
        "tough-guy", "villager", "witch", "president",
        "detective", "forger", "fortune-teller", 
        "gunner", "jailer", "medium", "seer", 
        "alpha-werewolf", "guardian-wolf", "junior-werewolf",
        "kitten-wolf", "nightmare-werewolf", "shadow-wolf",
        "werewolf", "werewolf-berserk", "wolf-pacifist", 
        "wolf-seer", "wolf-shaman", "sorcerer", 
        "alchemist", "arsonist", "bandit", "bomber", 
        "cannibal", "corruptor", "illusionist", 
        "sect-leader", "serial-killer", "zombie", "fool",
        "headhunter"
    ]
    
    let rolestoexclude = []
    
    for (const arg of args) {
      if (!roles.includes(arg)) return message.channel.send(`Role \`${arg}\` not found!`)
    }
    for (const argumets of args) {
      rolestoexclude.push(arguments)
    }
    
    console.log(rolestoexclude)
    db.set("excludes", rolestoexclude)
    
    message.channel.send("Done! Excluded those roles!")
    
  }
}
