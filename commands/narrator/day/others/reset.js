const db = require("quick.db")

module.exports = async (client) => {
    // get all the variables
    const guild = client.guilds.cache.get("890234659965898813")
    const players = db.get(`players`)

    players.forEach(async (player) => {
        if (["Jailer", "Dreamcatcher", "Wolf Shaman", "Warden", "Night Watchman"].includes(db.get(`player_${player}`).role)) {
            if (db.get(`player_${player}`).role === "Night Watchman" && db.get(`player_${player}`).target) db.subtract(`player_${player}.uses`, 1)
            db.delete(`player_${player}.target`)
            db.delete(`player_${player}.jailedPlayers`)
        }

        if (db.get(`player_${player}`).lethal) db.delete(`player_${player}.lethal`)
        db.delete(`player_${player}.shamanned`)
        db.delete(`player_${player}.jailed`)
    })

    db.delete(`isBerserkActive`)
}
