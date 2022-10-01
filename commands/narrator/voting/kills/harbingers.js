const db = require("quick.db")
const { getEmoji } = require("../../../../config")

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const doomedPlayers = alivePlayers.filter((p) => db.get(`player_${p}`).doomed === true) // get all the doomed players array - Array<Snowflake>

    for (const p of doomedPlayers) {
        let guy = db.get(`player_${p}`)
        let role = guy.role
        if (guy.tricked) role = "Wolf Trickster"
        let attackedPlayer = await guild.members.fetch(guy.id) // fetch the discord member - Object
        let attackedPlayerRoles = attackedPlayer.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the roles and replace the Alive role with Dead.
        await attackedPlayer.roles.set(attackedPlayerRoles) // removes the Alive and adds the Dead discord role
        await dayChat.send(`${getEmoji("doom", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** has been doomed by the Harbinger!`)
        db.delete(`player_${guy.id}.doomAttacker`)
        db.set(`player_${guy.id}.status`, "Dead")
        client.emit("playerKilled", db.get(`player_${guy.id}`), db.get(`player_${guy.doomAttacker}`))
    }
}
