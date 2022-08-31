const db = require("quick.db")
const { ids } = require("../../config")
const players = require("../../schemas/players")

module.exports = {
    name: "reset",
    description: "Reset the database.",
    usage: `${process.env.PREFIX}reset`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.member.roles.cache.has(ids.narrator) || message.member.roles.cache.has(ids.mini)) {
            let msg = await message.channel.send("Reset in progress")

            await message.guild.channels.cache
                .find((x) => x.name == "day-chat")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    VIEW_CHANNEL: false,
                })

            await message.guild.channels.cache
                .find((c) => c.name === "vote-chat")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })

            await message.guild.channels.cache
                .find((x) => x.name == "game-lobby")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })

            db.set(`gamePhase`, -10)

            let wwChat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
            let zombiesChat = message.guild.channels.cache.find((c) => c.name === "zombies-chat")
            let siblingsChat = message.guild.channels.cache.find((c) => c.name === "siblings-chat")
            let wwVote = message.guild.channels.cache.find((c) => c.name === "ww-vote")

            db.get(`players`)?.forEach(async (p) => {
                await wwChat.permissionOverwrites.delete(p)
                await wwVote.permissionOverwrites.delete(p)
                await zombiesChat.permissionOverwrites.delete(p)
                await siblingsChat.permissionOverwrites.delete(p)

                let member = await message.guild.members.fetch(p)
                await member.roles.set(member.roles.cache.filter((r) => !["Corrupted", "Revealed"].includes(r.name)).map((r) => (r.name === "Dead" ? ids.alive : r.id)))
            })

            db.delete(`players`)

            let mid = db.get("game.id")
            let s = client.guilds.cache.get(ids.server.sim)
            s?.channels.cache
                .get("606123818305585167")
                .messages.fetch(mid)
                .then((m) => {
                    if (m?.author?.id == client.user.id) {
                        let allc = m.components
                        if (allc) {
                            let row = allc[0]
                            let [button1] = row.components
                            button1.disabled = true
                            m.edit({ components: [{ type: 1, components: [button1] }] })
                        }
                    }
                })

            db.delete(`game`)

            db.all()
                .filter((data) => data.ID.startsWith("player_"))
                .forEach((data) => db.delete(data.ID))

            let save = ["rankedseason", "stafflist", "stafflist2", "stafflist3", "entermsg", "hoster", "gamePhase", "started", "usedChannels", "wwsVote", "winner", "vtshadow", "xpGiven", "nextRequest", "gamewarnIndex", "gamewarnCount", "logs", "gameCode", "game", "maintance", "xpExclude"]

            db.all().forEach(async (i) => {
                if (i.ID.startsWith("roses_")) {
                    await players.updateOne({ user: i.ID.replace("roses_", "") }, { $inc: { roses: 1 } })
                }
                if (!save.includes(i.ID)) db.delete(i.ID)
            })
            const temproles = message.guild.channels.cache.find((x) => x.name == "private channels")
            await temproles?.children?.forEach(async (channel) => {
                await channel.delete()
            })

            const extras = message.guild.channels.cache.filter((c) => c.name === "sect" || c.name === "bandits")
            await extras?.forEach(async (chan) => {
                await chan.delete()
            })

            await msg.edit("Reset complete").catch((e) => message.channel.send(`Error: ${e.message}`))
        }
    },
}
