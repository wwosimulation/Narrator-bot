const db = require("quick.db")
const { ids, fn } = require("../../config")

module.exports = {
    name: "cancel",
    description: "Cancel a game.",
    usage: `${process.env.PREFIX}cancel`,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (db.get(`game.id`) == null) return message.channel.send("No game is being hosted")
        let server = client.guilds.cache.get(ids.server.sim)

        server.channels.cache.find((c) => c.name === "game-announcements").send(`Game was canceled. Sorry for the inconvenience!`)
        let mid = db.get("game.id")
        server.channels.cache
            .get("606123818305585167") //game warning
            .messages.fetch(mid)
            .then((m) => {
                m.edit(fn.disableButtons(m))
            })
        db.delete(`game`)
        client.commands.get("bye").run(message, args, client)
        client.guilds.cache
            .get(ids.server.game)
            .channels.cache.find((c) => c.name === "carl-welcome-left-log")
            ?.send("== Cancel ==")
    },
}
