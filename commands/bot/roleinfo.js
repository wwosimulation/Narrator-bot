const db = require("quick.db")
const Discord = require("discord.js")
const { getRole } = require("../../config.js")

module.exports = {
  name: "roleinfo",
  run: async (message, args, client) => {
    if (args[args.length - 1] == "raw") {
      content = ""
      for (let i = 0; i < args.length - 1; i++) {
        if (i < args.length - 2) {
          content += args[i].toLowerCase() + " "
        } else {
          content += args[i].toLowerCase()
        }
      }
      return message.channel.send(
        new Discord.MessageEmbed()
          .setTitle("`" + db.get(`name_${content}`) + "`")
          .setDescription("```" + db.get(`roleinfo_${content}`) + "```\n```" + db.get(`thumbnail_${content}`) + "```")
          .setThumbnail(db.get(`thumbnail_${content}`))
      )
    }
    let role = getRole(args.join(" "))
    if(client.botAdmin(message.author.id)){
        message.channel.send(new Discord.MessageEmbed().setTitle(role.name).setDescription(role.description).setThumbnail(role.icon))
    } else {
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle(db.get(`name_${args.join(" ").toLowerCase()}`))
        .setDescription(db.get(`roleinfo_${args.join(" ").toLowerCase()}`))
        .setThumbnail(db.get(`thumbnail_${args.join(" ").toLowerCase()}`))
    )
    }
    
  },
}
