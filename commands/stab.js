const db = require("quick.db");

module.exports = {
  name: "stab",
  aliases: ["murder"],
    gameOnly: true,
    run: async (message, args, client) => {
    if (message.channel.name == "priv-serial-killer") {
      let alive = message.guild.roles.cache.find(r => r.name === 'Alive') 
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || message.guild.members.cache.find(m => m.user.username === args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.find(m => m.id === args[0])
      let isNight = db.get(`isNight_${message.guild.id}`)
      if (!args[0]) return message.channel.send("Yes, stabbing the air. Perfect choice.")
      if (!guy) return message.reply("Invalid target!")
      if (guy == message.member) return message.channel.send("The Alias for this is `+suicide`. Thanks")
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Yes stabbing while dead. Nice job")
      if (isNight != "yes") return message.channel.send("Stabbing in broad daylight always makes sense.")
      if (!guy.roles.cache.has(alive.id)) return message.channel.send("Congrats! You have invented a whole new level of stupidity by killing a dead player.")
      db.set(`stab_${message.channel.id}`, guy.nickname)
      message.react("774088736861978666")
    } else if (message.channel.name == "priv-bandit" || message.channel.name == "priv-accomplice") {
      let alive = message.guild.roles.cache.find(r => r.name === 'Alive') 
      let dead = message.guild.roles.cache.find(r => r.name === 'Dead') 
      let allBandits = message.guild.channels.cache.filter(c => c.name.startsWith("bandits")).keyArray("id")
      if (message.channel.name == "priv-bandit") {
        for (let i = 0 ; i < allBandits.length ; i++) {
          let channel = message.guild.channels.cache.get(allBandits[i])
          let playersInChannel = false
          let ownself = message.guild.members.cache.find(m => m.id === message.author.id)
          if (channel.permissionsFor(ownself).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
            for (let j = 1 ; j <= alive.members.size + dead.members.size ; j++) {
              let player = message.guild.members.cache.find(m => m.nickname === j.toString())
              if (player && player.roles.cache.has(alive.id) && player != ownself) {
                if (channel.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                  playersInChannel = true
                }
              }
            }
          } 
          if (playersInChannel == false) return message.channel.send("No, you need to convert someone before you can kill dumb.")
        }
      }
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't kill players when dead stupid...")
      if (!args[0]) return message.channel.send("You can't kill players without telling me who to kill.")
      let guy = 
            message.guild.members.cache.find(m => m.nickname === args[0]) || 
            message.guild.members.cache.find(m => m.user.username === args[0]) || 
            message.guild.members.cache.find(m => m.id === args[0]) || 
            message.guild.members.cache.find(m => m.user.tag === args[0]) 
      if (!guy || guy.nickname == message.member.nickname) return message.channel.send("Here's an alternate suggestion: `+suicide`")
      if (!guy.roles.cache.has(alive.id)) return message.channel.send("Bruh, you can't kill players that have already been killed...")
      for (let i = 0 ; i < allBandits.length ; i++ ) {
        let chan = message.guild.channels.cache.get(allBandits[i])
        let ownself = message.guild.members.cache.find(m => m.id === message.author.id)
        if (chan.permissionsFor(ownself).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
            return message.channel.send("There seems to be a bug... Try doing `+suicide` instead...")
          }
        
          i = 99
          let emoji
          if (message.channel.name == 'priv-bandit') {
            emoji = '<:votebandit:744575294051975301>'
            db.set(`banditkill_${chan.id}`, guy.nickname)
          }
          if (message.channel.name == "priv-accomplice") {
            emoji = '<:thieve:745632726639706202>'
            db.set(`accomplice_${chan.id}`, guy.nickname)
          }
          chan.send(`${emoji} ${message.member.nickname} voted **${guy.nickname} ${guy.user.username}**`)
        }
      }
    }
  }
};
