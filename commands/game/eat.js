const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "eat",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-cannibal") {
            // getting all the variables
            let isNight = db.get(`isNight`)
            let hunger = db.get(`hunger_${message.channel.id}`) || 1
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send(`You are dead. You cannot use the command now!`)
            if (!args[0]) return message.channel.send("Who you are going to eat? Mention the player.")
            if (hunger < args.length) return message.channel.send("You cannot eat more than your hunger!")
            if (isNight != "yes") return message.channel.send("You cannot eat players during the day!")

            for (let i = 0; i < args.length; i++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[i]) || message.guild.members.cache.find((m) => m.id === args[i]) || message.guild.members.cache.find((m) => m.user.username === args[i])
                message.guild.members.cache.find((m) => m.user.tag === args[i])
                if (!guy) return message.channel.send(`Player **${args[0]}** could not be found!`)
                if (!guy.roles.cache.has(alive.id)) return message.channel.send(`Player **${guy.nickname} ${guy.user.username}** is dead!`)
                if (guy == message.member) return message.channel.send(`Eating yourself isn't just gonna work!`)
                let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
                let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
                for (let x = 0; x < cupid.length; x++) {
                    let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                    if (message.author.nickname === couple[0]) {
                        if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not eat your lover!")
                    }
                    if (message.author.nickname === couple[1]) {
                        if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not eat your lover!")
                    }
                }
            }

            let lol = []
            for (let j = 0; j < args.length; j++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[j]) || message.guild.members.cache.find((m) => m.id === args[j]) || message.guild.members.cache.find((m) => m.user.username === args[j])
                message.guild.members.cache.find((m) => m.user.tag === args[j])
                lol.push(guy.nickname)
            }
            db.set(`eat_${message.channel.id}`, lol)
            for (let j = 0; j < args.length; j++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[j]) || message.guild.members.cache.find((m) => m.id === args[j]) || message.guild.members.cache.find((m) => m.user.username === args[j])
                message.guild.members.cache.find((m) => m.user.tag === args[j])
                message.channel.send(`${getEmoji("eat", client)} You decided to eat **${guy.nickname} ${guy.user.username}**!`)
            }
        }
    },
}
