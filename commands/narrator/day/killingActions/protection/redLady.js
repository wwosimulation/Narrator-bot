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

    // check if the role is Red Lady
    if (guy.role === "Red Lady") {
        // check if berserk is active and the attacker is from the werewolves' team
        if (isBerserkActive === true && attacker.team === "Werewolf") {
            isProtected = false
        } else {
            // check if the Red Lady visited someone
            if (guy.visit) {
                let channel = guild.channels.cache.get(guy.channel) // gets the channel
                isProtected = true // set isProtected to true
                db.delete(`player_${guy.id}.shield`) // removes the shield
                await channel.send(`${getEmoji("guard", client)} Someone tried to kill you while you were away!`) // sends a message to the attacked player
                await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings the alive role
            }
        }
    }

    // return the isProtected value
    return isProtected
}
