const db = require("quick.db");

module.exports = {
  name: "sethhtarget",
  aliases: ["sethh"],
  run: async (message, args, client) => {
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let narrator = message.guild.roles.cache.find(r => r.name == "Narrator");
    let mininarr = message.guild.roles.cache.find(
      r => r.name === "Narrator Trainee"
    );

    if (!args[1]) return message.channel.send("Please use the following: `+sethhtarget [user to be the target] [the channel id for headhunter]`");

    let guy =
      message.guild.members.cache.find(m => m.nickname === args[0]) ||
      message.guild.members.cache.find(m => m.id === args[0]) ||
      message.guild.members.cache.find(m => m.user.username === args[0]);

    db.set(`hhtarget_${args[1]}`, guy.nickname);
    message.guild.channels.cache.get(args[1]).send("Your target is **" + guy.nickname + " " + guy.user.username  + "**!")
  }
};
