const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "douse",
    aliases: ["oil"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name != "priv-arsonist") return
        let doused = await db.fetch(`doused_${message.channel.id}`)
        let isNight = await db.fetch(`isNight`)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let ignited = db.get(`ignitedAt_${message.channel.id}`) || "-1"
        if (doused == null) {
            doused = []
        }
        if (isNight != "yes") {
            return await message.channel.send("You can douse only in night!")
        }
        if (ignited == db.get(`nightCount`)) return message.channel.send("You just ignited the players!")
        if (args.length == 0) {
            return await message.channel.send("Mention the players to douse with!")
        } else {
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (args.length == 2) {
                let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1])
                if (!guy1 || !guy2 || guy1 == guy2 || guy1 == ownself || guy2 == ownself) {
                    return await message.channel.send("The player is not in game! Mention the correct player number.")
                }
                if (!guy1.roles.cache.has(alive.id) || !guy2.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
                    return await message.channel.send("You can play with alive people only!")
                }
                for (let hhh = 1; hhh < doused.length; hhh++) {
                    if (doused[hhh] == args[0] || doused[hhh] == args[1]) {
                        return await message.channel.send("You have already doused that player!")
                    }
                }
                db.delete(`toDouse_${message.channel.id}`)

                db.set(`toDouse_${message.channel.id}`, [args[0], args[1]])
                console.log(db.get(`toDouse_${message.channel.id}`))
                message.channel.send(`${getEmoji("douse", client)} Doused **${args[0]} ${guy1.user.username} & ${args[1]} ${guy2.user.username}**!`)
                db.set(`dousedAt_${message.channel.id}`, db.get(`nightCount_${message.author.id}`))
            } else if (args.length == 1) {
                if (!guy1 || guy1 == ownself) {
                    return await message.channel.send("The player is not in game! Mention the correct player number.")
                }
                if (!guy1.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
                    return await message.channel.send("You can play with alive people only!")
                }
                for (let hhh = 1; hhh < doused.length; hhh++) {
                    if (doused[hhh] == args[0]) {
                        return await message.channel.send("You have already doused that player!")
                    }
                }
                db.delete(`toDouse_${message.channel.id}`)
                db.set(`toDouse_${message.channel.id}`, [args[0]])
                message.channel.send(`${getEmoji("douse", client)} Doused **${args[0]} ${guy1.user.username}**!`)
                db.set(`dousedAt_${message.channel.id}`, db.get(`nightCount_${message.author.id}`))
            } else {
                return await message.channel.send("You cannot douse more than 2 players at a time!")
            }
        }
    },
}
