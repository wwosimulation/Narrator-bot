const db = require("quick.db");

module.exports = {
  name: "trap",
  run: async (message, args, client) => {
    if (message.channel.name == "priv-beast-hunter") {
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let dead = message.guild.roles.cache.find(r => r.name === "Dead");
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      let guy = message.guild.members.cache.find(m => m.nickname === args[0])
      let setTrap = await db.fetch(`setTrap_${message.channel.id}`) 
      let trapActive = await db.fetch(`trapActive_${message.channel.id}`) 
      let night = await db.fetch(`nightCount_${message.guild.id}`) 
      if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
        return await message.reply('You or your target isn\'t alive!')
      } else if (parseInt(args[0]) > (parseInt(alive.members.size) + parseInt(dead.members.size)) || parseInt(args[0]) < 1) {
        return await message.reply('Invalid target!')
      } else {
        message.react('475775073475887134')
        db.set(`setTrap_${message.channel.id}`,  args[0]) 
        db.set(`trapActive_${message.channel.id}`, false) 
      } 
    }
  }
};
