const { ids, fn } = require("../../config")
const db = require("quick.db")

module.exports = {
    name: "bye",
    description: "Clean the game server.",
    usage: `${process.env.PREFIX}bye`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        kick(message)
        let m = await message.channel.send("Players have been kicked, I am now ending the game and deleting the role .")
        await fn.sleep(3000)
        await clearJoin(client)
        m.edit("Game end complete!").catch(() => {})
    },
}

const kick = (message) => {
    message.guild.members.cache.forEach((e) => {
        if(!e.permissions.any(["MANAGE_CHANNELS", "ADMIN", "MANAGE_ROLES"])) {
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
