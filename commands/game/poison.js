const db = require("quick.db");

module.exports = {
  name: "poison",
  gameOnly: true,
  run: async (message, args, client) => {
    if (message.channel.name == "priv-witch") {
      let ability = await db.fetch(`ability_${message.channel.id}`);
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let dead = message.guild.roles.cache.find(r => r.name === "Dead");
      let day = await db.fetch(`isDay`);
      let night = await db.fetch(`nightCount`);
      let isNight = await db.fetch(`isNight`);
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || message.guild.members.cache.find(m => m.user.username === args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.find(m => m.id === args[0])
      let sected = message.guild.channels.cache.find(c => c.name === "sect-members")
      if (!args[0]) return message.channel.send("Yes, you expect me to poison the air")
      if (!guy || guy == message.member) return message.reply("Invalid Target!")
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Yes, poisoing as dead. Even Alchemist is better than you")
      if (!guy.roles.cache.has(alive.id)) return message.channel.send("Oh of course. Poisoning a dead player. If you were an Alchemist, I could understand, but you are a witch bi-.")
      if (isNight == "yes") {
        if (night == 1) return message.channel.send("You can't poison during the first night. You do know there is a DESCRIPTION for YOU to READ.")
      }
      if (day == "yes") return message.channel.send("Omaigod, we have stupid as a decease.")
      if (ability == 1) return message.channel.send("You already used your ability dumb.")
      if (db.get(`role_${guy.id}`) == "President") return message.channel.send("Bruh, you can't poison the president...")
      if (sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
        if (db.get(`role_${guy.id}`) == "Sect Leader") return message.channel.send("Yes, trying to kill your leader. Dumb, if it wasn't for me, you would be reported for gamethrowing.")
      }
      message.guild.channels.cache.find(c => c.name === "day-chat").send(`<:poison:744536282889322496> The Witch poisoned **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
      guy.roles.add(dead.id)
      guy.roles.remove(alive.id)
      db.set(`ability_${message.channel.id}`, 1)
    }
  }
};
