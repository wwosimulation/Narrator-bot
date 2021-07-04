const db = require("quick.db")

module.exports = {
    name: "water",
    aliases: ["splash", "spray"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-priest") {
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let priest = await db.fetch(`priest_${message.channel.id}`)
            let isDay = await db.fetch(`isDay`)
            let dayCount = await db.fetch(`dayCount`)
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            if (!guy || guy == ownself) {
                return await message.reply("Invalid target!")
            } else {
                if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
                    return await message.reply(`You or your target isn't alive!`)
                } else {
                    if (priest != null) {
                        return await message.reply("You have already used up your ability!")
                    } else {
                        let role = await db.fetch(`role_${guy.id}`)
                        let toKill = role.toLowerCase()
                        if (isDay != "yes") return message.channel.send("Dumb, You can only pray in the morning.")
                        if (dayCount == 1) {
                            let cmd = await db.fetch(`commandEnabled`)
                            if (cmd != "yes") return await message.reply("You can only throw holy water on a player after voting starts on day 1!")
                        }
                        db.set(`priest_${message.channel.id}`, 1)
                        if (toKill.includes("wolf")) {
                            guy.roles.remove(alive.id)
                            guy.roles.add(dead.id)
                            dayChat.send(`<:water:744571479986798622> **${message.member.nickname} ${message.author.username} (Priest)** has thrown holy water at and killed **${args[0]} ${guy.user.username} (${role})**`)
                            ownself.roles.add(revealed.id)
                        } else {
                            ownself.roles.remove(alive.id)
                            ownself.roles.add(dead.id)
                            dayChat.send(`<:water:744571479986798622> **${message.member.nickname} ${message.author.username} (Priest)** tried to throw holy water on **${args[0]} ${guy.user.username}** and killed themselves! **${args[0]} ${guy.user.username}** is not a werewolf!`)
                        }
                    }
                }
            }
        }
    },
}
