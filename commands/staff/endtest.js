const db = require("quick.db")
const { ids, fn } = require("../../config")

module.exports = {
    name: "endtest",
    description: "End a interaction test.",
    usage: `${process.env.PREFIX}endtest`,
    staffOnly: true,
    run: async (message, args, client) => {
        if (db.get(`game`) == null) return message.channel.send("No test is being hosted.")
        let m = await client.guilds?.fetch(ids.server.sim)?.channels.fetch("606123818305585167")?.messages?.fetch(db.get("game"))
        m.edit(fn.disableButtons(m))
        db.set("game", null)
        client.guilds.cache
            .get(ids.server.sim)
            .roles.cache.get(ids.joinTest)
            .members.each((m) => m.roles.remove(ids.joinTest, "Test ended!"))
        message.channel.send("Test ended and roles cleared!")
    },
}
