const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "convert",
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let isNight = db.get(`isNight`)
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")

        if (message.channel.name == "priv-sect-leader") {
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Honey you cannot convert being dead.")
            if (isNight != "yes") return message.channel.send("You can convert players during the night only.")
            if (!args[0]) return message.channel.send("Who you want to check? Insert the player number next time.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (!guy || guy == message.member) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("The player is dead, you cannot convert the deads!")
            db.set(`sect_${message.channel.id}`, args[0])
            message.channel.send(`${getEmoji("sect_member", client)} You decided to convert **${guy.nickname} ${guy.user.username}**!`)
        } else if (message.channel.name == "priv-bandit") {
            let allbandits = message.guild.channels.cache.filter((c) => c.name.startsWith("bandits")).map((x) => x.id)
            for (let i = 0; i < allbandits.length; i++) {
                let chan = message.guild.channels.cache.get(allbandits[i])
                let ownself = message.guild.members.cache.find((m) => m.id === message.author.id)
                if (chan.permissionsFor(ownself).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    i = 99
                    for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                        let player = message.guild.members.cache.find((m) => m.nickname === j.toString())
                        if (player.roles.cache.has(alive.id) && player.id != ownself.id) {
                            if (chan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                return message.channel.send("Hey you already got an Accomplice!")
                            }
                        }
                    }
                }
            }
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You are dead! Now here's a great idea, Act like a medium or Wolf Medium, and try reviving wolves...")
            if (isNight != "yes") return message.channel.send("It's day! You can convert during nights only!")
            if (!args[0]) return message.channel.send("Who you want to convert? Insert the player number next time.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy.nickname == message.member.nickname) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("The player is dead, you cannot convert the deads!")
            db.set(`bandit_${message.channel.id}`, guy.nickname)
            message.channel.send(`${getEmoji("kidnap", client)} You decided to make player **${guy.nickname} ${guy.user.username}** into your Accomplice!`)
        } else if (message.channel.name == "priv-zombie") {
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Honey you cannot bite being dead.")
            if (isNight != "yes") return message.channel.send("It's day! You can convert during nights only!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy.id == message.author.id) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("The player is dead, you cannot bite the deads!")

            // code to check if a player is bitten
            let fod = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${guy.id}`).toLowerCase().replace(" ", "-")}`).map((x) => x.id)
            for (let i = 0; i < fod.length; i++) {
                let tempchan = message.guild.channels.cache.get([i])
                if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    if (db.get(`bitten_${tempchan.id}`) == true) return message.reply("Hey, the player is already bitten!")
                }
            }
            // why this
            let zombies = message.guild.channels.cache.find((c) => c.name === "zombies")
            if (zombies.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                return message.channel.send("This zombie is getting converted!")
            } //till here
            message.guild.channels.cache.find((c) => c.name === "zombies").send(`${getEmoji("zombvote", client)} ${message.member.nickname} ${message.author.username} voted **${guy.nickname} ${guy.user.username}**!`)
            db.set(`bite_${message.channel.id}`, guy.nickname)
        }
    },
}
