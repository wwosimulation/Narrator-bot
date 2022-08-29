const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
    const jacks = alivePlayers.filter((p) => ["Jack"].includes(db.get(`player_${p}`)?.role)) // get the alive Jacks array - Array<Snowflake>

    for (let jack of jacks) {

        let player = db.get(`player_${jack}`)

        if (!player.target) continue;
        if (!player.target?.map(a => db.get(`player_${a}`).status).includes("Alive")) continue;

        player.target.forEach(async target => {
            let guy = db.get(`player_${target}`)
            if (!guy) return;
            if (guy.status !== "Alive") return;
            if (guy?.trickortreat !== true) return;

            let role = guy.role
            if (guy.tricked) role = "Wolf Trickster"

            db.set(`player_${target}.status`, "Dead")

            let member = await guild.members.fetch(target)
            let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // gets all the roles of this member
            await member.roles.set(memberRoles) // sets the role for the member
            await dayChat.send(`${getEmoji("jack_kill", client)} **${players.indexOf(target)+1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** had encoutered a Jack and chose the wrong option that lead them to their death!`)
            client.emit("playerKilled", db.get(`player_${target}`), db.get(`player_${jack}`))
        })

        db.delete(`player_${jack}.target`)
    }
}
