const db = require("quick.db")

module.exports = {
    name: "hypnotize",
    description: "The ability to control someone at night.",
    usage: `${process.env.PREFIX}hypnotise (cancel | <player>)`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name != "priv-dreamcatcher") return
        let gamePhase = db.get(`gamePhase`)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        if (args[0] == "cancel") {
            db.set(`hypnotize_${message.channel.id}`, null)
            return message.channel.send("Okay, your action has been canceled")
        }
        let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0]) || message.guild.members.cache.find((m) => m.id === args[0])
        if (!message.member.roles.cache.has(alive.id)) return message.chanenl.send("You cannot use the ability now!")
        if (gamePhase % 3 == 0) return message.channel.send("You can only use your ability during the day!")
        if (!guy || guy == message.member) return message.channel.send("The player is not in game! Mention the correct player number.")
        if (!guy.roles.cache.has(alive.id)) return message.channel.send("I don't think hypnotizing a dead person is effective...")
        message.channel.send(`You decided to hypnotize **${guy.nickname} ${guy.user.username}**`)
        db.set(`hypnotize_${message.channel.id}`, guy.nickname)
    },
}
