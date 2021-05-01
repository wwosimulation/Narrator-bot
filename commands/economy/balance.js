const db = require("quick.db")
const {fn, emojis} = require("../../config.js")

module.exports = {
  name: "balance",
  aliases: ["bal", "coins", "money"],
  run: async (message, args) => {
    let user = fn.getUser(args.join(" "), message)
    if(!user) user = message.author
    let bal = db.get(`money_${user.id}`)
    if(!bal) {
      bal = 0
      db.set(`money_${user.id}`, 0)
    }
    
    console.log(db.get(`money_${user.id}`), `money_${user.id}`)
    return message.channel.send(`${user.id == message.author.id ? "You" : user.user.tag} currently ${user.id == message.author.id ? "have" : "has"} ${bal} coins ${emojis.coin}`)
  },
}
