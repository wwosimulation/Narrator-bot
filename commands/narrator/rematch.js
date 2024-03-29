const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "rematch",
    description: "Creates a rematch game.",
    usage: `${process.env.PREFIX}rematch [new game code...]`,
    narratorOnly: true,
    gameOnly: true,
    run: async (message, args, client) => {
        if (db.get(`game.id`)) return message.channel.send(`There is already a game in progress. Use \`+reset\` first.`)

        client.guilds.cache.get(ids.server.game).members.cache.each((m) => {
            if (m.roles.cache.has(ids.dead) || m.roles.cache.has(ids.alive)) {
                let memRoles = m.roles.cache.filter((r) => ![ids.dead, ids.alive].includes(r.id)).map((r) => r.id)
                memRoles.push(ids.spectator)
                m.roles.set(memRoles)
                if (!m.roles.cache.has(ids.immunity)) {
                    m.setNickname("lazy spectatorz")
                } else {
                    m.setNickname(m.user.username)
                }
            }
        })

        await client.commands.get("gwhost").run(message, [args.length > 0 ? args.join(" ") : db.get("gameCode") + " - rematch"], client, true)
        await client.commands.get("enable").run(message, ["all"], client)
        await message.guild.channels.cache.find((c) => c.name === "carl-welcome-left-log")?.send("== rematch ==")

        message.channel.send("Rematch game created! Please make sure to clear all channels and we are ready to go!")
    },
}
