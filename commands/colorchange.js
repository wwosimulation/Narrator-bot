const db = require("quick.db")
const toHex = require("colornames")

module.exports = {
  name: "colorchange",
  run: async (message, args, client) => {
    let role = db.get(`srole_${message.author.id}`) || "0"
    
    if (role == "0") {
      let specialrolesname = client.guilds.cache.get(client.config.simServer).roles.cache.get("606247032553865227")
      let colorsrolename = client.guilds.cache.get(client.config.simServer).roles.cache.get("606247387496972292")
      let allsprole = client.guilds.cache.get(client.config.simServer).roles.cache.filter(r => r.position < specialrolesname.position && r.position > colorsrolename.position)
      let hassprole = false
      allsprole.forEach(e => {
        if (client.guilds.cache.get(client.config.simServer).members.cache.get(message.author.id).roles.cache.has(e.id)) {
          db.set(`srole_${message.author.id}`, e.id)
          role = e.id
        }
      })
    }
    
    let color = args.join(" ")
    
    
    if (role == "0") return message.channel.send("I cannot find your special role! In case this doesn't make sense, try DMing Ashish#0540 with the proof it's not working.")
    
    if (color.length < 1) return message.channel.send("Stop. being. stupid. you. dumb. weirdo.")
    
    if (color.length > 99) return message.channel.send("Too many characters!")
    
    if (!color.startsWith("#")) {
      color = toHex(color)
    }
    
    if (!color.startsWith("#")) return message.channel.send(color + " isn't a vaild color!")
    
    client.guilds.cache.get(client.config.simServer).roles.cache.get(role).setColor(args.join(" ")).then(() => {
        message.channel.send("Done! Your special role color has been changed!")  
      }).catch(e => {
        return message.channel.send(e.message)
      })
  }
}
