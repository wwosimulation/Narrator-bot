const db = require("quick.db")

module.exports = {
    name: "hack",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-hacker") {
            let isNight = db.get('isNight')
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0])
            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1])
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You are dead")
            if (isNight != "yes") return message.channel.send("You can only hack when everyone it's night")
            if (args.length < 1 || args.length > 2) return message.channel.send("You have either chosen more than 2 or 0 players.")
            let hack = []
            for (let i = 0; i < args.length; i++) {
                if (i == 0) {
                    if (!guy1 || guy1.id == message.author.id) return message.reply("Invalid Target!")
                    if (!guy1.roles.cache.has(alive.id)) return message.channel.send("You cannot hack a dead player!")
                    hack.push(guy1.nickname)
                } else {
                    if (!guy2 || guy2.id == message.author.id) return message.reply("Invalid Target!")
                    if (!guy2.roles.cache.has(alive.id)) return message.channel.send("You cannot hack a dead player!")
                    hack.push(guy2.nickname)
                }
                db.set(`hack_${message.channel.id}`, hack)
                message.react("👍")
            }
        }
    }
}