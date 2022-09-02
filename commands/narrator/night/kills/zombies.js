const db = require("quick.db") // databas
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const zombies = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Zombie") // get the alive Zombie array - Array<Snowflake>

    // loop through each zombie
    for (let zombie of zombies) {
        let zomb = db.get(`player_${zombie}`) // get the zombie player objec

        // check if the zombie is alive
        if (zomb.status === "Alive") {
            // check if the zombie is NOT the original zombie
            if (!zomb.isOriginal) {
                // check if the zombie has lived for more than 3 days
                if (zomb.bittenAt - db.get(`gamePhase`) >= 6) {
                    // kill the zombie
                    db.set(`player_${zomb.id}.status`, "Dead") // change the status of the player
                    let player = await guild.members.fetch(zomb.id) // fetch the discord member - Object
                    let playerRoles = player.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the roles and replace the Alive role with Dead.
                    let role = zomb.role
                    if (zomb.tricked) role = "Wolf Trickster"
                    await dayChat.send(`${getEmoji("zombie", client)} The body of **${players.indexOf(zombie.id) + 1} ${zombie.username} (${getEmoji(role.toLowerCase()?.replace(/\s/g, "_"), client)} ${role})** has decayed and they are now dead!`) // send the message
                    await player.roles.set(playerRoles) // change the roles
                }
            }
        }
    }
}
