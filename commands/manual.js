const db = require("quick.db");

module.exports = {
  name: "manual",
  run: async (message, args, client) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return;
    } else {
      message.react("💋");
      let content = args[1];
      let night = await db.fetch(`nightCount_${message.guild.id}`);
      let day = await db.fetch(`dayCount_${message.guild.id}`);
      let amtD = day - day * 2 + 1;
      let amtN = night - night * 2 + 1;
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      db.set(`dayCount_${message.guild.id}`, 0);
      db.set(`nightCount_${message.guild.id}`, 0);
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      let role = await db.fetch(`role_${guy.id}`, args[1]);
      let real = args[1].toLowerCase();
      let channel = message.guild.channels.cache.find(c => c.name === `priv-${real}`);
      let wwchat = message.guild.channels.cache.find(
        c => c.name === "werewolves-chat"
      );
      if (!channel)
        return await message.reply("Channel not found! Please retry.");

      let channels = message.guild.channels.cache.filter(
        c => c.name === `priv-${real}`
      );
      //console.log(channels)
      let tomato = channels.keyArray("id");
      let ch = await db.fetch(`channels_${real}`);
      console.log(tomato);
      if (content.includes("-")) {
        content = content.replace(
          /(\w+)-(\w+)/g,
          (_, m1, m2) =>
            `${m1[0].toUpperCase()}${m1
              .slice(1)
              .toLowerCase()} ${m2[0].toUpperCase()}${m2
              .slice(1)
              .toLowerCase()}`
        );
      } else {
        content = `${args[1][0].toUpperCase()}${args[1].slice(1).toLowerCase()}`
        message.channel.send(content);
      }

      const { Permissions } = require("discord.js");
      let permissions;
      console.log(tomato.length);
      for (let y = 0; y < tomato.length; y++) {
        let guy;
        for (let o = 1; o <= alive.members.size; o++) {
          guy = message.guild.members.cache.find(m => m.nickname === o.toString());
          permissions = channel.permissionsFor(guy).has(["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]);
          if (permissions) {
            channel = message.guild.channels.cache.find(c => c.id === tomato[y + 1]);
            if (!channel)
              return await message.channel.send(
                "All the channels for this role are occupied!"
              );
          }
        }
      }
      channel.updateOverwrite(guy.id, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true
      });
      if (real.includes("wolf") || real == 'sorcerer') {
        wwchat.updateOverwrite(guy.id, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
          READ_MESSAGE_HISTORY: true
        });
      }
      if (real == "sibling") {
        let sibling = message.guild.channels.cache.find(c => c.name === 'sibling-chat') 
        sibling.updateOverwrite(guy.id, {
          SEND_MESSAGES: true, 
          VIEW_CHANNEL: true, 
          READ_MESSAGE_HISTORY: true
        })
      } 
      db.set(`role_${guy.id}`, content);
    }
  }
};
