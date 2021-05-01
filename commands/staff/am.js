const { fn, emojis } = require("../../config.js")
const db = require("quick.db")

module.exports = {
  name: "am",
  aliases: ["addmoney"],
  staffOnly: true,
  run: async (message, args, client) => {
    let amount = parseInt(args[0])
    if (!amount) return message.channel.send(`${args[0]} is not a valid amount`)
    args.shift()
    msg = ``
    args.forEach((x) => {
      let user = fn.getUser(x, message)
      if (user) {
        db.add(`money_${user.id}`, amount)
        console.log(user)
        msg += `Added ${amount} ${emojis.coin} to ${user.user.tag}\n`
      } else {
        msg += `Unable to find the user ${x}\n`
      }
    })
    message.channel.send(msg)
  },
}
