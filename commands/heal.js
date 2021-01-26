const { MessageReaction } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "heal",
  aliases: ["protect", "save"],
  run: async (message, args, client) => {
    let isNight = await db.fetch(`isNight_${message.guild.id}`);
    if (message.channel.name === "priv-doctor") {
      if (isNight != "yes") {
        return await message.reply("You can only use this during the night!");
      } else {
        let ownself = message.guild.members.cache.find(m => m.nickname === message.member.nickname);
        let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
        if (!guy) return await message.reply("Invalid Target");
        if (
          !guy.roles.cache.has("606140092213624859") ||
          !ownself.roles.cache.has("606140092213624859")
        )
          return await message.reply("You or your target isn't alive!");
        if (guy == ownself)
          return await message.channel.send(
            "Bro, you can't protect yourself. Just die for the sake of others"
          );
        db.set(`heal_${message.channel.id}`, args[0]);
        message.react("475775251297337344");
      }``
    } else if (message.channel.name === "priv-witch") {
      if (isNight != "yes") {
        return await message.reply(
          `You can only use your heal ability during the night!`
        );
      } else {
        let witch = await db.fetch(`witchAbil_${message.channel.id}`);
        if (witch == 1) {
          return await message.reply("You have already used your ability!");
        } else {
          let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
          let ownself = message.guild.members.cache.find(
            m => m.nickname === message.member.nickname
          );
          if (!guy) return await message.reply("Invalid Target");
          if (guy == ownself)
            return await message.channel.send(
              "Bro, you can't protect yourself. Just die for the sake of others"
            );
          if (
            !guy.roles.cache.has("606140092213624859") ||
            !ownself.roles.cache.has("606140092213624859")
          )
            return await message.reply("You or your target isn't alive!");
          db.set(`potion_${message.channel.id}`, args[0]);
          message.react("596733389084819476");
        }
      }
    } else if (message.channel.name == "priv-bodyguard") {
      let lives = await db.fetch(`lives_${message.channel.id}`);
      if (lives == null) {
        db.set(`lives_${message.channel.id}`, 2);
        lives = await db.fetch(`lives_${message.channel.id}`);
      }
      //let protect = args[0]
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      if (!guy) return await message.reply("Invalid Target");
      if (guy == ownself)
        return await message.channel.send(
          "Yo, you can't protect yourself more than you already do."
        );
      if (
        !guy.roles.cache.has("606140092213624859") ||
        !ownself.roles.cache.has("606140092213624859")
      )
        return await message.reply("You or your target isn't alive!");
      db.set(`guard_${message.channel.id}`, args[0])
      message.react("475775137434697728") 
    } else if (message.channel.name == "priv-tough-guy") {
      let alive = message.guild.roles.cache.find(r => r.name === "Alive")
      let isNight = db.get(`isNight_${message.guild.id}`)
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't protect when dead knucklehead")
      if (!args[0]) return message.channel.send("WOW I DIDN'T KNOW THAT YOU WERE SO SMART...")
      if (isNight != "yes") return message.channel.send("Bruh what are you trying to protect from??")
      
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || 
      message.guild.members.cache.find(m => m.id === args[0]) ||  
      message.guild.members.cache.find(m => m.user.username === args[0]) || 
      message.guild.members.cache.find(m => m.user.tag === args[0])

      if (!guy || guy.nickname == message.member.nickname) return message.reply("Invalid Target!")

      if (!guy.roles.cache.has(alive.id)) return message.channel.send("The command you're looking for is `+suicide`...")

      db.set(`tough_${message.channel.id}`, guy.nickname)
      message.react("606429479170080769")
      
    }
  }
};
