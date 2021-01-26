const Discord = require("discord.js");

module.exports = {
  name: "serverinfo",
  run: async (message, args, client) => {
    let name = message.guild.name;
    let owner = message.guild.members.cache.find(
      m => m.id === message.guild.ownerID
    ).tag;
    let channels = message.guild.channels.cache.size;
    let roles = message.guild.channels.cache.size;
    let id = message.guild.id;
    let verificationLvl = message.guild.verificationLevel;
    let region = message.guild.region;
    let createdAt = message.guild.createdAt;
    let url = message.guild.iconURL();

    message.channel.send(
      new Discord.MessageEmbed().setTitle(name + "'s server").addField("Members", )
    );
  }
};
