const db = require("quick.db")

module.exports = {
    name: "hunt",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-sect-hunter") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let sect = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let isNight = db.get(`isNight`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (!isNight == "yes") return await message.channel.send("You can use your ability only at night!")
            if (!guy || guy == ownself) return await message.channel.send("Invalid Target!")
            if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) return await message.channel.send("You or the player are not alive!")
            if (sect.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) return await message.channel.send("You are sected.")
            db.set(`hunt_${message.channel.id}`, args[0])
            message.channel.send("Done.")
        }
    },
}
