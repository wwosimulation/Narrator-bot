const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const secthunters = players.filter((p) => db.get(`player_${p}`).role === "Sect Hunter" && db.get(`player_${p}`).status === "Alive") // get the alive Sect Hunters array - Array<Snowflake>

    // loop through each sect hunter
    for (const sh of secthunters) {
        let hunter = db.get(`player_${sh}`) // get the sect hunter player - Object
        if (!hunter.target) continue // if the sect hunter doesn't have a target, don't do anything and check for the next sect hunter

        let guy = db.get(`player_${hunter.target}`) // get the player who the sect hunter had selected to hunt
        if (guy.status === "Dead") continue // if the player is dead, don't do anything and check for the next sect hunter

        // check if the player is evil
        if (guy.role === "Sect Leader" || typeof guy.sected === "string") {
            // kill the hunted player
            db.set(`player_${guy.id}.status`, "Dead")
            let member = await guild.members.fetch(guy.id) // get the discord member - Object
            let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get the member roles
            let role = guy.role
            if (guy.tricked) role = "Wolf Trickster"
            await dayChat.send(`${getEmoji("sect_hunter", client)} The Sect Hunter shot **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`)
            await member.roles.set(memberRoles)

            if (players.map((p) => db.get(`player_${p}`)).filter((p) => (p.role === "Sect Leader" || (["Grave Robber", "Doppelganger"].includes(p.role) && db.get(`player_${p.target}`)?.role === "Sect Leader")) && p.status === "Alive").length === 0) {
                let channel = guild.channels.cache.get(hunter.channel)
                await channel.send(`<@&${guild.roles.cache.find((r) => r.name === "Alive").id}> All players that belonged to the Sect have died! Your role is now a Villager and you can take the long deserved rest you need.`)
                await channel.edit({ name: "priv-villager" })
                db.set(`player_${sh}.role`, "Villager")
                db.set(`player_${sh}.aura`, "Good")
            }
        }
    }
}
