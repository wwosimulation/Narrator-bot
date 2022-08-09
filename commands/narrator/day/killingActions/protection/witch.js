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
    // loop through each player to see if they are a witch
    for (let player of alivePlayers) {
        // check and see if the player is a witch
        if (db.get(`player_${player}`).role === "Witch") {
            // check and see if the Witch protected the attacked player
            if (db.get(`player_${player}`).protection === guy.id) {
                // remove the potion from the witch and remove the protection
                db.delete(`player_${player}.protection`) // remove the protection
                db.set(`player_${player}.uses`, 0) // remove the uses

                // check if berserk is active and the attacker is from the werewolves' team
                if (isBerserkActive === true && attacker.team === "Werewolf") {
                    allProtected.push(player)
                    db.set(`berserkProtected`, allProtected)
                } else {
                    // alert and exit early
                    isProtected = true // set the protection to true
                    let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the channel object - Object
                    await channel.send(`${getEmoji("potion", client)} Your potion saved **${players.indexOf(guy.id) + 1} ${guy.username}**!`) // sends the message that they got alerted
                    await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the channel
                    break // break out of the loop
                }
            }
        }
    }

    // return the isProtected value
    return isProtected
}
