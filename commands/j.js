const db = require("quick.db")

module.exports = {
  name: "j",
  run: async (message, args, client) => {
    if (message.channel.name === "priv-jailer") {
      let night = db.get(`isNight_${message.guild.id}`)
      if (night != "yes") return message.channel.send("You know, you haven't even jailed anyone yet")
      let j = message.guild.channels.cache.find(c => c.name === "jailed-chat")
      j.send("**Jailer**: " + args.join(' '))
    }

    if (message.channel.name === "jailed-chat") {
      let night = db.get(`isNight_${message.guild.id}`)
      if (night != "yes") return message.channel.send("You know, you haven't even jailed anyone yet")
      let j = message.guild.channels.cache.find(c => c.name === "priv-jailer")
      j.send("**" + message.member.nickname + " " + message.author.username + "**: " + args.join(' '))
    }

  }
}