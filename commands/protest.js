const db = require("quick.db");

module.exports = {
  name: "protest",
  run: async (message, args, client) => {
    if (
      message.channel.name == "priv-flower-child" ||
      message.channel.name == "priv-guardian-wolf"
    ) {
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let dead = message.guild.roles.cache.find(r => r.name === "Dead");
      let isDay = await db.fetch(`isDay_${message.guild.id}`);
      let ability = await db.fetch(`protest_${message.channel.id}`);
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      if (!ability == "no")
        return await message.channel.send(
          "Stop protesting dumb. Once is enough."
        );
      if (!isDay == "yes")
        return await message.channel.send(
          "Yes! Protesting in the night. You aren't a doctor that will save the player that the wolves attack."
        );
      if (!guy) return await message.channel.send("Invalid Target!");
      if (!guy.roles.cache.has(alive.id) ||!ownself.roles.cache.has(alive.id))
        return await message.channel.send(
          "You probably have brain tumour. Protesting while being dead or protesting for others that are dead won't work."
        );
      if (message.channel.name == "priv-flower-child") {
        message.channel.send(
          `<:petal:745634256297918564> You are protesting for **${args[0]} ${
            guy.user.username
          }**!`
        );
        db.set(`flower_${message.channel.id}`, args[0]);
      } else {
        message.channel.send(
          `<:protest:745634377702310013> You are protesting for **${args[0]} ${
            guy.user.username
          }**!`
        );
        db.set(`guardian_${message.channel.id}`, args[0]);
      }
    }
  }
};
