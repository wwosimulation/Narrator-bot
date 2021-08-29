const db = require("quick.db")

module.exports = {
    name: "heal",
    description: "Protect somebody so they won't be able to be attacked during the night.",
    usage: `${process.env.PREFIX}heal <player>`,
    aliases: ["protect", "save"],
    gameOnly: true,
    run: async (message, args, client) => {
        let isNight = await db.fetch(`isNight`)
        if (message.channel.name === "priv-doctor") {
            if (isNight != "yes") {
                return await message.reply("You can only use this during the night!")
            } else {
                let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
                if (!guy.roles.cache.has("606140092213624859") || !ownself.roles.cache.has("606140092213624859")) return await message.reply("You or your target isn't alive!")
                if (guy == ownself) return await message.channel.send("You cannot protect yourself.")
                db.set(`heal_${message.channel.id}`, args[0])
                message.react("475775251297337344")
            }
            ;``
        } else if (message.channel.name === "priv-witch") {
            if (isNight != "yes") {
                return await message.reply(`You can use the ability only at night!`)
            } else {
                let witch = await db.fetch(`witchAbil_${message.channel.id}`)
                if (witch == 1) {
                    return await message.reply("You have already used your ability!")
                } else {
                    let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                    let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
                    if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
                    if (guy == ownself) return await message.channel.send("You cannot protect yourself.")
                    if (!guy.roles.cache.has("606140092213624859") || !ownself.roles.cache.has("606140092213624859")) return await message.reply("You can play with alive people only!")
                    db.set(`potion_${message.channel.id}`, args[0])
                    message.react("596733389084819476")
                }
            }
        } else if (message.channel.name == "priv-bodyguard") {
            let lives = await db.fetch(`lives_${message.channel.id}`)
            if (lives == null) {
                db.set(`lives_${message.channel.id}`, 2)
                lives = await db.fetch(`lives_${message.channel.id}`)
            }
            //let protect = args[0]
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
            if (guy == ownself) return await message.channel.send("You cannot protect yourself.")
            if (!guy.roles.cache.has("606140092213624859") || !ownself.roles.cache.has("606140092213624859")) return await message.reply("You or your target isn't alive!")
            db.set(`guard_${message.channel.id}`, args[0])
            message.react("475775137434697728")
        } else if (message.channel.name == "priv-tough-guy") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let isNight = db.get(`isNight`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!args[0]) return message.channel.send("Who do you want to protect? Mention the player.")
            if (isNight != "yes") return message.channel.send("You can use your ability only at night!")

            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (!guy || guy.nickname == message.member.nickname) return message.reply("The player is not in game! Mention the correct player number.")

            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            db.set(`tough_${message.channel.id}`, guy.nickname)
            message.react("606429479170080769")
        }
    },
}
