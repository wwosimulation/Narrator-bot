const db = require("quick.db");

module.exports = {
  name: "mute",
  aliases: ["quiet", "shush"],
  run: async (message, args, client) => {
    if (message.channel.name == "priv-grumpy-grandma") {
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let dead = message.guild.roles.cache.find(r => r.name === "Dead");
      let night = await db.fetch(`nightCount_${message.guild.id}`);
      let isNight = await db.fetch(`isNight_${message.guild.id}`);
      let guy = message.guild.members.cache.find(m => m.nickname === args[0])
      let ownself = message.guild.members.cache.find(m => m.nickname === message.member.nickname) 
      if (parseInt(args[0]) > (parseInt(alive.members.size) + parseInt(dead.members.size)) || parseInt(args[0]) < 1) {
        return await message.reply('Invalid target!')
      } else if (args[0] === message.member.nickname) {
        return await message.reply('You can\'t mute yourself!')
      } else {
        if (isNight != 'yes') {
          return await message.reply('You can only do this during the night!') 
        } else {
          if (night == 1) {
            return await message.reply('You can only mute a player after the first night!')  
          } else {
            db.set(`mute_${message.channel.id}`, args[0]) 
            message.react('475775342007549962')
          } 
        } 
      } 
    } else {
      return;
    }
  }
};
