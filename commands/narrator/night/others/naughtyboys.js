const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const naughtyboys = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Naughty Boy") // get the alive nb array - Array<Snowflake>
    const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
    const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")

    // loop through each naughty boy
    for (const boy of naughtyboys) {
        let nb = db.get(`player_${boy}`) // get the naughty bot player object - Object

        db.set(`player_${boy}.uses`, 0) // set the uses to 0 regardless if the swap was succesful or not.

        if (nb.target?.length !== 2) continue // skip if the naughty boy doesn't have a target

        if (nb.target?.filter((p) => alivePlayers.includes(p)).length !== 2) continue // skip if one of them are not alive.

        let player1 = db.get(`player_${nb.target[0]}`) // get the player1 object - Object
        let player2 = db.get(`player_${nb.target[1]}`) // get the player2 object - Object

        let channel1 = guild.channels.cache.get(player1.channel) // get the channel from player 1 - Object
        let channel2 = guild.channels.cache.get(player2.channel) // get the channel from player 2 - Object

        // copy every data from player 1 to player 2
        Object.entries(player1).forEach((entry) => {
            if (!["username", "id", "status", "channel", "allRoles"].includes(entry[0])) {
                db.set(`player_${nb.target[1]}.${entry[0]}`, entry[1])
                let allRoles = player1.allRoles || []
                allRoles.push(player1.role)
                db.set(`player_${nb.target[1]}.allRoles`, allRoles)
            }
        })

        // copy every data from player 2 to player 1
        Object.entries(player2).forEach((entry) => {
            if (!["username", "id", "status", "channel", "allRoles"].includes(entry[0])) {
                db.set(`player_${nb.target[0]}.${entry[0]}`, entry[1])
                let allRoles = player1.allRoles || []
                allRoles.push(player2.role)
                db.set(`player_${nb.target[0]}.allRoles`, allRoles)
            }
        })

        // create the channels

        // set the previous roles
        let previousRoles1 = player1.allRoles || [player1.role]
        previousRoles1.push(player2.role)
        db.set(`player_${player1.id}.allRoles`, previousRoles1)

        // set the previous roles
        let previousRoles2 = player2.allRoles || [player2.role]
        previousRoles2.push(player1.role)
        db.set(`player_${player2.id}.allRoles`, previousRoles2)

        await channel1.edit({ name: `priv-${player2.role.toLowerCase().replace(/\s/g, "-")}` }) // edit the channel name
        await channel2.edit({ name: `priv-${player1.role.toLowerCase().replace(/\s/g, "-")}` }) // edit the channel name

        await channel1.bulkDelete(100)
        await channel2.bulkDelete(100)

        await channel1.send(`Your role has been swapped by the Naughty Boy!\n\n${getRole(player2.role.toLowerCase().replace(/\s/g, "-")).description}`).then(async (c) => {
            await c.pin()
            await c.channel.bulkDelete(1)
        }) // sends the description, pins the message and deletes the last message
        await channel1.send(`<@${player1.id}>`).then((c) => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds

        await channel2.send(`Your role has been swapped by the Naughty Boy!\n\n${getRole(player1.role.toLowerCase().replace(/\s/g, "-")).description}`).then(async (c) => {
            await c.pin()
            await c.channel.bulkDelete(1)
        }) // sends the description, pins the message and deletes the last message
        await channel2.send(`<@${player2.id}>`).then((c) => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds

        client.emit("playerUpdate", db.get(`player_${player1.id}`))
        client.emit("playerUpdate", db.get(`player_${player2.id}`))

    }
}
