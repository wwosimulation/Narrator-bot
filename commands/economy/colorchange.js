const db = require("quick.db")
const toHex = require("colornames")

module.exports = {
  name: "colorchange",
  run: async (message, args, client) => {
    let role = db.get(`srole_${message.author.id}`) || "0"
    
    if (role == "0") {
      let specialrolesname = client.guilds.cache.get("465795320526274561").roles.cache.get("606247032553865227")
      let colorsrolename = client.guilds.cache.get("465795320526274561").roles.cache.get("606247387496972292")
      let allsprole = client.guilds.cache.get("465795320526274561").roles.cache.filter(r => r.position < specialrolesname.position && r.position > colorsrolename.position)
      let hassprole = false
      allsprole.forEach(e => {
        if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has(e.id)) {
          db.set(`srole_${message.author.id}`, e.id)
          role = e.id
        }
      })
    }
    
    let color = args.join(" ")

    if(!color) return message.channel.send("Idiot, you need to give me a color")
    
    
    if (role == "0") return message.channel.send("I cannot find your special role! In case this doesn't make sense, try reporting this using +bug.")
    
    if (color.length < 1) return message.channel.send("Stop. being. stupid. you. dumb. weirdo. Give me a color!")
    
    if (color.length > 99) return message.channel.send("Too many characters!")
    
    if (!color.startsWith("#")) {
      color = toHex(color)
    }
    
    if (!color.startsWith("#")) return message.channel.send(color + " isn't a vaild color!")
    

      client.guilds.cache.get("465795320526274561").roles.cache.get(role).setColor(color).then(() => {
        message.channel.send("Done! Your special role color has been changed!")  
      }).catch(e => {
        return message.channel.send(e.message)
      })
  }
}
