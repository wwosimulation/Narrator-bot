const db = require("quick.db")
const { ids } = require("../../config")
const killAll = require("./killall")
const { getEmoji } = require("../../config")

module.exports = {
    name: "kill",
    description: "Kill one or more players.",
    usage: `${process.env.PREFIX}kill <all | player...>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (!args) return message.channel.send(`Invalid format. Please use \`${process.env.PREFIX}kill <all | player...>\``)
        if (args[0] === "all") {
            return killAll.run(message, args, client)
        } else {
            args.forEach((player) => {
                let guy = message.guild.members.cache.find((m) => [m.nickname, m.id, m.user.username, m.user.tag].includes(player))
                if (guy) {
                    let target = db.get(`player_${guy.id}`)
                    let role = target.role
                    db.set(`player_${guy.id}.fled`, true)
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    day.send(`${getEmoji("died", client)} **${players.indexOf(guy.id) + 1} ${target.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** was killed by the narrator!`)
                    guy.roles.add(ids.dead)
                    guy.roles.remove(ids.alive)
                    db.set(`player_${guy}.status`, "Dead")
                    client.emit("playerKilled", db.get(`player_${guy.id}`), "NARRATOR")
                }
            })
        }
    },
}
