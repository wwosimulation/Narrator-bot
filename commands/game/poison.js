const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "poison",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-witch") {
            let ability = await db.fetch(`ability_${message.channel.id}`)
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let day = await db.fetch(`isDay`)
            let night = await db.fetch(`nightCount`)
            let isNight = await db.fetch(`isNight`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0]) || message.guild.members.cache.find((m) => m.id === args[0])
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            if (!args[0]) return message.channel.send("Who are you poisoning? Mention the player.")
            if (!guy || guy == message.member) return message.reply("The player is not in game! Mention the correct player number.")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            if (isNight == "yes") {
                if (night == 1) return message.channel.send("You cannot poison someone on night 1. Figure out the roles and then play.")
            }
            if (day == "yes") return message.channel.send("You can use your ability only at night!")
            if (ability == 1) return message.channel.send("You have already used your ability.")
            if (db.get(`role_${guy.id}`) == "President") return message.channel.send("You cannot poison the President.")
            if (sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (db.get(`role_${guy.id}`) == "Sect Leader") return message.channel.send("You cannot poison a sect leader being part of the sect.")
            }
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map(x => x.id)
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                if (message.author.nickname === couple[0]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not poison your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not poison your lover!")
                }
            }
            message.guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("poison", client)} The Witch poisoned **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
            guy.roles.add(dead.id)
            guy.roles.remove(alive.id)
            db.set(`ability_${message.channel.id}`, 1)
        }
    },
}
