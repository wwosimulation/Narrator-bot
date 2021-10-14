const db = require("quick.db")
const config = require("../../config")
/*
01 02 03 04
05 06 07 08
09 10 11 12
13 14 15 16
*/

module.exports = {
    name: "bomb",
    description: "Place your bombs as arsonist.",
    usage: `${process.env.PREFIX}bomb <player> <player> <player>`,
    aliases: ["explode"],
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-bomber") {
            let dc
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = config.fn.dcActions(message, db, alive)
            let didCmd = await db.fetch(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `didCmd_${dc.chan.id}` : `didCmd_${message.channel.id}`}`)
            let gamePhase = await db.fetch(`gamePhase`)
            let night = Math.floor(gamePhase / 3) + 1
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0])
            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1])
            let guy3 = message.guild.members.cache.find((m) => m.nickname === args[2])
            if (gamePhase % 3 != 0) return await message.channel.send("Placing bombs in broad day light is good. You should do it often!")
            if (config.fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't place any bombs." })
            if (!args.length == 3) return await message.channel.send("I know you wanna be the arso but you're not. Select 3 players to place the bomb at.") // change with fix
            if (!guy1 || !guy2 || !guy3) return await message.channel.send("Invalid Target!")
            if ((!guy1.roles.cache.has(alive.id) && !guy2.roles.cache.has(alive.id) && !guy3.roles.cache.has(alive.id)) || !ownself.roles.cache.has(alive.id)) return await message.channel.send("Listen, placing bombs aren't possible when dead or to dead players. Now be a lamb and SHUT UP. ")

            if (night == didCmd + 1 && night != 1) return await message.channel.send("Your bomb will explode soon!")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                if (message.author.nickname === couple[0]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && (guy1.nickname === couple[1] || guy2.nickname === couple[1] || guy3.nickname === couple[1])) return message.channel.send("You can not bomb your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && (guy1.nickname === couple[0] || guy2.nickname === couple[0] || guy3.nickname === couple[0])) return message.channel.send("You can not bomb your lover!")
                }
            }

            let bombs = [args[0], args[1], args[2]]
            let bombPlacements = `${args[0]} ${args[1]} ${args[2]}`
            console.log(bombPlacements)
            console.log(bombs)

            if (config.bombPlacements.includes(bombPlacements)) {
                message.channel.send(`${config.fn.getEmoji("explode", client)} Placed bombs on **${guy1.user.username}**, **${guy2.user.username}** and **${guy3.user.username}**!`)

                if (bombs.includes(message.member.nickname)) {
                    bombs.splice(bombs.indexOf(message.author.id), 1)
                }
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `bombs_${dc.chan.id}` : `bombs_${message.channel.id}`}`, bombs)
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `didCmd_${dc.chan.id}` : `didCmd_${message.channel.id}`}`, night)
                console.log(db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `bomb_${dc.chan.id}` : `bomb_${message.channel.id}`}`))
            } else {
                return await message.channel.send("Honey, you can only place bombs vertically, horizontally or diagonally. Make sure they are in order. \n\n+bomb 7 6 5 - :x:\n+bomb 5 6 7 - :white_check_mark:")
            }
        }
    },
}
