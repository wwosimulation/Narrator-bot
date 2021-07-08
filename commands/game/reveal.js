const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "reveal",
    gameOnly: true,
    aliases: ["show"],
    run: async (message, args, client) => {
        let aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive")
        let deadRole = message.guild.roles.cache.find((r) => r.name === "Dead")
        let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
        let isDay = db.get(`isDay`)
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        if (message.channel.name == "priv-mayor") {
            let ability = await db.fetch(`ability_${message.channel.id}`)
            if (ability == "yes") return await message.channel.send("You already used up your ability!")
            if (isDay != "yes") return await message.channel.send("Dummy, you didn't get the Fortune Teller's card. You can only reveal during the day :rage:")
            dayChat.send(`<:mayoring:744571394947416128> **${message.member.nickname} ${message.author.username} (Mayor)** has revealed himself!`)
            message.member.roles.add(revealed.id)
            db.set(`ability_${message.channel.id}`, "yes")
        } else if (db.get(`card_${message.channel.id}`)) {
            if (!message.member.roles.cache.has(aliveRole.id)) return message.channel.send("You can't reveal when dead!")
            db.set(`card_${message.channel.id}`, false)
            message.member.roles.add(revealed.id)
            return dayChat.send(`<:sun:744571092601012255> **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
        } else if (message.channel.name == "priv-pacifist" || message.channel.name == "priv-wolf-pacifist") {
            let ability = await db.fetch(`paci_${message.channel.id}`)
            let isday = await db.fetch(`isDay`)
            let day = await db.fetch(`dayCount`)
            if (ability == "yes") return await message.reply("You already used up all your abilities!")
            let cmd = await db.fetch(`commandEnabled`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let role = await db.fetch(`role_${guy.id}`)
            let nrole = role.toLowerCase()
            let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let dchat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            if (!message.member.roles.cache.has(aliveRole.id) || !guy.roles.cache.has(aliveRole.id)) return message.channel.send("Revealing when dead or revealing a dead player is just not possible.")
            if (args[0] == "card") {
                if (db.get(`card_${message.channel.id}`) == true) {
                    if (!message.member.roles.cache.has(aliveRole.id)) return message.channel.send("You can't reveal when dead!")
                    db.set(`card_${message.channel.id}`, false)
                    message.member.roles.add(revealed.id)
                    return dayChat.send(`<:sun:744571092601012255> **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
                }
            }
            if (isday != "yes") return await message.reply("You can only use this ability during the day!")
            if (day == 1) {
                if (cmd != "yes") return await message.reply("You can only use this ability when voting starts on day 1!")
            }
            if (!guy || guy == message.member) return await message.reply("Invalid Target")
            if (role == "President") return await message.reply("You can't reveal the President!")
            if (message.channel.name == "priv-wolf-pacifist" && nrole.includes("wolf")) return await message.reply("You can't reveal your own teammate!")
            if (guy.roles.cache.has(revealed.id)) return await message.reply("You can't reveal a revealed player!")
            if (sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && role == "Sect Leader") return await message.channel.send("You can't reveal a Sect Leader when sected!")
            if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (lovers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    return message.channel.send("Yes, Gamethrowing. Revealing your lover never has been, is and will never be allowed.")
                }
            }
            db.set(`paci_${message.channel.id}`, "yes")
            dchat.send(`<:revealed:744572010801266793> The Pacifist revealed **${args[0]} ${guy.user.username} (${role})**!`)
            guy.roles.add(revealed.id)
            if (message.channel.name == "priv-wolf-pacifist") message.guild.channels.cache.get("606135720825847829").send(`<:revealed:744572010801266793> The Wolf Pacifist revealed **${args[0]} ${guy.user.username} (${role})**!`)

            if (db.get(`card_${message.channel.id}`) == true) {
                if (message.channel.name != "priv-mayor" && message.channel.name != "priv-pacifist" && message.channel.name != "priv-wolf-pacifist") {
                    let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
                    if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't reveal when dead!")
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    message.member.roles.add(revealed.id)
                    day.send(`<:sun:744571092601012255> **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
                    db.set(`card_${message.channel.id}`, false)
                }
            }
        }
    },
}
