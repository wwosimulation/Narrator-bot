const db = require("quick.db")
const { ids } = require("../../config")
const revAll = require("./revall")
const { getEmoji } = require("../../config")

module.exports = {
    name: "summon",
    description: "Revive someone from the dead.",
    aliases: ["arev", "mrev", "manualrevive", "revivemanual", "revm", "reva"],
    usage: `${process.env.PREFIX}summon <all | player...>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (!args) return message.channel.send(`Invalid format. Please use \`${process.env.PREFIX}summon <all | player...>\``)
        if (args[0] === "all") {
            return revAll.run(message, args, client)
        } else {
            const players = db.get(`players`)
            args.forEach((player) => {
                let guy = message.guild.members.cache.find((m) => [m.nickname, m.id, m.user.username, m.user.tag].includes(player))
                if (guy) {
                    let target = db.get(`player_${guy.id}`)
                    db.delete(`player_${guy.id}.fled`)
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    day.send(`${getEmoji("revive", client)} **${players.indexOf(guy.id) + 1} ${target.username}** was revived by the narrator!`)
                    guy.roles.add(ids.alive)
                    guy.roles.remove(ids.dead)
                    db.set(`player_${guy}.status`, "Alive")
                }
            })
        }
    },
}
