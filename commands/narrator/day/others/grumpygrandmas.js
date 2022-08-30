const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const grumpygrandmas = players.filter((p) => db.get(`player_${p}`).role === "Grumpy Grandmas") // get the alive Grumpy Grandmas array - Array<Snowflake>

    // loop through each grumpy grandma
    for (const gg of grumpygrandmas) {
        let granny = db.get(`player_${gg}`) // get the grumpy grandma player - Object

        db.delete(`player_${gg}.target`) // reset the target (Won't affect the current target, don't worry)

        if (!granny.target) continue // if the granny doesn't has a target, don't do anything and check for the next granny

        let guy = db.get(`player_${granny.target}`) // get the player who the medium had selected to revive
        if (guy.status === "Dead") continue // if the player is alive, don't do anything and check for the next granny

        // mute the player
        db.set(`player_${granny.id}.lastMuted`, guy.id) // set the last muted player as the current player
        await dayChat.send(`${getEmoji("ggmute", client)} **${players.indexOf(guy.id) + 1} ${guy.username}** can't talk or vote today!`) // sends a message in day chat
        await dayChat.permissionOverwrites.edit(guy.id, { SEND_MESSAGES: false }) // change the permission of this player
    }
}
