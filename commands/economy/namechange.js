const db = require("quick.db")

module.exports = {
  name: "namechange",
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
    
    
    if (role == "0") return message.channel.send("I cannot find your special role! In case this doesn't make sense, try DMing Ashish#0540 with the proof it's not working.")
    
    if (args.length < 1) return message.channel.send("Stop. being. stupid. you. dumb. weirdo.")
    
    if (args.join(" ").length > 99) return message.channel.send("Too many characters!")
    
    client.guilds.cache.get("465795320526274561").roles.cache.get(role).edit({name: args.join(" ")})
    message.channel.send("Done! Your special role name is: " + args.join(" "))
  }
}
