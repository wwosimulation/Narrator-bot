const db = require("quick.db");

module.exports = {
  name: "skip",
    gameOnly: true,
    run: async (message, args, client) => {
      return message.channel.send("Use the slash command!") //so we aren't updating in two locations
    if (!message.channel.name.includes("priv")) {
      return message.channel.send("Use this in your private channel!")
    } else {
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      if (!ownself.roles.cache.has(alive.id)) {
        return await message.channel.send(
          `You cannot skip the discussion phase while dead!`
        );
      } else {
        let isDay = await db.fetch(`isDay`);
        let day = await db.fetch(`dayCount`);
        let vote = db.get(`commandEnabled`)
        let skipus = db.get(`skipus_${message.author.id}`)
        if (day < 5) return message.channel.send("You can only skip after Day 5!")
        if (isDay != "yes" && vote == "yes") {
          return await message.channel.send(
            "You can only skip the discussion phase during the day!"
          );
        } else {
          if (alive.members.size > 8) {
            return await message.channel.send(
              "You can only skip the discussion phase if there are 8 or less players alive!"
            );
          } else {
            if (skipus == true) return message.channel.send("You already voted to skip the discussion phase!")
            let dayChat = message.guild.channels.cache.find(c => c.name === 'day-chat') 
            let commands = message.guild.channels.cache.find(c => c.name === 'commands')  
            dayChat.send(`Someone voted to skip the discussion phase!`)
            commands.send(`${message.member.nickname} decided to skip the discussion phase!`)
            db.add(`skippedpl`, 1)
            if (db.get(`skippedpl`) == alive.members.size - 1) {
                dayChat.send(`Enough players voted to skip the discussion phase!`)
                client.commands.get("vt").run(message, args, client)
            }
          }
        }
      }
    }
  }
};
