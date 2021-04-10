const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
  name: "new",
  run: async (message, args, client) => {
    if (message.guild.id != "465795320526274561") return;
    
    if (message.channel.id == "606230556832825481") {
      let ticket = db.get(`tickets_${message.guild.id}`) || 1
      
      let t = await message.guild.channels.create(`ticket-${ticket}`, {
        parent: "606230513103142932",
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ["VIEW_CHANNEL"]
          }, 
          {
            id: message.member.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"]
          },
          {
            id: client.user.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES", "MANAGE_CHANNELS"]
          },
          {
            id: "606123615645204490",
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES", "MANAGE_CHANNELS"]
          },
          {
            id: "606123617868316683",
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES", "MANAGE_CHANNELS"]
          },
          {
            id: "606123618849521674",
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES", "MANAGE_CHANNELS"]
          },
          {
            id: "606123616987512853",
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES", "MANAGE_CHANNELS"]
          }
        ]
      })
      await t.send(`<@&606138123260264488>`)
      setTimeout(async () => {
        await t.delete()
        await t.send(new Discord.MessageEmbed().setTitle(`Ticket ${ticket}`).setColor("BLUE").setDescription(`This ticket was created by ${message.member}`).addField(`Subject:`, args ? args.join(" ") : "None given"))
      })
    }
  }
}
