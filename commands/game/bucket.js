const db = require("quick.db")

module.exports = {
    name: "bucket",
    description: "Send your bucket to a player to ask for candy.",
    usage: `${process.env.PREFIX}bucket <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-pumpkin-king") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
            if (db.get(`pk_${message.channel.id}`)?.length > 0) return message.channel.send("You already sent your bucket!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            db.set(`pk_${message.channel.id}`, [message.author.id])
            // send dropdown to player
        }
    },
}
