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
    // loop through each player to see if they are a Night Watchman
    for (let player of alivePlayers) {

        // check and see if the player is a Night Watchman
        if (db.get(`player_${player}`).role !== "Night Watchman") continue; // skip to next player if this is not Night Watchman

        // check if the Night Watchman has a target
        if (!db.get(`player_${player}`).target) continue; // skip to next player if this Night Watchman does not have a target

        // check if the Night Watchman protected the player
        if (db.get(`player_${player}`).target !== guy.id) continue; // skip to next player if this Night Watchman did not save the player

        if (isBerserkActive === true && attacker.team === "Werewolf") {
            allProtected.push(player)
            db.set(`berserkProtected`, allProtected)
        } else {
            // alert and exit early
            isProtected = true // set the protection to true
            let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the channel object - Object
            await channel.send(`${getEmoji("nwm_select", client)} Your protection saved **${players.indexOf(guy.id) + 1} ${guy.username}**!`) // sends the message that they got alerted
            await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the channel
            break // break out of the loop
        }
        
    }

    // return the isProtected value
    return isProtected
}
