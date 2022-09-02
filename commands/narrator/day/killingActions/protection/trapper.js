const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../../config") // functions

module.exports = async (client, guy, attacker) => {
    if (typeof guy !== "object" || typeof attacker !== "object") return false

    // define all variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get("players") // get the players - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players - Array<Snowflake>
    const isBerserkActive = db.get("isBerserkActive") // get the value of isBerserkActive
    const attackerMember = await guild.members.fetch(attacker.id) // get the discord member - GuildMember - Object
    let allProtected = db.get("berserkProtected") || [] // get the array of players who protected the berserk's target - Array<Snowflake>

    let isProtected = false
    // loop through each player to see if they are a trapper
    for (let player of alivePlayers) {
        // check the role
        if (db.get(`player_${player}`).role === "Trapper") {
            // check if the traps are active and a trap is on the attacked player
            if (!db.get(`player_${player}`).active || !db.get(`player_${player}`).traps.includes(guy.id)) continue

            // trap can save multiple times in the same night - don't remove it
            // save that a trap got triggered
            db.set(`player_${player}.triggered`, true)

            // check if berserk is active and the attacker is from the werewolves' team
            if (isBerserkActive === true && attacker.team === "Werewolf") {
                allProtected.push(player)
                db.set("berserkProtected", allProtected)
            } else {
                // alert and exit early
                isProtected = true // set the protection to true
                let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the channel object - Object

                // check if the attacker DOES NOT belong to the werewolves' team.
                if (attacker.team !== "Werewolf") {
                    // send the message
                    await channel.send({ content: `${getEmoji("trap", client)} At least one of your traps was triggered last night but your target was too strong.` }) // send a message to the trapper
                    await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the channel
                }
                break // exit the loop
            }
        }
    }

    // return the protection status
    return isProtected
}
