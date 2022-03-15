const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "arsoburn",
    description: "Kill someone for the arsonist.",
    usage: `${process.env.PREFIX}arsoburn <player>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        for (let i = 0; i < args.length; i++) {
            let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[i])
            let role = await db.fetch(`role_${guy.id}`)
            day.send(`The Arsonist ignites **${args[i]} ${guy.user.username} (${role})**!`)
            guy.roles.remove(alive.id)
            guy.roles.add(dead.id)
        }
    },
}
