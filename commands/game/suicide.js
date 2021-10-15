const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "suicide",
    description: "Kill yourself... In game! NOT IN REAL LIFE!",
    usage: `${process.env.PREFIX}suicide [player]`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.member.permissions.has("MANAGE_CHANNELS")) {
            if (args[0]) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (guy) {
                    let role = db.get(`role_${guy.id}`)
                    db.set(`suicided_${guy.id}`, true)
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    day.send("**" + guy.nickname + " " + guy.user.username + " (" + role + ")** has commited suicide!")
                    guy.roles.add(ids.dead)
                    guy.roles.remove(ids.alive)
                }
            }
        } else if (message.channel.name.includes("priv") || message.channel.name == "day-chat") {
            if (!message.member.roles.cache.has(ids.alive)) return
            db.set(`suicided_${message.author.id}`, true)
            let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let role = await db.fetch(`role_${message.author.id}`)
            day.send("**" + message.member.nickname + " " + message.author.username + " (" + role + ")** has commited suicide!")
            message.member.roles.add(ids.dead)
            message.member.roles.remove(ids.alive)
        }
    },
}
