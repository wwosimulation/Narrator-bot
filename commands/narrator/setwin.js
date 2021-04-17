const db = require("quick.db")
module.exports = {
  name: "setwin",
  gameOnly: true,
  narratorOnly: true,
  run: async (message, args, client) => {
    db.set(`winner`, args.join(" "))
    message.channel.send("Done!")
    db.set(`isDay_${message.guild.id}`, "yes")
    db.set(`isNight_${message.guild.id}`, "yes")
    db.set(`commandEnabled_${message.guild.id}`, "yes")
  },
}
