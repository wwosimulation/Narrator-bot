const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "killall",
    description: "Kill everyone who is still alive.",
    usage: `${process.env.PREFIX}killall`,
    aliases: ["gameend", "alldie", "dieall", "fleeall"],
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        const alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        const dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        const players = db.get(`players`)
        const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive")
        const daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")

        if (alivePlayers.length === 0) return message.channel.send("There is no one to kill!")

        alivePlayers.forEach(async (m) => {
            let player = await message.guild.members.fetch(m)
            let roles = player.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)).filter((r) => r !== "892046207214551110")
            db.set(`player_${m}.status`, "Dead")
            await player.roles.set(roles)
            await daychat.send(`${getEmoji("died", client)}**${players.indexOf(m) + 1} ${db.get(`player_${m}`).username} (${getEmoji(db.get(`player_${m}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${m}`).role})** was killed by the narrator!`)
        })
    },
}
