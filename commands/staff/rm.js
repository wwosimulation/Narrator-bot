const { fn, emojis } = require("../../config.js")
const db = require("quick.db")

module.exports = {
  name: "rm",
  aliases: ["removemoney"],
  staffOnly: true,
  run: async (message, args, client) => {
    let amount = parseInt(args[0])
    if (!amount) return message.channel.send(`${args[0]} is not a valid amount`)
    args.shift()
    msg = ``
    args.forEach((x) => {
      let user = fn.getUser(x, message)
      if (user) {
        db.subtract(`money_${user.id}`, amount)
        console.log(user)
        msg += `Removed ${amount} ${emojis.coin} from ${user.user.tag}\n`
      } else {
        msg += `Unable to find the user ${x}\n`
      }
    })
    message.channel.send(msg)
  },
}
