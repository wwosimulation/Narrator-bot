const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "douse",
    description: "Douse players to ignite them later in the game.",
    usage: `${process.env.PREFIX}douse <player> [player]`,
    aliases: ["oil"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name != "priv-arsonist") return
        let doused = await db.fetch(`doused_${message.channel.id}`)
        let dc
        let gamePhase = await db.fetch(`gamePhase`)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let ignited = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `ignitedAt_${dc.chan.id}` : `ignitedAt_${message.channel.id}`}`) || "-1"
        if (doused == null) {
            doused = []
        }
        if (gamePhase % 3 != 0) {
            return await message.channel.send("You can douse only in night!")
        }
        if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't douse anyone." })
        if (ignited == Math.floor(gamePhase / 3) + 1) return message.channel.send("You just ignited the players!")
        if (args.length == 0) {
            return await message.channel.send("Mention the players to douse with!")
        } else {
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (args.length == 2) {
                let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1])
                if (typeof dc !== "undefined" && (guy1.nickname == db.get(`hypnotized_${dc.tempchan}`) || guy2.nickname == db.get(`hypnotized_${dc.tempcham}`))) return message.channel.send(`Yea, this is probably not a good idea...`)
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
                db.delete(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toDouse_${dc.chan.id}` : `toDouse_${message.channel.id}`}`)

                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toDouse_${dc.chan.id}` : `toDouse_${message.channel.id}`}`, [args[0], args[1]])
                console.log(db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toDouse_${dc.chan.id}` : `toDouse_${message.channel.id}`}`))
                message.channel.send(`${getEmoji("douse", client)} Doused **${args[0]} ${guy1.user.username} & ${args[1]} ${guy2.user.username}**!`)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `dousedAt_${dc.chan.id}` : `dousedAt_${message.channel.id}`}`, db.get(`nightCount_${message.author.id}`))
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
                db.delete(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toDouse_${dc.chan.id}` : `toDouse_${message.channel.id}`}`)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toDouse_${dc.chan.id}` : `toDouse_${message.channel.id}`}`, [args[0]])
                message.channel.send(`${getEmoji("douse", client)} Doused **${args[0]} ${guy1.user.username}**!`)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `dousedAt_${dc.chan.id}` : `dousedAt_${message.channel.id}`}`, db.get(`nightCount_${message.author.id}`))
            } else {
                return await message.channel.send("You cannot douse more than 2 players at a time!")
            }
        }
    },
}
