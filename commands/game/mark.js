const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "mark",
    description: "Mark a player and shoot them later.",
    usage: `${process.env.PREFIX}mark <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-marksman") {
            let gamePhase = db.get(`gamePhase`)
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            let arrow = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `arrows_${dc.chan.id}` : `arrows_${message.channel.id}`}`) || 2
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            if (!args[0]) return message.channel.send("Who are you marking? Mention the player.")
            if (args[0] == message.member.nickname) return message.channel.send("You cannot mark yourself.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Hmmm, I wonder how the marksman will shoot themselves.`)
            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            if (gamePhase % 3 != 0) return message.channel.send("Bruh, you can only do this during the night!")
            if (db.get(`role_${guy.id}`) == "President") return message.channel.send("You can not mark the president.")
            if (arrow < 1) return message.channel.send("You donot have any arrows left.")
            message.channel.send(`${getEmoji("mark", client)} You decided to mark **${guy.nickname} ${guy.user.username}**!`)
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `mark_${dc.chan.id}` : `mark_${message.channel.id}`}`, guy.nickname)
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `markActive_${dc.chan.id}` : `markActive_${message.channel.id}`}`, false)
        }
    },
}
