const db = require("quick.db")

module.exports = {
    name: "scratch",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-kitten-wolf") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let ability = db.get(`kitten_${message.channel.id}`) || "no"
            let wwsChat = message.guild.channels.cache.find((c) => c.name == "werewolves-chat")
            if (!args[0]) return message.channel.send("Ah yes, telling me to convert the air. Oh btw, did you know you can win the game automatically by doing `+suicide`")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("WOW GUESS WHAT! There is a Wolf Medium just waiting to revive you! Just do `CTRL` `W` and you will get revived!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy || guy == message.member) return message.reply("Inavlid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("Converting dead players is all the rage isn't it? You are really smart, A-word hole.")
            //if (!wwsChat.permissionsFor(guy).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY"])) return message.channel.send("HEY SMART-A WORD DID YOU KNOW YOU CAN CONVERT EVERYONE BY DOING `+suicide`? Everyone is doing that right now!")
            if (ability == "yes")
                return message.channel.send("Let me see if i hack that...").then((msg) => {
                    setTimeout(function () {
                        msg.edit("Auhh, it seems that don't have the unlimited conversion bug like the app moron. Now shut up dumb.")
                    }, 3000)
                })
            message.channel.send(`<:scratch:744573055220580393> You have decided to convert **${guy.nickname} ${guy.user.username}**!`)
            db.set(`scratch_${message.channel.id}`, guy.nickname)
        }
    },
}
