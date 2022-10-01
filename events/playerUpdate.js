const db = require("quick.db")
const { getEmoji, getRole } = require("../config")

function getPhase() {
    const gamePhase = db.get(`gamePhase`)
    const voting = db.get(`commandEnabled`)
    let time = gamePhase % 3 === 0 ? "night" : voting === true ? "voting" : "day"
    let date = Math.floor(gamePhase / 3) + 1
    return { during: time, on: date, raw: gamePhase }
}

module.exports = async (client) => {
    client.on("playerUpdate", async (guy) => {
        const guild = client.guilds.cache.get("890234659965898813")
        const players = db.get(`players`) || []
        let player = db.get(`player_${guy.id}`)

        let r = db.get(`game`).revealedPlayers | []
        if (r.includes(guy.id)) r.splice(r.indexOf(player.id), 1)
        db.set(`game.revealedPlayers`, r)

        if (player.team === "Werewolf" && player.role !== "Werewolf Fan") {
            if (player.map((a) => db.get(`player_${a}`)).filter((a) => a.status === "Alive" && a.role === "Sorcerer").length > 0) {
                player
                    .map((a) => db.get(`player_${a}`))
                    .filter((a) => a.status === "Alive" && a.role === "Sorcerer")
                    .forEach(async (n) => {
                        let channel = guild.channels.cache.get(n.channel)
                        await channel.send(`${getEmoji("werewolf", client)} Player **${players.indexOf(player.id) + 1} ${player.username}** has been turned into a ${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role}!`)
                    })
            }
        }

        if (player.cupid) {
            if (player.cupid.length > 0) {
                player.cupid.forEach(async (cu) => {
                    let target = db.get(`player_${cu}`).target
                    let partner = db.set(`player_${target.find((a) => a !== player.id)}`)
                    let channel = guild.channels.cache.get(partner.channel)
                    await channel?.send(`${getEmoji("couple", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** is your couple that has their role changed!`)
                })
            }
        }

        if (player.couple) {
            let target = db.get(`player_${player.couple}`)
            let channel = guild.channels.cache.get(target.channel)
            await channel?.send(`${getEmoji("couple", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** is your couple that has their role changed!`)
        }

        if (player.instigator) {
            if (player.instigator.length > 0) {
                player.instigator.forEach(async (cu) => {
                    let target = db.get(`player_${cu}`).target
                    let partner = db.set(`player_${target.find((a) => a !== player.id)}`)
                    let channel = guild.channels.cache.get(partner.channel)
                    await channel?.send(`${getEmoji("couple", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** is your recruit that has their role changed!`)
                })
            }
        }
    })
}
