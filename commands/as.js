const db = require("quick.db")

module.exports = {
  name: "as",
  run: async (message, args, client) => {
     let arg = ""
     for (let i = 0 ; i < args.length - 1 ; i++) {
        if (i == args.length - 2) {
            arg += args[i]
        } else {
            arg += `${args[i]} `
        }
     }
     let user = client.users.cache.get(args[0]) || client.users.cache.find(u => u.username === arg) || client.users.cache.find(u => u.tag === arg)
     if (!user) return message.channel.send("Unknown user!")
     let num = parseInt(args[args.length - 1])
     if (!num) return message.channel.send("Dumb, that is not a number")
     db.add(`ranked_${user.id}`, num)
     message.react("👍")
  }
}
