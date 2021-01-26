const db = require("quick.db");

module.exports = {
  name: "d",
  run: async (message, args, client) => {
    if (message.channel.name == "priv-medium") {
      let isNight = await db.fetch(`isNight_${message.guild.id}`);
      if (isNight != "yes") return message.channel.send("You can only speak with the dead during the night!");
      if (message.member.roles.cache.has("606131202814115882"))
        return await message.channel.send(
          "wow. here's a crazy idea, why not go to <#606196101380309012> and chat there?"
        );
      if (!args)
        return await message.channel.send(
          "Yup, sending empty messages. Congrats, you are a certified moron!"
        );
      let de = message.guild.channels.cache.find(c => c.name === "dead-chat");
      let content = "";
      for (let i = 0; i < args.length; i++) {
        content += args[i] + " ";
      }
      de.send("**Medium**: " + content);
    } else if (message.channel.name == "dead-chat") {
      let isNight = db.get(`isNight_${message.guild.id}`);
      if (isNight != "yes") return message.channel.send("You can only chat with the medium during the night!");
      if (!args)
        return await message.channel.send(
          "Yup, sending empty messages. Congrats, you are a certified moron!"
        );
      let me = message.guild.channels.cache.filter(c => c.name === "priv-medium");
      let med = me.keyArray("id");
      let medi = [];
      let alive = message.guild.roles.cache.find(r => r.name == "Alive");
      let dead = message.guild.roles.cache.find(r => r.name === "Dead");
      let total = parseInt(alive.members.size) + parseInt(dead.members.size);
      for (let y = 1; y <= total; y++) {
        let guy = message.guild.members.cache.find(m => m.nickname === y.toString());
        for (let e = 0; e < med.length; e++) {
          let cha = message.guild.channels.cache.get(med[e]);
          if (cha.permissionsFor(guy).has(["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]) &&
                guy.roles.cache.has(alive.id)) {
            medi.push(med[e]);
          }
        }
      }
      if (medi.length == 0) return await message.channel.send("You probably didn't notice but there are no mediums in game.")
      let content = ""
      for (let f = 0;f<args.length;f++) {
        content += args[f] + " "
      }
      for (let a = 0;a < medi.length;a++) {
        let channe = message.guild.channels.cache.find(c => c.id === medi[a])
        channe.send(`**${message.member.nickname} ${message.author.username}**: ${content}`)
      }
    }
  }
};
