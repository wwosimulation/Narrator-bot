const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "corrupt",
    description: "Glitch a plyaer so they can't talk and vote the next day. At the beginning of the next night your pray will die!",
    usage: `${process.env.PREFIX}corrupt <player>`,
    gameOnly: true,
    aliases: ["glitch"],
    run: async (message, args, client) => {
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        if (args[0] == "cancel") {
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `corrupt_${dc.chan.id}` : `corrupt_${message.channel.id}`}`, null)
            return message.channel.send("Okay, your action has been canceled")
        }
        if (message.channel.name == "priv-corruptor") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot corrupt someone being dead!")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't corrupt anyone." })
            if (!args[0]) return message.channel.send("Who are you glitching? Mention the player.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Yea, this is probably not a good idea...`)

            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            else if (guy == message.member) {
                return message.channel.send("You cannot glitch yourself.")
            }
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("That player is dead!")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                if (message.author.nickname === couple[0]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not corrupt your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not corrupt your lover!")
                }
            }
            message.channel.send(`${getEmoji("corrupt", client)} You have decided to corrupt **${guy.nickname} ${guy.user.username}**!`)
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `corrupt_${dc.chan.id}` : `corrupt_${message.channel.id}`}`, guy.nickname)
        }
    },
}
