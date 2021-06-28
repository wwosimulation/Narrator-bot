const { fn, emojis } = require("../../config.js")
const db = require("quick.db")
const {players} = require("../../db.js")

module.exports = {
  name: "am",
  aliases: ["addmoney"],
  staffOnly: true,
  run: async (message, args, client) => {
    let amount = parseInt(args[0])
    if (!amount) return message.channel.send(`${args[0]} is not a valid amount`)
    args.shift()
    msg = ``
    amount = 0 - amount
    args.forEach(async (x) => {
      let user = fn.getUser(x, message)
      if (user) {
        let data = players.findOneAndUpdate({user: user.id}, {$inc : {coins: amount}}).exec()
        msg += `Removed ${amount} ${emojis.coin} from ${user.user.tag}\n`
      } else {
        msg += `Unable to find the user ${x}\n`
      }
    })
    message.channel.send(msg)
  },
}
