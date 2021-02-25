const db = require("quick.db");

module.exports = {
  name: "douse",
  aliases: ["oil"],
  run: async (message, args, client) => {
    if (!message.channel.name == 'priv-arsonist') return
    let doused = await db.fetch(`doused_${message.channel.id}`);
    let isNight = await db.fetch(`isNight_${message.guild.id}`);
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let dead = message.guild.roles.cache.find(r => r.name === "Dead");
    let ignited = db.get(`ignitedAt_${message.channel.id}`) || "-1"
    if (doused == null) {
      doused = [] 
    } 
    if (isNight != "yes") {
      return await message.channel.send(
        "Sure dousing in broad daylight. Might as well suicide bruh."
      );
    }
    if (ignited == db.get(`nightCount_${message.guild.id}`)) return message.channel.send("Yea no. You just ignited literally a few seconds ago.")
    if (args.length == 0) {
      return await message.channel.send(
        "Yes, dousing no one. A wonderful choice!"
      );
    } else {
      let guy1 = message.guild.members.cache.find(m => m.nickname === args[0]);
      let ownself = message.guild.members.cache.find(m => m.nickname === message.member.nickname);
      if (args.length == 2) {
        let guy2 = message.guild.members.cache.find(m => m.nickname === args[1]);
        if (
          !guy1 ||
          !guy2 ||
          guy1 == guy2 ||
          guy1 == ownself ||
          guy2 == ownself
        ) {
          return await message.channel.send(
            "Hmm. Dousing non-existent players. Good choice!"
          );
        }
        if (
          !guy1.roles.cache.has(alive.id) ||
          !guy2.roles.cache.has(alive.id) ||
          !ownself.roles.cache.has(alive.id)
        ) {
          return await message.channel.send("Generation these days... ");
        }
        for (let hhh = 1; hhh < doused.length; hhh++) {
          if (doused[hhh] == args[0] || doused[hhh] == args[1]) {
            return await message.channel.send('Listen, you already doused that player. Stop acting dumb.') 
          } 
        }
        db.delete(`toDouse_${message.channel.id}`);
       
        db.set(`toDouse_${message.channel.id}`, [args[0]]);
        console.log(db.get(`toDouse_${message.channel.id}`))
        db.push(`toDouse_${message.channel.id}`, args[1]);
        message.channel.send(
          "<:douse:744574203025686568> Doused **" +
            args[0] +
            " " +
            guy1.user.username +
            " & " +
            args[1] +
            " " +
            guy2.user.username +
            "**!"
        );
        db.set(`dousedAt_${message.channel.id}`, db.get(`nightCount_${message.author.id}`))
      } else if (args.length == 1) {
        if (!guy1 || guy1 == ownself) {
          return await message.channel.send(
            "Hmm. Dousing non-existent players. Good choice!"
          );
        }
        if (!guy1.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
          return await message.channel.send("Generation these days... ");
        }
        for (let hhh = 1;hhh<doused.length;hhh++) {
          if (doused[hhh] == args[0]) {
            return await message.channel.send('Listen, you already doused that player. Stop acting dumb.') 
          } 
        } 
        db.delete(`toDouse_${message.channel.id}`);
        db.push(`toDouse_${message.channel.id}`, args[0]);
        message.channel.send(
          "<:douse:744574203025686568> Doused **" +
            args[0] +
            " " +
            guy1.user.username +
            "**!"
        );
        db.set(`dousedAt_${message.channel.id}`, db.get(`nightCount_${message.author.id}`))
      } else {
        return await message.channel.send(
          "As far as i know, Dousing 3 or more players gets you blacklisted from the bot. "
        );
      }
    }
  }
};
