const db = require("quick.db");

module.exports = {
  name: "stab",
  aliases: ["murder"],
  run: async (message, args, client) => {
    if (message.channel.name == "priv-serial-killer") {
      let alive = message.guild.roles.cache.find(r => r.name === 'Alive') 
      let guy = message.guild.members.cache.find(m => m.nickname === args[0])
      let ownself = message.guild.members.cache.find(m => m.nickname === message.member.nickname) 
      if (!guy || guy == ownself) {
        return await message.reply('Invalid target!') 
      } else {
        if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
          return await message.reply('You or your target isn\'t alive!')
        } else {
          let role = await db.fetch(`${guy.id}`)
          if (role == "President") return await message.channel.send('yup, killing the president for wins. Player these days just take short cuts.') 
          db.set(`stab_${message.channel.id}`, args[0])
          message.react('475775821760692225')
        } 
      } 
    } else if (message.channel.name == "priv-bandit" || message.channel.name == "priv-accomplice") {
      let alive = message.guild.roles.cache.find(r => r.name === 'Alive') 
      let dead = message.guild.roles.cache.find(r => r.name === 'Dead') 
      let allBandits = message.guild.channels.cache.filter(c => c.name.startsWith("bandits")).keyArray("id")
      for (let i = 0 ; i < allBandits.length ; i++) {
        let channel = message.guild.channels.cache.get(allBandits[i])
        let playersInChannel = false
        let ownself = message.guild.members.cache.find(m => m.id === message.author.id)
        if (channel.permissionsFor(ownself).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          for (let j = 1 ; j <= alive.members.size + dead.members.size ; j++) {
            let player = message.guild.members.cache.find(m => m.nickname === j.toString())
            if (player.roles.cache.has(alive.id) && player != ownself) {
              if (channel.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                playersInChannel = true
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
};
