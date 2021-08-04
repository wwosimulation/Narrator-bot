const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "scratch",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-kitten-wolf") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let ability = db.get(`kitten_${message.channel.id}`) || "no"
            let wwsChat = message.guild.channels.cache.find((c) => c.name == "werewolves-chat")
            if (!args[0]) return message.channel.send("Who are you scratching? Mention the player.")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy == message.member) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            //if (!wwsChat.permissionsFor(guy).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY"])) return message.channel.send("HEY SMART-A WORD DID YOU KNOW YOU CAN CONVERT EVERYONE BY DOING `+suicide`? Everyone is doing that right now!")
            if (ability == "yes")
                return message.channel.send("You have already used your ability.")
            message.channel.send(`${getEmoji("scratch", client)} You have decided to convert **${guy.nickname} ${guy.user.username}**!`)
            db.set(`scratch_${message.channel.id}`, guy.nickname)
        }
    },
}
