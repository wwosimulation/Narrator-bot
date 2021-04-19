const db = require("quick.db")
const Discord = require("discord.js")
const { getRole } = require("../../config.js")

module.exports = {
  name: "roleinfo",
  run: async (message, args, client) => {
    let role = getRole(args.join(" "))
    message.channel.send(new Discord.MessageEmbed().setTitle(role.name).setDescription(role.description).setThumbnail(role.icon))
  },
}
