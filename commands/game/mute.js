const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "mute",
    description: "Mute a player and prevent them voting the next day.",
    usage: `${process.env.PREFIX}mute <player>`,
    aliases: ["quiet", "shush"],
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = config.fn.dcActions(message, db, alive)
        if (message.channel.name == "priv-grumpy-grandma") {
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let gamePhase = await db.fetch(`gamePhase`)
            let night = Math.floor(gamePhase / 3) + 1
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`That's funny but no.`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (parseInt(args[0]) > parseInt(alive.members.size) + parseInt(dead.members.size) || parseInt(args[0]) < 1) {
                return await message.reply("The player is not in game! Mention the correct player number.")
            } else if (args[0] === message.member.nickname) {
                return await message.reply("You can not mute yourself!")
            } else {
                if (gamePhase % 3 != 0) {
                    return await message.reply("You can use your ability only at night!")
                } else {
                    if (night == 1) {
                        return await message.reply("You can mute a player after the first night!")
                    } else {
                        db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `mute_${dc.chan.id}` : `mute_${message.channel.id}`}`, args[0])
                        message.react("475775342007549962")
                    }
                }
            }
        } else if (message.channel.name == "priv-hacker") {
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let gamePhase = await db.fetch(`gamePhase`)
            let night = Math.floor(gamePhase / 3) + 1
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (!guy) return message.reply("Invalid target!")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let hacked = await db.fetch(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `hack_${dc.chan.id}` : `hack_${message.channel.id}`}`)
            if (parseInt(args[0]) > parseInt(alive.members.size) + parseInt(dead.members.size) || parseInt(args[0]) < 1) {
                return await message.reply("Invalid target!")
            } else if (args[0] === message.member.nickname) {
                return await message.reply("You can not mute yourself!")
            } else if (gamePhase % 3 != 0) {
                return await message.reply("You can use your ability only at night!")
            } else if (night == 1) {
                return await message.reply("You can mute a player after the first night!")
            } else if (hacked == null) {
                return await message.reply("You haven't hacked anyone!")
            } else if (!hacked.includes(guy.nickname)) {
                return await message.reply("You can only mute hacked people!")
            } else if (db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `usedmute_${dc.chan.id}` : `usedmute_${message.channel.id}`}`) == true) {
                return await message.reply("You can mute only once.")
            } else {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `mute_${dc.chan.id}` : `mute_${message.channel.id}`}`, args[0])
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `usedmute_${dc.chan.id}` : `usedmute_${message.channel.id}`}`, true)
                message.react("776460712008351776")
            }
        }
    },
}
