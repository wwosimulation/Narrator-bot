const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../../config") // functions

module.exports = async (client, guy, attacker) => {
    if (typeof guy !== "object" || typeof attacker !== "object") return false // makes sure if "guy" and "attacker" is an object, otherwise exit early

    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const isBerserkActive = db.get(`isBerserkActive`) // get the value of isBerserkActive
    let allProtected = db.get(`berserkProtected`) || [] // get the array of players who protected the berserk's target

    let isProtected = false
    // loop through each player to see if they are a Surrogate
    for (let player of alivePlayers) {
        // check and see if the player is a Surrogate
        if (db.get(`player_${player}`).role === "Surrogate") {
            if (db.get(`player_${player}`).target === guy.id) {
                // check if berserk is active and the attacker is from the werewolves' team
                if (isBerserkActive === true && attacker.team === "Werewolf") {
                    allProtected.push(player)
                    db.set(`berserkProtected`, allProtected)
                } else {
                    // alert and exit early
                    let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the channel object - Object
                    await channel.send(`${getEmoji("heal", client)} Your protection saved **${players.indexOf(guy.id) + 1} ${guy.username}**!`) // sends the message that they got alerted
                    await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the channel
                    isProtected = db.get(`player_${player}`)
                    break // break out of the loop
                }
            }
        }
    }

    // return the isProtected value
    return isProtected
}
