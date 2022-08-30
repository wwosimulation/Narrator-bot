const db = require("quick.db") // database

module.exports = async () => {
    let players = db.get(`players`) // get all the player's id that are in game - Array<Snowflake>
    players.forEach(async (player) => {
        let guy = db.get(`player_${player}`) // get the guy object - Object

        // reset the actions
        db.delete(`player_${player}.vote`) // deletes the vote
        db.delete(`player_${player}.bread`) // deletes the bread, if any

        if (["Beast Hunter", "Marksman"].includes(guy.role)) {
            // make their trap or mark active
            db.set(`player_${player}.placed`, true)
        }

        // trapper
        if (guy.role === "Trapper") {
            let currentTraps = db.get(`player_${player}.traps`) || []
            currentTraps.push(guy.target)
            db.delete(`player_${guy.id}.target`)
            db.set(`player_${player}.traps`, currentTraps)
            if (db.get(`player_${player}.triggered`)) {
                db.delete(`player_${player}.triggered`)
                db.set(`player_${player}.traps`, [])
                db.delete(`player_${player}.active`)
            }
        }

        // check if they have a role that can only be used once a night.
        if (["Aura Seer", "Seer", "Detective", "Analyst", "Sorcerer", "Wolf Seer", "Hacker", "Santa Claus", "Mortician", "Alpha Werewolf"].includes(guy.role)) {
            // if they have uses, reset it.
            if (typeof guy.uses === "number") db.add(`player_${player}.uses`, 1)
        }

        // reset their target for every role except for some
        if (!["Junior Werewolf", "Avenger", "Dreamcatcher", "Jailer", "Headhunter", "Villager", "Marksman", "President", "Werewolf", "Bomber", "Split Wolf", "Marksman", "Beast Hunter", "Warden", "Ritualist", "Trapper", "Instigator", "Cupid", "Grave Robber", "Wolf Trickster"].includes(guy.role)) {
            // delete the target
            db.delete(`player_${player}.target`)

            if (guy.role === "Witch") {
                db.delete(`player_${player}.target`) // resets the potion (so that it does not heal the same player again)
            } else if (guy.role === "Alchemist") {
                db.delete(`player_${player}.blackTarget`) // deletes the black potion
                db.delete(`player_${player}.redTarget`) // deletes the red potion
            }
        }
    })
}
