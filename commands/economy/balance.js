const db = require("quick.db")

module.exports = {
  name: "balance",
  aliases: ["bal", "coins", "money"],
  run: async (message, args) => {
    let bal = db.get(`money_${message.author.id}`) || 0
    return message.channel.send(`You currently have ${bal} coins <:coin:606434686931173377>`)
  },
}
