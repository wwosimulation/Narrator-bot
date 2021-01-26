const db = require("quick.db")

module.exports = {
  name: "eat",
  run: async (message, args, client) => {
    if (message.channel.name == "priv-cannibal") {
      // getting all the variables
      let isNight = db.get(`isNight_${message.guild.id}`)
      let hunger = db.get(`hunger_${message.channel.id}`) || 1
      let alive = message.guild.roles.cache.find(r => r.name === "Alive")
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send(`Eating when dead just doesn't make any sense`)
      if (!isNight == "yes") return message.channel.send("This is Werewolf Online. There is no Lunch or Dinner. Only breakfast")
      if (!args[0]) return message.channel.send("Nice eating no one i see")
      if (hunger < args.length) return message.channel.send("Eating more than you can just makes you feel nauseated")

      for (let i = 0 ; i < args.length ; i++) {
        let guy = 
          message.guild.members.cache.find(m => m.nickname === args[i]) ||
          message.guild.members.cache.find(m => m.id === args[i]) ||
          message.guild.members.cache.find(m => m.user.username === args[i])
          message.guild.members.cache.find(m => m.user.tag === args[i])
        if (!guy) return message.channel.send(`Player **${args[0]}** could not be found!`)
        if (!guy.roles.cache.has(alive.id)) return message.channel.send(`Player **${guy.nickname} ${guy.user.username}** is dead!`)
        if (guy == message.member) return message.channel.send(`Eating yourself isn't just gonna work!`)
      }
     
      let lol = []
      for (let j = 0 ; j < args.length ; j++) {
        let guy = 
          message.guild.members.cache.find(m => m.nickname === args[j]) ||
          message.guild.members.cache.find(m => m.id === args[j]) ||
          message.guild.members.cache.find(m => m.user.username === args[j])
          message.guild.members.cache.find(m => m.user.tag === args[j])
        lol.push(guy.nickname)
      }
      db.set(`eat_${message.channel.id}`, lol)
      for (let j = 0 ; j < args.length ; j++) {
        let guy = 
          message.guild.members.cache.find(m => m.nickname === args[j]) ||
          message.guild.members.cache.find(m => m.id === args[j]) ||
          message.guild.members.cache.find(m => m.user.username === args[j])
          message.guild.members.cache.find(m => m.user.tag === args[j])
          message.channel.send(`<:eat:744575270102630482> You decided to eat **${guy.nickname} ${guy.user.username}`)
      }
    }
  }
}