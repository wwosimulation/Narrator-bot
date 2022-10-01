const db = require("quick.db") // databas
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
    const alchemists = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Werewolf") // get the alive werewolf array - Array<Snowflake>

    // loop through every alive player
    alivePlayers.forEach(async (player) => {
        let guy = db.get(`player_${player}`) // get the player object - Object

        // check if the player is a werewolf who got revived two phases before
        if (guy.revivedAt + 1 === db.get(`gamePhase`)) {
            // kill the player
            let member = await guild.members.fetch(guy.id) // fetch the discord member - Object
            let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the player's roles - Array<Snowflake>
            let role = guy.role
            db.set(`player_${guy.id}.status`, "Dead") // change the status of the player
            member.roles.set(memberRoles) // set the roles
            dayChat.send(`${getEmoji("wolf_revive", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**'s time is up and has now went back to the grave!`) // send the message
        }
    })

    return true
}
