const db = require("quick.db");

module.exports = {
  name: "illukill",
  run: async (message, args, client) => {
    if (message.member.hasPermission("MANAGE_CHANNELS")) {
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return await message.channel.send(
          "You are a narrator in training. Do it manually!"
        );
			if (message.author.id == `476433351323025410`) 	return await db.fetch('I thought you like to use dyno? I am not gonna work if its you.')

      for (let i = 0; i < args.length; i++) {
        let day = message.guild.channels.cache.find(c => c.name === "day-chat");
        let alive = message.guild.roles.cache.find(r => r.name === "Alive");
        let dead = message.guild.roles.cache.find(r => r.name === "Dead");
        let guy = message.guild.members.cache.find(m => m.nickname === args[i]);
        let role = await db.fetch(`role_${guy.id}`);
        day.send(
          `The Illusionist killed **${args[i]} ${guy.user.username} (${role})**!`
        );
        guy.roles.remove(alive.id);
        guy.roles.add(dead.id);
      }
    }
  }
};
