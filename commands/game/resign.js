const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "resign",
    description: "Put down your seer skills and be a normal wolf.",
    usage: `${process.env.PREFIX}resign`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-wolf-seer") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = config.fn.dcActions(message, db, alive)
            let resigned = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `resigned_${dc.chan.id}` : `resigned_${message.channel.id}`}`)
            let gamePhase = db.get(`gamePhase`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (gamePhase % 3 != 0) return message.channel.send("You can use your ability only at night!")
            if (resigned == true) return message.channel.send("You have already used your ability!")
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `resigned_${dc.chan.id}` : `resigned_${message.channel.id}`}`, true)
            message.guild.channels.cache.find((c) => c.name === "werewolves-chat").send("The Wolf Seer resigned from their ability! They can now vote with the werewolves!")
        }
    },
}
