const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "scratch",
    description: "Scratcha villager to turn them into a werewolf.",
    usage: `${process.env.PREFIX}scratch <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-kitten-wolf") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
            let ability = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `kitten_${dc.chan.id}` : `kitten_${message.channel.id}`}`) || "no"
            let wwsChat = message.guild.channels.cache.find((c) => c.name == "werewolves-chat")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "We have a peaceful night. You can't convert anyone." })
            if (!args[0]) return message.channel.send("Who are you scratching? Mention the player.")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`Would this convert the kitten werewolf into a normal werewolf?`)
            if (!guy || guy == message.member) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            //if (!wwsChat.permissionsFor(guy).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY"])) return message.channel.send("HEY SMART-A WORD DID YOU KNOW YOU CAN CONVERT EVERYONE BY DOING `+suicide`? Everyone is doing that right now!")
            if (ability == "yes") return message.channel.send("You have already used your ability.")
            message.channel.send(`${getEmoji("scratch", client)} You have decided to convert **${guy.nickname} ${guy.user.username}**!`)
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `scratch_${dc.chan.id}` : `scratch_${message.channel.id}`}`, guy.nickname)
        }
    },
}
