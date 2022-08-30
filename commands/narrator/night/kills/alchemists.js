const db = require("quick.db") // databas
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
    const alchemists = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Alchemist") // get the alive alchemist array - Array<Snowflake>

    // loop through every alive player
    alivePlayers.forEach(async (player) => {
        let guy = db.get(`player_${player}`) // get the player object - Object

        // check if the player is poisoned
        if (Array.isArray(guy.poisoned)) {
            // checks if they property is an array

            // check if at least one of their attackers is alive
            if (guy.poisoned.some((p) => alivePlayers.includes(p))) {
                // checks if at least 1 alchemist who poisoned them is alive

                // kill the player
                let member = await guild.members.fetch(guy.id) // fetch the discord member - Object
                let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the player's roles - Array<Snowflake>
                let role = guy.role
                if (guy.tricked) role = "Wolf Trickster"
                db.set(`player_${guy.id}.status`, "Dead") // change the status of the player
                member.roles.set(memberRoles) // set the roles
                dayChat.send(`${getEmoji("blackp", client)} The Alchemist killed **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`) // send the message
            }
        }
    })
}
