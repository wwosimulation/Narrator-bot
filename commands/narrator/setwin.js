const db = require("quick.db")
module.exports = {
  name: "setwin",
  gameOnly: true,
  narratorOnly: true,
  run: async (message, args, client) => {
    db.set(`winner`, args.join(" "))
    message.channel.send("Done!")
    db.set(`isDay`, "yes")
    db.set(`isNight`, "yes")
    db.set(`commandEnabled`, "yes")
  },
}
