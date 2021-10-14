const db = require("quick.db")

module.exports = {
    name: "couple",
    description: "Shoot your two love arrows to couple two players.",
    usage: `${process.env.PREFIX}couple <player1> <player2>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-cupid") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let gamePhase = db.get(`gamePhase`)
            let nightCount = Math.floor(gamePhase / 3) + 1 || 1
            let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
            if (nightCount != 1 || gamePhase % 3 != 0 || !message.member.roles.cache.has(alive.id)) return message.channel.send("You already used your ability!")

            for (let a = 1; a <= 16; a++) {
                let guy = message.guild.members.cache.find((c) => c.name === a.toString())
                if (guy) {
                    if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "SEND_MESSAGES"])) return message.channel.send("You already used your ability!")
                }
            }

            if (args.length != 2) return message.channel.send("You can only couple 2 players.")
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1]) || message.guild.members.cache.find((m) => m.id === args[1]) || message.guild.members.cache.find((m) => m.user.username === args[1]) || message.guild.members.cache.find((m) => m.user.tag === args[1])

            if (!guy1 || !guy2 || guy1.nickname == message.member.nickname || guy2.nickname == message.member.nickname) return message.reply("Invalid Target!")

            if (!guy1.roles.cache.has(alive.id) || !guy2.roles.cache.has(alive.id)) return message.channel.send("You cannot couple dead players.")

            if (db.get(`role_${guy1.id}`) == "President" || db.get(`role_${guy2.id}`) == "President") return message.channel.send("A President cannot be coupled.")

            db.set(`couple_${message.channel.id}`, [guy1.nickname, guy2.nickname])
            message.channel.send(`You decided to make player **${guy1.nickname} ${guy1.user.username}** and **${guy2.nickname} ${guy2.user.username}** fall in love!`)
        }
    },
}
