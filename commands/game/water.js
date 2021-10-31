const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "water",
    description: "Throw the holy water on the wolfs! They need to DIE!",
    usage: `${process.env.PREFIX}water <player>`,
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
            let dayCount = Math.floor(db.get(`gamePhase`) / 3) + 1
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            if (!guy || guy == ownself) {
                return await message.reply("The player is not in game! Mention the correct player number.")
            } else {
                if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) {
                    return await message.reply("You can play with alive people only!")
                } else {
                    if (priest != null) {
                        return await message.reply("You have already used your ability!")
                    } else {
                        let role = await db.fetch(`role_${guy.id}`)
                        let toKill = role.toLowerCase()
                        if (isDay != "yes") return message.channel.send("You can use your ability only during the day!")
                        if (dayCount == 1) {
                            let cmd = await db.fetch(`commandEnabled`)
                            if (cmd != "yes") return await message.reply("You can not water before the first voting phase of the game.")
                        } else {
                            let sectMembers = message.guild.channels.cache.find((c) => c.name === "sect-members")
                            if (sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && db.get(`role_${guy.id}`) === "Sect Leader") return message.channel.send("You can not water the Sect Leader being part of the sect!")
                            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
                            for (let x = 0; x < cupid.length; x++) {
                                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                                if (message.author.nickname === couple[0]) {
                                    if (!sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not splash your lover!")
                                }
                                if (message.author.nickname === couple[1]) {
                                    if (!sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not shoot your lover!")
                                }
                            }
                        }
                        db.set(`priest_${message.channel.id}`, 1)
                        if (toKill.includes("wolf")) {
                            guy.roles.remove(alive.id)
                            guy.roles.add(dead.id)
                            dayChat.send(`${getEmoji("water", client)} **${message.member.nickname} ${message.author.username} (Priest)** has thrown holy water at and killed **${args[0]} ${guy.user.username} (${role})**`)
                            ownself.roles.add(revealed.id)
                        } else {
                            ownself.roles.remove(alive.id)
                            ownself.roles.add(dead.id)
                            dayChat.send(`${getEmoji("water", client)} **${message.member.nickname} ${message.author.username} (Priest)** tried to throw holy water on **${args[0]} ${guy.user.username}** and killed themselves! **${args[0]} ${guy.user.username}** is not a werewolf!`)
                        }
                    }
                }
            }
        }
    },
}
