const db = require("quick.db")

module.exports = {
    name: "mark",
    description: "Mark a player and shoot them later.",
    usage: `${process.env.PREFIX}mark <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-marksman") {
            let isNight = db.get(`isNight`)
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let arrow = db.get(`arrows_${message.channel.id}`) || 2
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't mark when your dead punk.")
            if (!args[0]) return message.channel.send("You can't mark anyone if you don't tell me who to mark.")
            if (args[0] == message.member.nickname) return message.channel.send("You can't mark the yourself dumb")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("No. Marking dead users make you look stupid.")
            if (isNight != "yes") return message.channel.send("Bruh, you can only do this during the night!")
            if (db.get(`role_${guy.id}`) == "President") return message.channel.send("Killing the President just shows your stupidity")
            if (arrow < 1) return message.channel.send("You ran out of arrows nutcracker")
            message.channel.send(`<:mark:779292927737200671> You decided to mark **${guy.nickname} ${guy.user.username}**!`)
            db.set(`mark_${message.channel.id}`, guy.nickname)
            db.set(`markActive_${message.channel.id}`, false)
        }
    },
}
