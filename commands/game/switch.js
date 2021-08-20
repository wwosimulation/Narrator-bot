const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "switch",
    description: "Mix up a few roles.",
    usage: `${process.env.PREFIX}switch <player1> <player2>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-naughty-boy") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let abil = db.get(`toy_${message.channel.id}`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (abil == "yes") return message.channel.send("You can use the ability only once!")
            if (args.length != 2) return message.channel.send("You can switch only 2 players.")
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1]) || message.guild.members.cache.find((m) => m.id === args[1]) || message.guild.members.cache.find((m) => m.user.username === args[1]) || message.guild.members.cache.find((m) => m.user.tag === args[1])

            if (!guy1 || !guy2 || guy1.nickname == message.member.nickname || guy2.nickname == message.member.nickname) message.reply("The player is not in game! Mention the correct player number.")

            if (!guy1.roles.cache.has(alive.id) || !guy2.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            message.channel.send(`${getEmoji("switch", client)} You decided to switch **${guy1.nickname} ${guy1.user.username}** and **${guy2.nickname} ${guy2.user.username}**!`)
            db.set(`switch_${message.channel.id}`, [guy1.nickname, guy2.nickname])
        }
    },
}
