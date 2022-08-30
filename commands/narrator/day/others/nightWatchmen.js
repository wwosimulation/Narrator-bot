const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client, alivePlayersBefore) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const nightWatchmen = players.filter((p) => db.get(`player_${p}`).role === "Night Watchman" && alivePlayersBefore.includes(p)) // get the alive Night Watchen array - Array<Snowflake>

    // loop through each baker
    for (const watchman of nightWatchmen) {
        let nightwatchman = db.get(`player_${watchman}`) // get the baker player - Object

        // check if the night watchman has a target
        if (nightWatchmen.uses === 0) continue // skip if night watchman does not any uses

        let roles = ["Beast Hunter", "Trapper", "Doctor", "Night Watchman", "Witch", "Bodyguard", "Tough Guy", "Jailer", "Ghost Lady"]
        let content = []
        let channel = guild.channels.cache.get(nightwatchman.channel)

        players.forEach(async (p) => {
            if (!alivePlayersBefore.includes(p)) return
            if (p === watchman) return

            let player = db.get(`player_${p}`)

            if (!player) return
            if (roles.includes(player.role)) return
            if (player.role === "Beast Hunter" && player?.placed === true) return
            if (content.includes(player.target)) return
            content.push(player.target)
        })

        if (content.length === 0) await channel.send(`${getEmoji("nwm_protect", client)} No one protected anyone tonight!`)

        if (content.length > 0) await channel.send(`${getEmoji("nwm_protect", client)} These are the protection results:\n\n - ${content.map((a) => `${getEmoji("nwm_protect", client)} Someone was protecting **${players.indexOf(a) + 1} ${db.get(`player_${a}`).username}**`).join("\n - ")}`)
    }
}
