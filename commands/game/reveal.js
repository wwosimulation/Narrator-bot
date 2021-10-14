const Discord = require("discord.js")
const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "reveal",
    description: "Reveal a role in the game.",
    usage: `${process.env.PREFIX}reveal [player]`,
    gameOnly: true,
    aliases: ["show"],
    run: async (message, args, client) => {
        let aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive")
        let deadRole = message.guild.roles.cache.find((r) => r.name === "Dead")
        let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
        let gamePhase = db.get(`gamePhase`)
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        if (message.channel.name == "priv-mayor") {
            let ability = await db.fetch(`ability_${message.channel.id}`)
            if (ability == "yes") return await message.channel.send("You have already used your ability!")
            if (gamePhase % 3 != 1) return await message.channel.send("You can use your ability only at night!")
            dayChat.send(`${getEmoji("mayoring", client)} **${message.member.nickname} ${message.author.username} (Mayor)** has revealed himself!`)
            message.member.roles.add(revealed.id)
            db.set(`ability_${message.channel.id}`, "yes")
        } else if (db.get(`card_${message.channel.id}`)) {
            if (!message.member.roles.cache.has(aliveRole.id)) return message.channel.send("You can not reveal when dead!")
            db.set(`card_${message.channel.id}`, false)
            message.member.roles.add(revealed.id)
            return dayChat.send(`${getEmoji("sun", client)} **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
        } else if (message.channel.name == "priv-pacifist" || message.channel.name == "priv-wolf-pacifist") {
            let ability = await db.fetch(`paci_${message.channel.id}`)
            let gamePhase = await db.fetch(`gamePhase`)
            let day = Math.floor(gamePhase / 3) + 1
            if (ability == "yes") return await message.reply("You have already used your ability!")
            let cmd = await db.fetch(`commandEnabled`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let role = await db.fetch(`role_${guy.id}`)
            let nrole = role.toLowerCase()
            let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let dchat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            if (!message.member.roles.cache.has(aliveRole.id) || !guy.roles.cache.has(aliveRole.id)) return message.channel.send("You can play with alive people only!")
            if (args[0] == "card") {
                if (db.get(`card_${message.channel.id}`) == true) {
                    if (!message.member.roles.cache.has(aliveRole.id)) return message.channel.send("You can't reveal when dead!")
                    db.set(`card_${message.channel.id}`, false)
                    message.member.roles.add(revealed.id)
                    return dayChat.send(`${getEmoji("sun", client)} **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
                }
            }
            if (gamePhase % 3 != 1) return await message.reply("You can use your ability only during the day!")
            if (day == 1) {
                if (cmd != "yes") return await message.reply("You can reveal after discussion phase of day 1!")
            }
            if (!guy || guy == message.member) return await message.reply("The player is not in game! Mention the correct player number.")
            if (role == "President") return await message.reply("You can't reveal the President!")
            if (message.channel.name == "priv-wolf-pacifist" && nrole.includes("wolf")) return await message.reply("You can not reveal your own teammate!")
            if (guy.roles.cache.has(revealed.id)) return await message.reply("That player is already revealed!")
            if (sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && role == "Sect Leader") return await message.channel.send("You can't reveal a Sect Leader when sected!")
            if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (lovers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    return message.channel.send("Hey, you cannot reveal your lover!")
                }
            }
            db.set(`paci_${message.channel.id}`, "yes")
            dchat.send(`${getEmoji("revealed", client)} The Pacifist revealed **${args[0]} ${guy.user.username} (${role})**!`)
            db.set(`pacday_${message.channel.id}`, day)
            guy.roles.add(revealed.id)
            if (message.channel.name == "priv-wolf-pacifist") message.guild.channels.cache.find((x) => x.name == "werewolves-chat").send(`${getEmoji("revealed", client)} You have revealed **${args[0]} ${guy.user.username} (${role})**!`)

            if (db.get(`card_${message.channel.id}`) == true) {
                if (message.channel.name != "priv-mayor" && message.channel.name != "priv-pacifist" && message.channel.name != "priv-wolf-pacifist") {
                    let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
                    if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't reveal when dead!")
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    message.member.roles.add(revealed.id)
                    day.send(`${getEmoji("sun", client)} **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
                    db.set(`card_${message.channel.id}`, false)
                }
            }
        }
    },
}
