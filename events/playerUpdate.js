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

        if (player.cupid) {
            if (player.cupid.length > 0) {
                player.cupid.forEach(async (cu) => {
                    let target = db.get(`player_${cu}`).target
                    let partner = db.set(`player_${target.find((a) => a !== player.id)}`)
                    let channel = guild.channels.cache.get(partner.channel)
                    await channel?.send(`${getEmoji("couple", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(guy.role.toLowerCase().replace(/\s/g, "_"), client)} ${guy.role})** is your couple that has their role changed!`)
                })
            }
        }

        if (player.instigator) {
            if (player.instigator.length > 0) {
                player.instigator.forEach(async (cu) => {
                    let target = db.get(`player_${cu}`).target
                    let partner = db.set(`player_${target.find((a) => a !== player.id)}`)
                    let channel = guild.channels.cache.get(partner.channel)
                    await channel?.send(`${getEmoji("couple", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(guy.role.toLowerCase().replace(/\s/g, "_"), client)} ${guy.role})** is your couple that has their role changed!`)
                })
            }
        }
    })
}
