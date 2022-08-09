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
    // loop through each player to see if they are a tough guy
    for (let player of alivePlayers) {
        // check and see if the player is a tough guy
        if (db.get(`player_${player}`).role === "Tough Guy") {
            // check and see if the tough guy protected the attacked player or is the attacked player
            if (db.get(`player_${player}`).target === guy.id || guy.id === player) {
                // check if berserk is active and the attacker is from the werewolves' team
                if (isBerserkActive === true && attacker.team === "Werewolf") {
                    // add the protector in the database
                    let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the tough guy's channel object - Object
                    let attackerChannel = guild.channels.cache.get(attacker.channel) // get the attacker's channel object - Object
                    await channel.send(`${getEmoji("guard", client)} Your fought off an attack ${guy.id === player.id ? "" : `while protecting **${players.indexOf(guy.id) + 1} ${guy.username}**`} and saw that **${players.indexOf(attacker.id) + 1} ${attacker.username} (${getEmoji(attacker.role?.toLowerCase().replace(/\s/g, "_"))} ${attacker.role})** was the attacker!\n\nYou will die at the end of the day.`) // sends the message that they got alerted
                    await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the channel
                    await attackerChannel.send(`${getEmoji("guard", client)} Player **${players.indexOf(player) + 1} ${db.get(`player_${player}`).username}** is a **Tough Guy**! They now know your role!`) // sends a message to the attacker saying that the tough guy knows them
                    await attackerChannel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the attacker's channel
                } else {
                    // alert and exit early
                    isProtected = true // set the protection to true
                    let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the tough guy's channel object - Object
                    let attackerChannel = guild.channels.cache.get(attacker.channel) // get the attacker's channel object - Object
                    await channel.send(`${getEmoji("guard", client)} Your fought off an attack ${guy.id === player.id ? "" : `while protecting **${players.indexOf(guy.id) + 1} ${guy.username}**`} and saw that **${players.indexOf(attacker.id) + 1} ${attacker.username} (${getEmoji(attacker.role?.toLowerCase().replace(/\s/g, "_"), client)} ${attacker.role})** was the attacker!\n\nYou will die at the end of the day.`) // sends the message that they got alerted
                    await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the channel
                    await attackerChannel.send(`${getEmoji("guard", client)} Player **${players.indexOf(player) + 1} ${db.get(`player_${player}`).username}** is a **Tough Guy**! They now know your role!`) // sends a message to the attacker saying that the tough guy knows them
                    await attackerChannel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings alive in the attacker's channel
                    db.set(`player_${player}.wounded`, true) // set that they are wounded

                    // make an exemption if the attacker is a corruptor
                    if (attacker.role === "Corruptor") {
                        isProtected = db.get(`player_${player}`) // set the tough guy as the corrupted player
                    }
                    break // break out of the loop
                }
            }
        }
    }

    // return the isProtected value
    return isProtected
}
