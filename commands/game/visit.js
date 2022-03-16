const db = require("quick.db")
const { fn } = require("../../config")

module.exports = {
    name: "visit",
    description: "Sleep at someone else's house.",
    usage: `${process.env.PREFIX}visit <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-red-lady") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            let gamePhase = await db.fetch(`gamePhase`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (fn.peaceCheck(message, db) === true && isNight == "yes") return message.channel.send({ content: "We have a peaceful night. You decided to stay at home today." })
            if (!args[0]) return message.channel.send("Who are you visiting? Mention the player.")

            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((m) => m.user.username === args.join(" ")) || message.guild.members.cache.find((m) => m.user.tag === args.join(" "))
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`This just makes the red lady look weird.`)

            if (gamePhase % 3 != 0) return message.channel.send("You can use your ability only at night!")

            if (!guy || guy.id == message.author.id) return message.reply("The player is not in game! Mention the correct player number.")

            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")

            message.react("744571914034479126")
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `visit_${dc.chan.id}` : `visit_${message.channel.id}`}`, guy.nickname)
        }
    },
}
