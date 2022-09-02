const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")
const shuffle = require("shuffle-array")

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const spiritseers = players.filter((p) => db.get(`player_${p}`).role === "Spirit Seer" && db.get(`player_${p}`).status === "Alive") // get the alive Spirit Seers array - Array<Snowflake>

    // loop through each spirit seer
    for (const ss of spiritseers) {
        let spirit = db.get(`player_${ss}`) // get the spirit seer player - Object
        if (!spirit.target) continue // if the spirit seer doesn't has a target, don't do anything and check for the next spirit seer
        if (spirit.status === "Dead") continue // if the spirit seer is dead, don't do anything and check for the next spirit seer

        let gamePhase = db.get(`gamePhase`)
        let night = Math.floor(gamePhase / 3) + 1
        let deadPlayers = players.filter((p) => db.get(`player_${p}`).status === "Dead" && db.get(`player_${p}`).killedDuring === "night" && db.get(`player_${p}`).killedOn === night)
        let status = "blue"

        spirit.target.forEach((target) => {
            if (db.get(`player_${target}`).status === "Dead") status = "blue"
            if (deadPlayers.map((p) => db.get(`player_${p}`).killedBy).includes(target)) status = "red"
        })

        let channel = guild.channels.cache.get(spirit.channel) // get the channel object - Object

        await channel.send(`${getEmoji(status === "blue" ? "nokill" : "yeskill", client)} **${spirit.target.map((c) => `${players.indexOf(c) + 1} ${db.get(`player_${c}`).username}`).join(`** ${status === "blue" ? "and" : "or"} **`)}**`)
    }
}
