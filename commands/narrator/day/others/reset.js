const db = require("quick.db")

module.exports = async (client) => {
    // get all the variables
    const guild = client.guilds.cache.get("890234659965898813")
    const players = db.get(`players`)

    players.forEach(async (player) => {
        if (["Jailer", "Dreamcatcher", "Wolf Shaman"].includes(db.get(`player_${player}`).role)) {
            db.delete(`player_${player}.target`)
        }

        db.delete(`player_${player}.shamanned`)
    })
}
