const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "reveal",
  aliases: ["rev", "show"], 
  run: async (message, args, client) => {
    let aliveRole = message.guild.roles.cache.find(r => r.name === "Alive");
    let deadRole = message.guild.roles.cache.find(r => r.name === "Dead");
    let dayChat = message.guild.channels.cache.find(c => c.name === "day-chat");
    if (message.channel.name == "priv-mayor") {
      if (args[0] == "card") {
        if (db.get(`card_${message.channel.id}`) == true) {
          if (!message.member.roles.cache.has(aliveRole.id)) return message.channel.send("You can't reveal when dead!")
          db.set(`card_${message.channel.id}`, false)
          return dayChat.send(`<:sun:744571092601012255> **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
        }
      }
      let ability = await db.fetch(`ability_${message.channel.id}`);
      if (ability == "yes")
        return await message.reply("You already used up your ability!");
      dayChat.send(
        `**${message.member.nickname} (Mayor)** has revealed himself!`
      );
      db.set(`mayorrev_${message.author.id}`, true)
      db.set(`ability_${message.channel.id}`, "yes");
    } else if (
      message.channel.name == "priv-pacifist" ||
      message.channel.name == "priv-wolf-pacifist"
    ) {
      let ability = await db.fetch(`paci_${message.channel.id}`);
      let isday = await db.fetch(`isDay_${message.guild.id}`);
      let day = await db.fetch(`day_${message.guild.id}`);
      if (ability == "yes")
        return await message.reply("You already used up all your abilities!");
      let cmd = await db.fetch(`commandEnabled_${message.guild.id}`);
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      let role = await db.fetch(`role_${guy.id}`);
      let nrole = role.toLowerCase();
      let revealed = await db.fetch(`revealed_${guy.id}`);
      let sected = await db.fetch(`sected_${message.author.id}`);
      let dchat = message.guild.channels.cache.find(c => c.name === "day-chat");
      if (!message.member.roles.cache.has(aliveRole.id) || !guy.roles.cache.has(aliveRole.id)) return message.channel.send("Revealing when dead or revealing a dead player is just not possible.")
      if (args[0] == "card") {
        if (db.get(`card_${message.channel.id}`) == true) {
          if (!message.member.roles.cache.has(aliveRole.id)) return message.channel.send("You can't reveal when dead!")
          db.set(`card_${message.channel.id}`, false)
          return dayChat.send(`<:sun:744571092601012255> **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
        }
      }
      if (isday != "yes")
        return await message.reply(
          "You can only use this ability during the day!"
        );
      if (day == 1) {
        if (cmd != "yes")
          return await message.reply(
            "You can only use this ability when voting starts on day 1!"
          );
        if (!guy || guy == message.member.nickname)
          return await message.reply("Invalid Target");
        if (role == "President")
          return await message.reply("You can't reveal the President!");
        if (
          message.channel.name == "priv-wolf-pacifist" &&
          nrole.includes("wolf")
        )
          return await message.reply("You can't reveal your own teammate!");
        if (revealed == "yes")
          return await message.reply("You can't reveal a revealed player!");
        if (sected == "yes" && role == "Sect Leader")
          return await message.reply(
            "You can't reveal a Sect Leader when sected!"
          );
        db.set(`paci_${message.channel.id}`, "yes");
        dchat.send(
          "The Pacifist<:pacifist:583672644965236736> revealed **" +
            args[0] +
            " " +
            guy.user.username +
            " (" +
            role +
            ")**!"
        );
        db.set(`reveal_${guy.id}`, "yes");
        if (message.channel.name == "priv-wolf-pacifist")
          client.channels
            .get("606135720825847829")
            .send(
              "The Wolf Pacifist<:wolf_pacifist:711948506989985812> has revealed **" +
                args[0] +
                " " +
                guy.user.username +
                "**!"
            );
      } else {
        if (!guy || guy == message.member.nickname)
          return await message.reply("Invalid Target");
        if (role == "President")
          return await message.reply("You can't reveal the President!");
        if (
          message.channel.name == "priv-wolf-pacifist" &&
          nrole.includes("wolf")
        )
          return await message.reply("You can't reveal your own teammate!");
        if (revealed == "yes")
          return await message.reply("You can't reveal a revealed player!");
        if (sected == "yes" && role == "Sect Leader")
          return await message.reply(
            "You can't reveal a Sect Leader when sected!"
          );
        db.set(`paci_${message.channel.id}`, "yes");
        dchat.send(
          "The Pacifist<:pacifist:583672644965236736> revealed **" +
            args[0] +
            " " +
            guy.user.username +
            " (" +
            role +
            ")**!"
        );
        db.set(`reveal_${guy.id}`, "yes");
        if (message.channel.name == "priv-wolf-pacifist")
          message.guild.channels
            .get("606135720825847829")
            .send(
              "The Wolf Pacifist<:wolf_pacifist:711948506989985812> has revealed **" +
                args[0] +
                " " +
                guy.user.username +
                "**!"
            );
      }
    }
    if (db.get(`card_${message.channel.id}`) == true) {
      if (message.channel.name != "priv-mayor" && message.channel.name != "priv-pacifist" && message.channel.name != "priv-wolf-pacifist") {
         let alive = message.guild.roles.cache.find(r => r.name === 'Alive')
         if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't reveal when dead!")
         let day = message.guild.channels.cache.find(c => c.name === "day-chat")
         day.send(`<:sun:744571092601012255> **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
         db.set(`card_${message.channel.id}`, false)
      }
    }
  }
};
