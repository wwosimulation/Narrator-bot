const { MessageActionRow } = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "cancel",
    narratorOnly: true,
    run: async (message, client, args) => {
        if (db.get(`game`) == null) return message.channel.send("No game is being hosted")

        message.guild.channels.cache.find((c) => c.name === "gwtest").send(`Game was canceled. Sorry for the inconvenience!`)
        let mid = db.get("game")
        message.guild.channels.cache
            .get("848405794319368223")
            .messages.fetch(mid)
            .then((m) => {
                let allc = m.components
                let row = allc[0]
                let button = row.components[0]
                button.disabled = true
                m.edit({ components: [new MessageActionRow().addComponents(button)] })
            })
        db.set(`game`, null)
        db.delete(`game`)
    },
}
