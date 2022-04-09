const db = require("quick.db")
const { ids } = require("../../config")
const players = require("../../schemas/players")

module.exports = {
    name: "reset",
    description: "Reset the database.",
    usage: `${process.env.PREFIX}reset`,
    gameOnly: true,
    run: async (message, args, client) => {
        console.log("hi")
        if (message.member.roles.cache.has(ids.narrator) || message.member.roles.cache.has(ids.mini)) {
            let times = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000]
            times = times[Math.floor(Math.random() * times.length)]

            message.guild.channels.cache
                .find((x) => x.name == "day-chat")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    VIEW_CHANNEL: false,
                })

            message.guild.channels.cache
                .find((c) => c.name === "vote-chat")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })

            message.guild.channels.cache
                .find((x) => x.name == "game-lobby")
                .permissionOverwrites.edit(ids.alive, {
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    VIEW_CHANNEL: true,
                })

            db.set(`gamePhase`, -10)
            let save = ["rankedseason", "stafflist", "stafflist2", "stafflist3", "entermsg", "hoster", "gamePhase", "started", "usedChannels", "wwsVote", "winner", "vtshadow", "xpGiven", "nextRequest", "gamewarnIndex", "gamewarnCount", "logs", "gameCode", "game", "maintance", "xpExclude"]
            db.all().forEach((i) => {
                if(i.ID.startsWith("roses_")) {
                    await players.updateOne({user: i.ID.replace("roses_", "")}, {$inc:{"roses": 1}})
                }
                if (!save.includes(i.ID)) db.delete(i.ID)
            })

            for (let i = 0; i < baker.length; i++) {
                db.delete(`bread_${baker[i]}`)
            }

            const temproles = message.guild.channels.cache.find((x) => x.name == "private channels")
            temproles.children.forEach((channel) => channel.delete())

            message.channel
                .send("Reset in progress")
                .then((msg) => {
                    setTimeout(function () {
                        msg.edit("Reset complete").catch((e) => message.channel.send(`Error: ${e.message}`))
                    }, times)
                })
                .catch((e) => message.channel.send(`Error: ${e.message}`))
        }
    },
}