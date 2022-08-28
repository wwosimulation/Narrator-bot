const db = require("quick.db") // databas
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const stubbornWerewolves = require("../../day/killingActions/protection/stubbornWolves.js") // stubborn ww

    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
    const bombers = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Bomber") // get the alive bombers array - Array<Snowflake>

    // loop through each bomber
    for (let bomber of bombers) {
        let attacker = db.get(`player_${bomber}`) // get the attacker player object - Object

        // check if the attacker is alive
        if (attacker.status === "Alive") {
            // check if the attacker has set their bombs
            if (attacker.target) {
                db.delete(`player_${bomber}.target`)
                // send this after 1 minute
                setTimeout(async () => {
                    // loop through each target
                    attacker.target.forEach(async (target) => {
                        let guy = db.get(`player_${target}`) // get the guy player - Object

                        // check if the guy is alive
                        if (guy.status === "Alive" && guy.id !== attacker.id) {
                                                
                            // check if the player is stubborn wolf that has 2 lives
                            let getResult = await stubbornWerewolves(client, guy) // checks if the player is stubborn wolf and has 2 lives
                            if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives 
                            let attackedPlayer = await guild.members.fetch(guy.id) // fetch the discord member - Object
                            let attackedPlayerRoles = attackedPlayer.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get the member roles - Array<Snowflake>
                            await attackedPlayer.roles.set(attackedPlayerRoles) // set the roles
                            let role = guy.role
                            if (guy.tricked) role = "Wolf Trickster"
                            db.set(`player_${guy.id}.status`, "Dead") // set the status of the player
                            dayChat.send(`${getEmoji("explode", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase()?.replace(/\s/g, "_"), client)} ${role})** was killed by an explosion!`) // send the message
                        }
                    })
                }, 60000)
            }
        }
    }
}
