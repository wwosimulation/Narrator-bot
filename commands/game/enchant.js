const db = require("quick.db")

module.exports = {
    name: "enchant",
    description: "Enchant/Disguise a player so that it appears like this player has your role when a seer checks them.",
    usage: `${process.env.PREFIX}enchant <player>`,
    aliases: ["shaman", "disguise", "delude"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-wolf-shaman") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let isDay = db.get(`isDay`)
            if (!args[0]) return message.channel.send("You are an as*h***")
            let role = await db.fetch(`role_${guy.id}`)
            let toShaman = role.toLowerCase()
            if (isDay != "yes") return message.channel.send("So enchanting during the night? You do know this really doesn't have any effect as it only takes place during the following night right?")
            if (!guy || guy == ownself) {
                return await message.reply("Invalid target!")
            } else {
                if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
                    return await message.reply(`You or your target isn't alive!`)
                } else {
                    if (toShaman.includes("wolf")) {
                        return await message.reply("You can't use your abilities on other werewolves!")
                    } else {
                        db.set(`shaman_${message.channel.id}`, args[0])
                        message.react("475776068431904769")
                    }
                }
            }
        } else if (message.channel.name == "priv-illusionist") {
            let disguised = db.get(`disguised_${message.channel.id}`) || []
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let isNight = db.get(`isNight`)
            if (!args[0]) return message.channel.send("You know, doing `+suicide` is better than disguising no one")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("It's about time you know that you are DEAD and can't disguise others noob.")
            if (isNight != "yes") return message.channel.send("Disguising during the day is for the Wolf Shaman. You are the Illusionist smh. Open your eyes pls")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy == message.member) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("Disguising a dead player just isn't gonna work.")
            if (disguised.length > 0) {
                if (disguised.includes(guy.nickname)) return message.channel.send("Breaking me won't work. You already disguised this player...")
            }
            message.channel.send(`<:delude:745632655038742568> You decided to disguise **${guy.nickname} ${guy.user.username}**!`)
            db.set(`toDisguise_${message.channel.id}`, guy.nickname)
        }
    },
}
