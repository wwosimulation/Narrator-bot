const db = require("quick.db")

module.exports = {
    name: "watch",
    description: "Watch a player 👀.",
    usage: `${process.env.PREFIX}watch <player>`,
    aliases: ["intentlystareat"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-mortician") {
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let dayCount = Math.floor(db.fetch(`gamePhase`) / 3) + 1
            let nightCount = Math.floor(db.fetch(`gamePhase`) / 3) + 1
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let target = db.get(`mortician_${message.channel.id}`)
            if (!guy || guy == ownself) return await message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) return await message.reply("You can play with alive people only!")
            if (target != null) return await message.reply(`You are already watching ${target}!`)
            if (dayCount < 1 && nightCount < 2) return message.channel.send("You can watch a player after day 1!")
            db.set(`mortician_${message.channel.id}`, args[0])
            message.react("✅")
        }
    },
}
