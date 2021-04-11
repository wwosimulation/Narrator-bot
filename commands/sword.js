const db = require("quick.db")

module.exports = {
  name: "sword",
  gameOnly: true,
  run: async (message, args, client) => {
    let sword = db.get(`sword_${message.channel.id}`)
    if (sword == true) {
      let alive = message.guild.roles.cache.find(r => r.name === "Alive")
      let dead = message.guild.roles.cache.find(r => r.name === "Dead")
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Look at this idiot lmao...")
      if (args.length == 0) return message.channel.send("Lmao, we have another one. Send them to the mental hospital, ward 69.")
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || message.guild.members.cache.find(m => m.user.username === args[0]) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0])
      if (!guy || guy == message.member) return message.reply("Invalid target!")
      if (!guy.roles.cache.has(alive.id)) return message.channel.send("I love how you think that your stupidness is cute.")
      message.guild.channels.cache.finf(c => c.name === "day-chat").send(`<:getsword:744536585906683975> The Forger's sword was used to kill **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**.`)
      guy.roles.add(dead.id)
      guy.roles.remove(alive.id)
      db.delete(`sword_${message.channel.id}`)
    }
  }
}
