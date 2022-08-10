const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")
const shuffle = require("shuffle-array")

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const sheriffs = players.filter((p) => db.get(`player_${p}`).role === "Sheriff" && db.get(`player_${p}`).status === "Alive") // get the alive Sheriffs array - Array<Snowflake>

    // loop through each sheriff
    for (const sher of sheriffs) {
        let sheriff = db.get(`player_${sher}`) // get the sheriff player - Object
        if (!sheriff.target) continue; // if the sheriff doesn't has a target, don't do anything and check for the next sheriff

        let guy = db.get(`player_${sheriff.target}`) // get the player who the sheriff had selected to check
        if (guy.status === "Alive") continue; // if the player is alive, don't do anything and check for the next sheriff

        let channel = guild.channels.cache.get(sheriff.channel) // get the channel object - Object

        // get the player who killed them
        let attacker = db.get(`player_${guy.killedBy}`)

        // if the attacker is not alive, send a message to the sheriff
        if (attacker.status === "Dead") {
            await channel.send(`${getEmoji("suspect", client)} Your target **${players.indexOf(guy.id) + 1} ${guy.username}** was killed by **${players.indexOf(attacker.id) + 1} ${attacker.username}**. They are now dead.`)
            continue
        }

        // get all alive players excluding the sheriff and the attacker
        let alivePlayers = db.get(`players`).filter((p) => db.get(`player_${p}`).status === "Alive" && p !== guy.killedBy && p !== sher)

        // get a random player
        let randomPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)]

        // if there is no second player, that means that the village is almost gone
        if (!randomPlayer) {
            await channel.send(`${getEmoji("snipe", client)} This village is too small to find any suspects!`)
            continue
        }

        // put them into an array and
        let suspects = [attacker, db.get(`player_${randomPlayer}`)]

        // shuffle the players
        shuffle(suspects)

        await channel.send(`${getEmoji("suspect", client)} Your target **${players.indexOf(guy.id) + 1} ${guy.username}** was either killed by **${players.indexOf(suspects[0]?.id) + 1} ${suspects[0]?.username}** or **${players.indexOf(suspects[1]?.id) + 1} ${suspects[1]?.username}**!`)
    }
}
