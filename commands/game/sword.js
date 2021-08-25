const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "sword",
    description: "Use the sword to kill a player once.",
    usage: `${process.env.PREFIX}sword <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let sword = db.get(`${db.get(`sword_${message.channel.id}`)}`)
        if (sword == true) {
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "The Prognosticator activated their power last night. You can't kill anyone." })
            if (args.length == 0) return message.channel.send("Who are you giving the sword? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy == message.member) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            message.guild.channels.cache.finf((c) => c.name === "day-chat").send(`${getEmoji("getsword", client)} The Forger's sword was used to kill **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**.`)
            guy.roles.add(dead.id)
            guy.roles.remove(alive.id)
            db.delete(`${db.get(`sword_${message.channel.id}`)}`)
        }
    },
}
