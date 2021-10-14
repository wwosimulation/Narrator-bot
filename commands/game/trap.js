const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "trap",
    description: "Place your trap on a player.",
    usage: `${process.env.PREFIX}trap <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-beast-hunter") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = config.fn.dcActions(message, db, alive)
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let setTrap = await db.fetch(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `setTrap_${dc.chan.id}` : `setTrap_${message.channel.id}`}`)
            let trapActive = await db.fetch(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `trapActive_${dc.chan.id}` : `trapActive_${message.channel.id}`}`)
            let gamePhase = db.get(`gamePhase`)
            let night = Math.floor(gamePhase / 3) + 1
            if (!args[0]) return message.reply("Who are you trapping? Mention the player.")
            if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
            if (gamePhase % 3 != 0) return message.reply("You can use your ability only at night!")

            if (!message.member.roles.cache.has(alive.id) || !guy.roles.cache.has(alive.id)) return await message.reply("You or the player isn't alive!")

            message.react("475775073475887134")
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `setTrap_${dc.chan.id}` : `setTrap_${message.channel.id}`}`, args[0])
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `trapActive_${dc.chan.id}` : `trapActive_${message.channel.id}`}`, false)
        }
    },
}
