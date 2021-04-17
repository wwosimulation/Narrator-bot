const db = require("quick.db")

module.exports = {
  name: "cancel",
  narratorOnly: true,
  run: async (message, client, args) => {
    if (db.get(`game`) == null) return message.channel.send("No game is being hosted")

    message.guild.channels.cache.find((c) => c.name === "game-warning").send(`Game was canceled. Sorry for the inconvenience!`)
    db.delete(`game`)
  },
}
