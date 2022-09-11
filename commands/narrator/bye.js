const { ids, fn } = require("../../config")

module.exports = {
    name: "bye",
    description: "Kick all players and spectators.",
    usage: `${process.env.PREFIX}bye`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        kick(client)
        let m = await message.channel.send("Players have been kicked, I am now ending the game and deleting the role .")
        await fn.sleep(3000)
        await clearJoin(client)
        await m.edit("Game end complete!").catch(() => {})
        await client.guilds.cache.get(ids.server.game).channels.cache.find((c) => c.name === "carl-welcome-left-log")?.send("== Game End ==")
    },
}

const kick = (client) => {
    client.guilds.cache.get(ids.server.game).members.cache.forEach((e) => {
        if (!e.permissions.any(["MANAGE_CHANNELS", "ADMINISTRATOR", "MANAGE_ROLES"])) {
            e.kick("Game end")
            console.log(`Kicked ${e.user.tag}`)
        }
    })
}

const clearJoin = async (client) => {
    let t = client.guilds.cache.get(ids.server.sim)?.roles.cache.get("606123676668133428")?.members
    t?.forEach((e) => {
        e.roles.remove("606123676668133428") // joining role
    })
}
