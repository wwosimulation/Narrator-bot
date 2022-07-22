const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions

module.exports = async (client, guy, attacker) => {
    if (typeof guy !== "object" || typeof attacker !== "object") return false // makes sure if "guy" and "attacker" is an object, otherwise exit early

    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const bodyguardPlayers = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Bodyguard" && p !== guy.id) // filter the players that are Bodyguad - Array<Snowflake>
    const isBerserkActive = db.get(`isBerserkActive`) // get the value of isBerserkActive
    let allProtected = db.get(`berserkProtected`) || [] // get the array of players who protected the berserk's target

    let isProtected = false

    // check if berserk is active and the attacker is from the werewolves' team
    if (isBerserkActive === true && attacker.team === "Werewolf") {
        for (let player of bodyguardPlayers) {
            if (db.get(`player_${player}`).protection === guy.id) {
                allProtected.push(player)
                db.set(`berserkProtected`, allProtected)
            }
        }

        return isProtected
    }

    // check if the player is a Bodyguard
    if (guy.role === "Bodyguard") {
        if (guy.lives === 2) {
            const channel = guild.channels.cache.get(guy.channel) // get the channel of the attacked player
            await channel.send(`${getEmoji("guard", client)} You fought off an attack last night and survived. Next time you are attacked you will die.`) // send a message to the attacked player
            db.set(`player_${guy.id}.lives`, 1) // reduce their lives
            return isProtected // exit early with the isProtected value
        } else {
            // loop through each Bodyguard
            for (let player of bodyguardPlayers) {
                // check if the bodyguard protected the player and has 2 lives
                if (db.get(`player_${player}`).protection === guy.id) {
                    if (db.get(`player_${player}`).lives === 2) {
                        isProtected = true // set isProtected to true
                        let bgChannel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the protector's channel
                        await bgChannel.send(`${getEmoji("guard", client)} You fought off an attack last night and survived. Next time you are attacked you will die.`) // send a message to the attacked player
                        await bgChannel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings them
                    }
                }
            }

            // check if no one was protected
            if (isProtected === false) {
                // loop through each Bodyguard
                for (let player of bodyguardPlayers) {
                    // check if the bodyguard protected the player and has 1 live
                    if (db.get(`player_${player}`).protection === guy.id) {
                        if (db.get(`player_${player}`).lives === 1) {
                            isProtected = db.get(`player_${player}`) // set the bodyguard as the attacked player
                        }
                    }
                }
            }

            // check if no one was protected even until now
            if (isProtected === false) isProtected = guy // set isProtected to the attacked player since no one protected them
        }

        return isProtected // exit early and give whatever was set
    }

    // if they were not bodyguard then:

    // loop through each Bodyguard
    for (let player of bodyguardPlayers) {
        // check if the bodyguard protected the player and has 2 lives
        if (db.get(`player_${player}`).protection === guy.id) {
            if (db.get(`player_${player}`).lives === 2) {
                isProtected = true // set isProtected to true
                let bgChannel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the protector's channel
                await bgChannel.send(`${getEmoji("guard", client)} You fought off an attack last night and survived. Next time you are attacked you will die.`) // send a message to the attacked player
                await bgChannel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings them
            }
        }
    }

    // check if no one was protected
    if (isProtected === false) {
        // loop through each Bodyguard
        for (let player of bodyguardPlayers) {
            // check if the bodyguard protected the player and has 1 live
            if (db.get(`player_${player}`).protection === guy.id) {
                if (db.get(`player_${player}`).lives === 1) {
                    isProtected = db.get(`player_${player}`) // set the bodyguard as the attacked player
                }
            }
        }
    }

    // check if no one was protected even until now
    if (isProtected === false) isProtected = guy // set isProtected to the attacked player since no one protected them

    // return the isProtected value
    return isProtected
}
