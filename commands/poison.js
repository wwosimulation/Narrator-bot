const db = require("quick.db");

module.exports = {
  name: "poison",
  run: async (message, args, client) => {
    if (message.channel.name == "priv-witch") {
      let ability = await db.fetch(`ability_${message.channel.id}`);
      ;
      ;
      let day = await db.fetch(`isDay_${message.guild.id}`);
      let night = await db.fetch(`nightCount_${message.guild.id}`);
      let isNight = await db.fetch(`isNight_${message.guild.id}`);
<<<<<<< HEAD
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
=======
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
              if (!guy || !guy.roles.cache.has(client.config.ids.alive) || !ownself.roles.cache.has(client.config.ids.alive)) {
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
                    guy.roles.add(client.config.ids.dead)
                    guy.roles.remove(client.config.ids.alive)
                    db.set(`ability_${message.channel.id}`, 1);
                  }
                }
              }
            }
          }
        }
>>>>>>> ids
      }
      message.guild.channels.cache.find(c => c.name === "day-chat").send(`<:poison:744536282889322496> The Witch poisoned **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})`)
      guy.roles.add(dead.id)
      guy.roles.remove(alive.id)
      db.set(`ability_${message.channel.id}`, 1)
    }
  }
};
