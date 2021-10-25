const db = require("quick.db")
const { fn } = require("../../config")

module.exports = {
    name: "hunt",
    description: "Hunt a player and kill them if they belong to the sect.",
    usage: `${process.env.PREFIX}hunt <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-sect-hunter") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            let sect = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let gamePhase = db.get(`gamePhase`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (gamePhase % 3 != 0) return await message.channel.send("You can use your ability only at night!")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "The Prognosticator activated their power last night. You can't kill anyone." })
            if (!guy || guy == ownself) return await message.channel.send("Invalid Target!")
            if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) return await message.channel.send("You or the player are not alive!")
            if (sect.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) return await message.channel.send("You are sected.")
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `hunt_${dc.chan.id}` : `hunt_${message.channel.id}`}`, args[0])
            message.channel.send("Done.")
        }
    },
}
