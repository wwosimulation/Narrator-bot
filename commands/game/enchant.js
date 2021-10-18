const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "enchant",
    description: "Enchant/Disguise a player so that it appears like this player has your role when a seer checks them.",
    usage: `${process.env.PREFIX}enchant <player>`,
    aliases: ["shaman", "disguise", "delude"],
    gameOnly: true,
    run: async (message, args, client) => {
        let dc
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let gamePhase = db.get(`gamePhase`)
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        if (message.channel.name == "priv-wolf-shaman") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Yea, that's funny. disguising a wolf shaman as a wolf shaman!`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (!args[0]) return message.channel.send("Who are you enchanting? Mention the player.")
            let role = await db.fetch(`role_${guy.id}`)
            let toShaman = role.toLowerCase()
            if (gamePhase % 3 != 1) return message.channel.send("You can enchant only during the day.")
            if (!guy || guy == ownself) {
                return await message.reply("The player is not in game! Mention the correct player number.")
            } else {
                if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
                    return await message.reply(`You can play with alive people only!`)
                } else {
                    if (toShaman.includes("wolf")) {
                        return await message.reply("You can't use your abilities on other werewolves!")
                    } else {
                        db.set(`shaman_${message.channel.id}`, args[0])
                        message.react("475776068431904769").catch(() => {})
                    }
                }
            }
        } else if (message.channel.name == "priv-illusionist") {
            let disguised = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `disguised_${dc.chan.id}` : `disguised_${message.channel.id}`}`) || []
            if (gamePhase % 3 != 0) return message.channel.send("You can enchant only during the night.")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't disguise anyone." })
            if (!args[0]) return message.channel.send("Who are you enchanting? Mention the player.")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Although this would be a great strategy I will have to stop you.`)
            if (!guy || guy == message.member) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            if (disguised.length > 0) {
                if (disguised.includes(guy.nickname)) return message.channel.send("You have already disguised this player.")
            }
            message.channel.send(`${getEmoji("delude", client)} You decided to disguise **${guy.nickname} ${guy.user.username}**!`)
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `toDisguise_${dc.chan.id}` : `toDisguise_${message.channel.id}`}`, guy.nickname)
        }
    },
}
