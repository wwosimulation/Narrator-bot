const db = require("quick.db")

module.exports = {
    name: "heal",
    aliases: ["protect", "save"],
    gameOnly: true,
    run: async (message, args, client) => {
        let isNight = await db.fetch(`isNight`)
        let alive = message.guild.roles.cache.find((c) => c.name === "Alive")
        let dead = message.guild.roles.cache.find((c) => c.name === "Dead")
        let chan
        let tempguy
        let hypnotized = db.get(`hypnotized_${message.channel.id}`)
        let guy = message.guild.members.cache.find((m) => m.nickname === hypnotized)
        let role = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${guy.id}`).replace(" ", "-").toLowerCase()}`).map((x) => x.id)
        for (let b = 0; b < role.length; b++) {
            let tempchan = message.guild.channels.cache.get(role[b])
            if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (guy.roles.cache.has(alive.id)) {
                    chan = tempchan
                    tempguy = guy
                }
            }
        }
        if (message.channel.name === "priv-doctor") {
            if (isNight != "yes") {
                return await message.reply("You can only use this during the night!")
            } else {
                let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
                if (!guy.roles.cache.has("606140092213624859") || !ownself.roles.cache.has("606140092213624859") || !tempguy.roles.cache.has(alive.id)) return await message.reply("You or your target isn't alive!")
                if (db.get(`role_${message.author.id}`).toLowerCase() != "dreamcatcher") {
                    if (guy == ownself) return await message.channel.send("You cannot protect yourself.")
                    db.set(`heal_${message.channel.id}`, args[0])
                    message.react("475775251297337344")
                } else {
                    db.set(`heal_${chan.id}`, args[0])
                    message.react("475775251297337344")
                    message.channel.send(`You have forced **${tempguy.nickname} ${tempguy.user.username}** to protect **${guy.nickname} ${guy.user.username}**`)
                }
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
                    if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id) || !tempguy.roles.cache.has(alive.id)) return await message.reply("You can play with alive people only!")
                    if (db.get(`role_${message.author.id}`) != "Dreamcatcher") {
                        if (guy == ownself) return await message.channel.send("You cannot protect yourself.")
                        db.set(`potion_${message.channel.id}`, args[0])
                        message.react("596733389084819476")
                    } else {
                        db.set(`potion_${chan.id}`, args[0])
                        message.react("596733389084819476")
                        message.channel.send(`You have forced **${tempguy.nickname} ${tempguy.user.username}** to protect **${guy.nickname} ${guy.user.username}**`)
                    }
                }
            }
        } else if (message.channel.name == "priv-bodyguard") {
            if (db.get(`role_${message.author.id}`) != 'Dreamcatcher') {
            let lives = await db.fetch(`lives_${message.channel.id}`)
                if (lives == null) {
                    db.set(`lives_${message.channel.id}`, 2)
                    lives = await db.fetch(`lives_${message.channel.id}`)
                }
            } else {
            let lives = await db.fetch(`lives_${chan.id}`)
                if (lives == null) {
                    db.set(`lives_${chan.id}`, 2)
                    lives = await db.fetch(`lives_${chan.id}`)
                }
           }
            //let protect = args[0]
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (!guy) return await message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has("606140092213624859") || !ownself.roles.cache.has("606140092213624859") || !tempguy.roles.cache.has(alive.id)) return await message.reply("You or your target isn't alive!")
            if (db.get(`role_${message.author.id}`) != 'Dreamcatcher') {
                if (guy == ownself) return await message.channel.send("You cannot protect yourself.")
                db.set(`guard_${message.channel.id}`, args[0])
                message.react("475775137434697728")
            } else {
                db.set(`guard_${chan.id}`, args[0])
                message.react("475775137434697728")
            }
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
