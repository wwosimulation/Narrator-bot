const db = require("quick.db")

module.exports = {
  name: "as",
  run: async (message, args, client) => {
     let args = ""
     for (let i = 0 ; i < args.length - 1 ; i++) {
        if (i == args.length - 2) {
            args += args[i]
        } else {
            args += `${args[i]} `
        }
     }
     let user = client.users.cache.get(args[0]) || client.users.cache.find(u => u.username === args[0]) || client.users.cache.find(u => u.tag === args[0])
     if (!user) return message.channel.send("Unknown user!")
     let num = parseInt(args[args.length - 1])
     if (!num) return message.channel.send("Dumb, that is not a number")
     db.add(`ranked_${user.id}`, num)
     message.react("👍")
  }
}
