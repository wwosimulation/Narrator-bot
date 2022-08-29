const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const jailedChat = guild.channels.cache.find((c) => c.name === "jailed-chat")
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
    const jacks = alivePlayers.filter((p) => ["Jack"].includes(db.get(`player_${p}`).role)) // get the alive Jacks array - Array<Snowflake>
    const jailers = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Jailer") // get the alive jailers array - Array<Snowflake>

    for (let jack of jacks) {

        let player = db.get(`player_${jack}`)

        if (!player) continue;
        if (player.status !== "Alive") continue;
        if (!player.target) continue;
        if (!player.target?.map(a => db.get(`player_${a}`).status).includes("Alive")) continue;

        player.target.forEach(async target => {
            let guy = db.get(`player_${target}`)
            if (!guy) return;
            if (guy.status !== "Alive") return;

            let channel = guild.channels.cache.get(guy.status)
            let components = { type: 1, components: [
                { type: 2, style: 1, custom_id: `trick-${target}-${jack}`, label: "Trick", emoji: { id: getEmoji("trick", client) } },
                { type: 2, style: 1, custom_id: `treat-${target}-${jack}`, label: "Treat", emoji: { id: getEmoji("treat", client) } },
            ]}

            db.set(`player_${target}.trickortreat`, true)

            await channel.send({ content: `${getEmoji("jack_kill")} The Jack has offered to trick or treat you. Choose wisely as one may lead to your eternal doom. You will automatically choose the wrong option if you fail to choose in time.`, components: [components] })
        })
    }
}
