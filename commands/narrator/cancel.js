const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "cancel",
    description: "Cancel a game.",
    usage: `${process.env.PREFIX}cancel`,
    narratorOnly: true,
    run: async (message, client, args) => {
        if (db.get(`game.id`) == null) return message.channel.send("No game is being hosted")
        let server = client.guilds.cache.get(ids.server.sim)

        server.channels.cache.find((c) => c.name === "game-announcements").send(`Game was canceled. Sorry for the inconvenience!`)
        let t = server.roles.cache.get(ids.server.sim).members
        t.forEach((e) => {
            e.roles.remove("606123676668133428") //joining role
        })
        let mid = db.get("game.id")
        server.channels.cache
            .get("606123818305585167") //game warning
            .messages.fetch(mid)
            .then((m) => {
                let allc = m.components
                let row = allc[0]
                let button = row.components[0]
                button.disabled = true
                m.edit({ components: [{ type: 1, components: [button] }] })
            })
        db.delete(`game`)
        await client.channels.cache.get("892046244715835463").send("== Cancel ==")
    },
}
