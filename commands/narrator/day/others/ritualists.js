const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => db.get(`player_${p}`).status === "Dead") // get the dead players array - Array<Snowflake>

    // loop through each dead player
    for (const player of deadPlayers) {
        let guy = db.get(`player_${player}`) // get the player - Object
        if (guy.status === "Alive") continue // if the player is alive, don't do anything and check for the next player

        // revive the player
        if (guy.ritualRevive !== db.get(`gamePhase`) + 1) return // if the phase isn't over yet, don't do anything and check for the next player

        db.set(`player_${guy.id}.status`, "Alive") // set the status of the player to Alive
        let member = await guild.members.fetch(guy.id) // get the discord member
        let memberRoles = member.roles.cache
            .map((r) => (r.name === "Dead" ? ["892046206698680390", "892046205780131891"] : r.id))
            .join(",")
            .split(",") // get the roles, and replace the dead role with alive
        await dayChat.send(`${getEmoji("ritualist_revive", client)} The Ritualist revived **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(guy.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${guy.role})**`) // sends a message in day chat
        await member.roles.set(memberRoles)
    }
}
