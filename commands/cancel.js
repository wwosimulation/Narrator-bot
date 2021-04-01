const db = require("quick.db")

module.exports = {
   name: "cancel",
   run: async (message, client, args) => {
     
     if (message.guild.id != "465795320526274561") return;
     
     let narrator = message.guild.roles.cache.get("606123619999023114")
     let mininarr = message.guild.roles.cache.get("606123620732895232")
     
     if (!message.member.roles.cache.has(narrator.id) && !message.member.roles.cache.has(mininarr.id)) return;
     
     if (db.get(`game`) == null) return message.channel.send("No game is being hosted")
     
     message.guild.channels.cache.find(c => c.name === "game-warning").send(`Game was canceled. Sorry for the inconvenience!`)
     db.delete(`game`)
   }  
}
