const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "protest",
    description: "Save a player from being lynched at the day.",
    usage: `${process.env.PREFIX}protest <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-flower-child" || message.channel.name == "priv-guardian-wolf") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let gamePhase = await db.fetch(`gamePhase`)
            let ability = await db.fetch(`protest_${message.channel.id}`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (ability == "no") return await message.channel.send("You have already used your ability.")
            if (gamePhase % 3 == 0) return await message.channel.send("You can use your ability only during the day!")
            if (!guy) return await message.channel.send("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) return await message.channel.send("You can play with alive people only!")
            if (message.channel.name == "priv-flower-child") {
                message.channel.send(`${getEmoji("petal", client)} You are protesting for **${args[0]} ${guy.user.username}**!`)
                db.set(`flower_${message.channel.id}`, args[0])
            } else {
                message.channel.send(`${getEmoji("protest", client)} You are protesting for **${args[0]} ${guy.user.username}**!`)
                db.set(`guardian_${message.channel.id}`, args[0])
            }
        }
    },
}
