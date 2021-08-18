const { MessageFlags } = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "convert",
    description: "Convert a player to your team. This command applies for bandit, sect leader and zombies.",
    usage: `${process.env.PREFIX}convert <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let isNight = db.get(`isNight`)
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")

        if (message.channel.name == "priv-sect-leader") {
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You have a yarn for a brain")
            if (isNight != "yes") return message.channel.send("Secting is only available during the night smartass")
            if (!args[0]) return message.channel.send("Nice converting someone who will never exist in the universe")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (!guy || guy == message.member) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id) || !message.member.roles.cache.has(alive.id)) return message.channel.send("Bruh, you or your target is not alive!")
            db.set(`sect_${message.channel.id}`, args[0])
            message.channel.send(`<:sect_member:774556759523590154> You decided to convert **${guy.nickname} ${guy.user.username}**!`)
        } else if (message.channel.name == "priv-bandit") {
            let allbandits = message.guild.channels.cache.filter((c) => c.name.startsWith("bandits")).keyArray("id")
            for (let i = 0; i < allbandits.length; i++) {
                let chan = message.guild.channels.cache.get(allbandits[i])
                let ownself = message.guild.members.cache.find((m) => m.id === message.author.id)
                if (chan.permissionsFor(ownself).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    i = 99
                    for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                        let player = message.guild.members.cache.find((m) => m.nickname === j.toString())
                        if (player.roles.cache.has(alive.id) && player.id != ownself.id) {
                            if (chan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                return message.channel.send("You already have an Accomplice dumb...")
                            }
                        }
                    }
                }
            }
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You aren't alive! Now here's a great idea: Act like a medium or Wolf Medium as you may, and try reviving wolves...")
            if (isNight != "yes") return message.channel.send("Converting is only available during the night big brain.")
            if (!args[0]) return message.channel.send("How do you think you're gonna convert someone if you don't tell me who to convert...")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy.nickname == message.member.nickname) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("Stop trying to convert dead players already. They're dead. Leave them alone...")
            db.set(`bandit_${message.channel.id}`, guy.nickname)
            message.channel.send(`<:kidnap:744575308904267796> You decided to make player **${guy.nickname} ${guy.user.username}** into your Accomplice!`)
        } else if (message.channel.name == "priv-zombie") {
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Try to look at yourself first before you judge others...")
            if (isNight != "yes") return message.channel.send("You can only bite during the night knucklehead")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy.id == message.author.id) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("BRUH YOU CAN'T BITE DEAD PLAYERS DUMB")
            let fod = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${guy.id}`).toLowerCase().replace(" ", "-")}`).keyArray("id")
            for (let i = 0; i < fod.length; i++) {
                let tempchan = message.guild.channels.cache.get(fod[i])
                if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    if (db.get(`bitten_${tempchan.id}`) == true) return message.reply("Are you dumb or stupid? You already bit this player...")
                }
            }
            let zombies = message.guild.channels.cache.find((c) => c.name === "zombies")
            if (zombies.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                return message.channel.send("You aren't a bitten zombie!")
            }
            message.guild.channels.cache.find((c) => c.name === "zombies").send(`<:zombvote:745632486733905962> ${message.member.nickname} ${message.author.username} voted **${guy.nickname} ${guy.user.username}**!`)
            db.set(`bite_${message.channel.id}`, guy.nickname)
        }
    },
}
