const db = require("quick.db")
const { getEmoji } = require("../../../../config")

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
    const seerapprentices = alivePlayers.filter((p) => db.get(`player_${p}`).originalRole === "Seer Apprentice") // get the alive alchemist array - Array<Snowflake>

    for (const seerapp of seerapprentices) {
        let guy = db.get(db.get(`player_${seerapp}`).originalPlayer)

        if (guy.status !== "Alive") continue

        let allRoles = db.get(`player_${seerapp}.allRoles`)
        allRoles.pop()
        db.set(`player_${seerapp}.allRoles`, allRoles)
        db.delete(`player_${seerapp}.originalRole`)
        db.set(`player_${seerapp}.role`, "Seer Apprentice")

        let channel = guild.channels.cache.get(db.get(`player_${seerapp}`)?.channel)
        channel?.send(`The **${guy.role}** has been revived so you have become a **Seer Apprentice** again.`)
        channel?.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
        channel?.edit({ name: `priv-seer-apprentice` })
    }
}
