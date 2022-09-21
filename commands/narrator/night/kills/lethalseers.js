const db = require("quick.db") // databas
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const lethalSeers = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Lethal Seer") // get the alive Lethal Seers array - Array<Snowflake>
    const stubbornWerewolves = require("../../day/killingActions/protection/stubbornWolves.js") // stubborn ww
    const surrogate = require("../../day/killingActions/protection/surrogate.js") // surrogate

    // loop through each lethal seer

    for (let ls of lethalSeers) {
        let attacker = db.get(`player_${ls}`) // get the attacker player object - Object

        // check if the attacker is alive
        if (attacker.status === "Alive") {
            // check if the attacker has a target
            if (attacker.target) {
                db.delete(`player_${guy.id}.target`)

                let guy = db.get(`player_${attacker.target}`) // get the guy player object - Object

                // check if the guy is alive
                if (guy.status === "Alive") {
                    // check if the player is stubborn wolf that has 2 lives
                    let getResult = await stubbornWerewolves(client, guy) // checks if the player is stubborn wolf and has 2 lives
                    if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                    // check if the player they are attacking is protected by their surrogate
                    getResult = await surrogate(client, guy, attacker) // checks if a surrogate is prorecting them
                    if (typeof getResult === "object") guy = db.get(`player_${getResult.id}`) // exits early if a surrogate IS protecting them
                    db.set(`player_${guy.id}.status`, "Dead") // change the sttaus
                    let attackedPlayer = await guild.members.fetch(guy.id) // fetch the discord member - Object
                    let attackedPlayerRoles = attackedPlayer.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the roles and replace the Alive role with Dead.
                    await dayChat.send(`${getEmoji("lethal_seer", client)} The Lethal Seer killed **${players.indexOf(guy.id) + 1} ${guy.username}**!`) // send the message
                    await attackedPlayer.roles.set(attackedPlayerRoles) // set the status to Dead
                    db.set(`player_${guy.id}.lethal`, true)
                    client.emit("playerKilled", db.get(`player_${guy.id}`), db.get(`player_${attacker.id}`))
                }
            }
        }
    }
}
