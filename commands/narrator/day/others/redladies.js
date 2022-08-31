const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const redladies = players.filter((p) => db.get(`player_${p}`).role === "Red Lady" && db.get(`player_${p}`).status === "Alive") // get the alive Red Ladies array - Array<Snowflake>

    // loop through each red lady
    for (const rl of redladies) {
        let redlady = db.get(`player_${rl}`) // get the red lady player - Object
        if (!redlady.target) continue // if the red lady doesn't has a target, don't do anything and check for the next red lady

        let guy = db.get(`player_${redlady.target}`) // get the player who the red lady had selected to visit
        if (guy.status === "Dead") continue // if the player is dead, don't do anything and check for the next red lady

        // check if the player is evil
        if (guy.team !== "Village" && !["Fool", "Headhunter", "Sect Leader", "Zombie", "Instigator"].includes(guy.role)) {
            // kill this stoopid red lady
            db.set(`player_${rl}.status`, "Dead")
            let member = await guild.members.fetch(rl) // get the discord member - Object
            let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get the member roles
            let role = "Red Lady"
            if (redlady.tricked) role = "Wolf Trickster"
            await dayChat.send(`${getEmoji("visit", client)} **${players.indexOf(rl) + 1} ${redlady.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** visited an evil role and died.`)
            await member.roles.set(memberRoles)
        }
    }
}
