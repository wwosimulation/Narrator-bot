let sentMessage = sentMessage => sentMessage.react;
module.exports = {
  name: "sow",
  run: async (message, args, client) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      let randomMessage = [
        "Looks like you have brain tumor. This command can only be executed by Narrators",
        "Are you dumb or what? Go back to first grade and learn how to write. This is only for Narrators.",
        "🤬. This command can only be executed by narrator. For once, open your eyes man!",
        "🤬 you can read or not? This is only for narrators!"
      ];
      
      randomMessage = randomMessage[Math.floor(Math.random() * 4)];
      message.channel.send(randomMessage)
    } else {
      let channel = message.guild.channels.cache.find(c => c.name === "vote-chat");
      message.delete()
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let m = await channel.send(`<@&${alive.id}> Start or Wait?`);
      await m.react("👍")
      await m.react("👎")
    }
  }
};
