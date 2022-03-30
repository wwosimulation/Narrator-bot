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
        //await clearMainChannels(message)
        //await sleep(1000)
        //await clearSettings(message)
        //await sleep(1000)
        await clearJoin(client)
        await endGame(client)
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

// const clearMainChannels = async (message) => {
//     let chans = ["vote-chat", "music-commands", "shadow-votes", "jailed-chat", "werewolves-chat", "time", "dead-chat", "day-chat", "enter-game", "game-lobby"]
//     let ingame = message.guild.channels.cache.filter((c) => chans.includes(c.name))
//     asyncForEach(ingame, async (e, a, b) => {
//         let ashish = await e.messages.fetch()
//         let filt = ashish.filter((c) => !c.pinned)
//         if (filt.size < 50) {
//             await e.bulkDelete(filt)
//             console.log(`Cleared #${e.name}`)
//         } else {
//             for (let i = 0; i < filt.size; i + 50) await e.bulkDelete(50)
//             await e.bulkDelete(filt)
//             console.log(`Bulk cleared #${e.name}`)
//         }
//     })
// }

// const clearSettings = async (message) => {
//     let settings = message.guild.channels.cache.filter((c) => c.parentID === "892046231516368906")
//     asyncForEach(settings, async (e) => {
//         let oki = await e.messages.fetch()
//         let hmm = oki.filter((m) => !m.pinned && Date.now() - m.createdTimestamp < 60 * 60 * 24 * 14)
//         if (hmm.size > 0) {
//             e.bulkDelete(hmm)
//             console.log(`Cleared #${e.name}`)
//         }
//     })
// }

const clearJoin = async (client) => {
    let t = client.guilds.cache.get(ids.server.sim).roles.cache.get("606123676668133428").members
    t.forEach((e) => {
        e.roles.remove("606123676668133428") // joining role
    })
}

const endGame = async (client) => {
    let mid = db.get("game")
    let s = client.guilds.cache.get(ids.server.sim)
    s.channels.cache
        .get("606123818305585167")
        .messages.fetch(mid)
        .then((m) => {
            if (m?.author?.id == client.user.id) {
                let allc = m.components
                if (allc) {
                    let row = allc[0]
                    let button = row.components[0]
                    button.disabled = true
                    m.edit({ components: [{ type: 1, components: [button] }] })
                }
            }
        })

    db.set(`game`, null)
}
