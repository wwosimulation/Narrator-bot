const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "revall",
    description: "Revive all players.",
    usage: `${process.env.PREFIX}revall`,
    aliases: ["reviveall", "wolfmed", "allrev"],
    narratorOnly: true,
    gameOnly: true,
    run: async (message, args, client) => {

        const alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        const dead = message.guild.roles.cache.find((r) => r.name === "Dead")
	const players = db.get(`players`)
	const deadPlayers = players.filter((p) => db.get(`player_${p}`).status === "Dead")
        const daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")

        if (deadPlayers.length === 0) return message.channel.send("There is no one to revive!")

        deadPlayers.forEach(async (m) => {
	    let player = await message.guild.members.fetch(m)
            let roles = player.roles.cache.map(r => r.name === "Dead" ? "892046206698680390" : r.id).filter(r => r !== "892046207214551110")
	    db.set(`player_${m}.status`, "Alive")
	    db.delete(`player_${m}.corrupted`)
	    await player.roles.set(roles)
            await daychat.send(`${getEmoji("revive", client)}**${players.indexOf(m)+1} ${db.get(`player_${m}`).username} (${getEmoji(db.get(`player_${m}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${m}`).role})** was revived by the narrator!`)
        })
    },
}
