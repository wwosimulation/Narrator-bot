const db = require("quick.db")

module.exports = {
  name: 'jail' ,
  run: async (message, args, client) => {
    if (message.channel.name != "priv-jailer") return 
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let isNight = db.get(`isNight_${message.guild.id}`)
    if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You need to have an alive role before you can jail someone bruh.")
    if (!args[0]) return message.channel.send("How do you want to jail someone if you aren't telling me who to jail...")
    let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || message.guild.members.cache.find(m => m.user.username === args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.find(m => m.id === args[0])
    if (isNight == "yes") return message.channel.send("I hope, that one day, you will get proper brains.")
    if (!guy || message.member == guy) return message.reply("Invalid Target")
    db.set(`jail_${message.channel.id}`, guy.nickname)
    message.channel.send("You decided to jail **" + guy.nickname + " " + guy.user.username + "**!")
  }
} 