const db = require("quick.db");
const Discord = require("discord.js");

module.exports = {
  name: "vt",
  modOnly: true,
  run: async (message, args, client) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      // modOnly doesn't work
      return;
    } else {
      if (message.guild.id != "472261911526768642") return; 
      if (message.author.id == "620964363729371137" || message.author.id == "439223656200273932") {
        let chances = [1, 1, 1, 1, 1, 1, 1, 1, 1, 10]
        let random = chances[Math.floor(Math.random () * chances.length)]
        if (random == 1) {
          message.channel.send("SiNcE yOu aRe a MiNi NaRrAtOr aNd YoU tHiNk YoU aRe bEtTeR tHaN aShiSh, tRy fIguRiNg wHaT iS wRoNg WiTh mE")
          return ;
        }
      }
      let wwsVote = await db.fetch(`wwsVote_${message.guild.id}`);
      let commandEnabled = await db.fetch(`commandEnabled_${message.guild.id}`);
      let voteChat = message.guild.channels.cache.find(c => c.name === "vote-chat");
      let dayChat = message.guild.channels.cache.find(c => c.name === "day-chat");
      let aliveRole = message.guild.roles.cache.find(r => r.name === "Alive");
      db.set(`wwsVote_${message.guild.id}`, "NO");
      db.set(`skippedpl`, 0)
      let votes = Math.floor(parseInt(aliveRole.members.size) / 2);
      voteChat.send(`<@&${aliveRole.id}>`);
      dayChat.send(`Get ready to vote! (${votes} votes required)`);
      db.set(`commandEnabled_${message.guild.id}`, `yes`);
      setTimeout(() => {
        if (db.get(`isNight_${message.guild.id}`) != "yes" && args[0] != "nm") {
          client.commands.get("night2").run(message, args, client)
        }
      }, 45000)
    }
  }
};
