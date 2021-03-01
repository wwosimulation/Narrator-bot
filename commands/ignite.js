const db = require("quick.db");

module.exports = {
  name: "ignite",
  alises: ["burn", "fire"],
  run: async (message, args, client) => {
    let isNight = db.get(`isNight_${message.guild.id}`);
    let doused = db.get(`doused_${message.channel.id}`) || [];
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let dead = message.guild.roles.cache.find(r => r.name === "Dead");
    let didCmd = db.get(`dousedAt_${message.channel.id}`) || "-1"
    if (message.channel.name == "priv-arsonist") {
      if (!message.member.roles.cache.has(alive.id))
        return await message.channel.send(
          "Yes. Trying to win as dead. Good Job."
        );
      if (isNight != "yes")
        return await message.channel.send(
          "Burning in broad day light just makes you look stupid"
        );
      
      if (didCmd == db.get(`nightCount_${message.guild.id}`)) return message.channel.send("Bruh, you just doused dummy...")
      if (doused.length == 0)
        return await message.channel.send(
          "Are you dumb? Don't try to think i'm stupid! You haven't even doused anyone yet! "
        );
  
      for (let i = 0; i < doused.length; i++) {
        let guy = message.guild.members.cache.find(m => m.nickname === doused[i]);
        if (guy) {
          if (guy.roles.cache.has(alive.id)) {
            let dayChat = message.guild.channels.cache.find(c => c.name === "day-chat");
            let role = db.get(`role_${guy.id}`);
            dayChat.send(
              `<:ignite:744575140032938014> The Arsonist ignited **${guy.nickname} ${guy.user.username} (${role})**!`
            );
            guy.roles.add(dead.id);
            guy.roles.remove(alive.id)
          }
        }
      }
      db.set(`ignitedAt_${message.channel.id}`, db.get(`nightCount_${message.guild.id}`))
      db.delete(`doused_${message.channel.id}`)
    }
  }
};
