const db = require("quick.db")

module.exports = {
    name: "jail",
    description: "Jail a player and question them during the night.",
    usage: `${process.env.PREFIX}jail <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name != "priv-jailer") return
        if (args[0] == "cancel") {
            db.set(`jail_${message.channel.id}`, null)
            return message.channel.send("Okay, your action has been canceled")
        }
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let gamePhase = db.get(`gamePhase`)
        if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
        if (!args[0]) return message.channel.send("Who are you jailing? Mention the player.")
        let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0]) || message.guild.members.cache.find((m) => m.id === args[0])
        if (gamePhase % 3 == 0) return message.channel.send("You can use your ability only during the day!")
        if (!guy || message.member == guy) return message.reply("Invalid Target")
        db.set(`jail_${message.channel.id}`, guy.nickname)
        message.channel.send("You have decided to jail **" + guy.nickname + " " + guy.user.username + "**!")
    },
}
