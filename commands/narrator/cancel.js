const db = require("quick.db")
const { ids, fn } = require("../../config")
const stats = require("../../schemas/stats")

module.exports = {
    name: "cancel",
    description: "Cancel a game.",
    usage: `${process.env.PREFIX}cancel`,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (db.get(`game.id`) == null) return message.channel.send("No game is being hosted")
        let server = client.guilds.cache.get(ids.server.sim)

        server.channels.cache.find((c) => c.name.includes("game-announcements")).send(`Game was canceled. Sorry for the inconvenience!`)
        let t = server.roles.cache.get(ids.server.sim).members
        t.forEach((e) => {
            e.roles.remove("606123676668133428") //joining role
        })
        let mid = db.get("game.id")
        server.channels.cache
            .get("606123818305585167") //game warning
            .messages.fetch(mid)
            .then((m) => {
                m.edit(fn.disableButtons(m))
            })
        let stat = await stats.find()
        stat = stat[0]
        let gam = stat.games.find((game) => Object.keys(game) == mid)
        Object.values(gam)[0].status = "cancel"
        stat.markModified("games")
        stat.save()
        db.delete(`game`)
        client.commands.get("bye").run(message, args, client)
        client.guilds.cache
            .get(ids.server.game)
            .channels.cache.find((c) => c.name === "carl-welcome-left-log")
            ?.send("== Cancel ==")
    },
}
