const db = require("quick.db")

module.exports = {
    name: "trap",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-beast-hunter") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let setTrap = await db.fetch(`setTrap_${message.channel.id}`)
            let trapActive = await db.fetch(`trapActive_${message.channel.id}`)
            let night = await db.fetch(`nightCount`)
            if (!args[0]) return message.reply("Can you please commit suicide. Ty")
            if (!guy) return await message.reply("Invalid target!")

            if (!message.member.roles.cache.has(alive.id) || !guy.roles.cache.has(alive.id)) return await message.reply("You or your target isn't alive!")

            message.react("475775073475887134")
            db.set(`setTrap_${message.channel.id}`, args[0])
            db.set(`trapActive_${message.channel.id}`, false)
        }
    },
}
