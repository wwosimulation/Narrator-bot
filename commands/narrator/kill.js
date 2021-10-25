const db = require("quick.db")
const { ids } = require("../../config")
const killAll = require("./killall")

module.exports = {
    name: "kill",
    description: "Kill one or more players.",
    usage: `${process.env.PREFIX}kill <all | player...>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        if(!args) return message.channels.send(`Invalid format. Please use \`${process.env.PREFIX}kill <all | player...>\``)
        if(args[0] === "all") {
            return killAll.run(message, args ,client)
        }
        else {
            args.forEach(player => {
                let guy = message.guild.members.cache.find((m) => m.nickname === player)
                if (guy) {
                    let role = db.get(`role_${guy.id}`)
                    db.set(`suicided_${guy.id}`, true)
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    day.send("**" + guy.nickname + " " + guy.user.username + " (" + role + ")** was killed by the narrator!")
                    guy.roles.add(ids.dead)
                    guy.roles.remove(ids.alive)
                }
            });
        }
    },
}
