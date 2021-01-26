const db = require("quick.db");

module.exports = {
  name: "poison",
  run: async (message, args, client) => {
    if (message.channel.name == "priv-witch") {
      let ability = await db.fetch(`ability_${message.channel.id}`);
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let dead = message.guild.roles.cache.find(r => r.name === "Dead");
      let day = await db.fetch(`isDay_${message.guild.id}`);
      let night = await db.fetch(`nightCount_${message.guild.id}`);
      let isNight = await db.fetch(`isNight_${message.guild.id}`);
      if (night == 1) {
        return await message.reply(`You cannot poison on the first night!`);
      } else if (day == "yes") {
        return await message.reply("This action can only be done at night");
      } else {
        if (ability == 1) {
          return await message.reply(
            "You have already used up your poisoning ability!"
          );
        } else {
          if (!args) {
            return await message.reply("You need to select a target!");
          } else {
            if (
              parseInt(args[0]) >
                parseInt(alive.members.size) + parseInt(dead.members.size) ||
              parseInt(args[0]) < 1
            ) {
              return await message.reply("Invalid target");
            } else {
              let ownself = message.guild.members.cache.find(
                m => m.nickname === message.member.nickname
              );
              let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
              if (!guy || !guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
                return await message.reply(
                  "You or your target are already dead!"
                );
              } else {
                if (args[0] == message.member.nickname) {
                  return await message.reply(`You cannot poison yourself!`);
                } else {
                  if (isNight !== "yes") {
                    console.log(isNight);

                    message.reply(
                      "This action can only be done during the night! "
                    );
                  } else {
                    if (ability == 1) {
                      return await message.reply(
                        `You have already used your poisoning ability!`
                      );
                    }
                    let role = await db.fetch(`role_${guy.id}`);
                    let dayChat = message.guild.channels.cache.find(
                      c => c.name === "day-chat"
                    );
                    dayChat.send(
                      `The Witch poisoned **${args[0]} ${guy.user.username} (${role})**!`
                    );
                    guy.roles.add(dead.id)
                    guy.roles.remove(alive.id)
                    db.set(`ability_${message.channel.id}`, 1);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
