const db = require("quick.db")

module.exports = {
    name: "jail",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name != "priv-jailer") return
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let isNight = db.get(`isNight`)
        if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
        if (!args[0]) return message.channel.send("Who are you jailing? Mention the player.")
        let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0]) || message.guild.members.cache.find((m) => m.id === args[0])
        if (isNight == "yes") return message.channel.send("You can use your ability only during the day!")
        if (!guy || message.member == guy) return message.reply("Invalid Target")
        db.set(`jail_${message.channel.id}`, guy.nickname)
        message.channel.send("You have decided to jail **" + guy.nickname + " " + guy.user.username + "**!")
    },
}
