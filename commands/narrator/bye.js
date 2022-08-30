<<<<<<< HEAD
<<<<<<< HEAD
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
        await client.channels.cache.get("892046244715835463").send("== Game End ==")
        await m.edit("Game end complete!").catch(() => {})
    },
}

const kick = (message) => {
    message.guild.members.cache.forEach((e) => {
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
=======
=======
>>>>>>> be9fa80 (Prettified Code!)
const { ids } = require("../../config")
const db = require("quick.db")

module.exports = {
    name: "bye",
    description: "Clean the game server.",
    usage: `${process.env.PREFIX}bye`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        await kickPlayers(message)
        await kickSpectators(message)
        let m = await message.channel.send("Players have been kicked, I am now ending the game and deleting the role .")
        await sleep(3000)
        await clearJoin(client)
        m.edit("Game end complete!").catch(() => {})
    },
}

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

const kickPlayers = async (message) => {
    for (let i = 1; i <= 16; i++) {
        let guy = await message.guild.members.cache.find((m) => m.nickname === i.toString())
        if (guy) {
            if (guy.roles.cache.has("639210646826647592")) {
                message.channel.send(`I cannot kick ${guy.user.tag} because they are a booster. Please remove their nickname, Alive role, and their Dead role manually.`)
            } else {
                await guy.kick()
                console.log(`Kicked ${i}`)
            }
        }
    }
}

const kickSpectators = async (message) => {
    let spec = await message.guild.roles.cache.find((r) => r.name === "Spectator")
    await spec.members.forEach(async (e) => {
        await e.kick()
        console.log(`Kicked ${e.user.tag}`)
    })
}

const clearJoin = async (client) => {
    let t = client.guilds.cache.get(ids.server.sim)?.roles.cache.get("606123676668133428")?.members
    t?.forEach((e) => {
        e.roles.remove("606123676668133428") // joining role
    })
}
<<<<<<< HEAD
>>>>>>> 458fee7 (Bug fixes)
=======
>>>>>>> be9fa80 (Prettified Code!)
