const db = require("quick.db")

module.exports = {
    name: "watch",
    aliases: ["intentlystareat"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-mortician") {
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let target = db.get(`mortician_${message.channel.id}`)
            if (!guy || guy == ownself) return await message.reply("Invalid target!")
            if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) return await message.reply(`You or your target isn't alive!`)
            if (mortician != null) return await message.reply(`You are already watching ${mortician}!`)
            if (dayCount <= 1) return message.channel.send("You can only start watching a player after day 1!")
            db.set(`mortician_${message.channel.id}`, args[0])
        }
    },
}
