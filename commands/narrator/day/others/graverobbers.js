const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
    const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const graverobbers = players.filter((p) => db.get(`player_${p}`).role === "Grave Robber")
    const doppelgangers = players.filter((p) => db.get(`player_${p}`).role === "Doppelganger")

    // loop through each grave robber
    for (const gr of graverobbers) {
        let graver = db.get(`player_${gr}`) // get the grave robber player - Object
        let guy = db.get(`player_${graver.target}`) // get the grave robber's target - Object

        if (guy.status !== "Dead") continue // if the player is not dead, don't do anything and check for the next grave robber

        let channel = guild.channels.cache.get(graver.channel)

        // delete the target since they are getting converted
        db.delete(`player_${gr}.target`)

        // steal the player's role
        Object.entries(guy).forEach((entry) => {
            // copy relevant info from the dead player
            if (!["username", "id", "status", "channel", "allRoles", "target", "corrupted", "sected", "bitten", "couple", "poisoned", "hypnotized", "disguised", "shamanned", "binded"].includes(entry[0])) {
                db.set(`player_${gr}.${entry[0]}`, entry[1])
            }
        })

        // set their previous roles into the database, for logs
        let previousRoles = db.get(`player_${gr}.allRoles`) || ["Grave Robber"] // get their previous roles, if any
        previousRoles.push(db.get(`player_${gr}.role`)) // push them to the array
        db.set(`player_${gr}.allRoles`, previousRoles) // set them into the database

        await channel.edit({ name: `priv-${guy.role.toLowerCase().replace(/\s/g, "-")}` }) // edit the channel name

        await channel.bulkDelete(100)

        await channel.send(getRole(guy.role.toLowerCase().replace(/\s/g, "-")).description).then(async (c) => {
            await c.pin()
            await c.channel.bulkDelete(1)
        }) // sends the description, pins the message and deletes the last message
        await channel.send(`<@${graver.id}>`).then((c) => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds

        if (guy.team === "Werewolf") {
            // give perms to the werewolves' chat
            const wolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat")
            await wolvesChat.send(`${getEmoji("werewolf", client)} Player **${players.indexOf(graver.id) + 1} ${graver.username} (${getEmoji("grave_robber", client)} Grave Robber)** was a grave robber that now took over the role of **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(guy.role?.toLowerCase().replace(/\s/g, "_"))} ${guy.role})**! Welcome them to your team.`) // send a message
            await wolvesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
        } else if (guy.role === "Zombie") {
            // give perms to zombies chat
            const zombChat = guild.channels.cache.find((c) => c.name === "zombies-chat")
            await zombChat.send(`${getEmoji("zombie", client)} Player **${players.indexOf(graver.id) + 1} ${graver.username} (${getEmoji("grave_robber", client)} Grave Robber)** was a grave robber that now took over the role of **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji("zombie", client)} Zombie)**! Welcome them to your team.`) // send a message
            await zombChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
        } else if (guy.role === "Sect Leader") {
            // give perms to sect chat
            const sectChat = guild.channels.cache.get(guy.sectChannel)
            await sectChat.send(`${getEmoji("sect_leader", client)} Player **${players.indexOf(graver.id) + 1} ${graver.username} (${getEmoji("grave_robber", client)} Grave Robber)** was a grave robber that now took over the role of **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji("sect_leader", client)} Sect Leader)**! Welcome them to your team.`) // send a message
            await sectChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
        } else if (guy.role === "Sibling") {
            // give perms to sibling chat
            const sibChat = guild.channels.cache.find((c) => c.name === "siblings-chat")
            await sibChat.send(`${getEmoji("sibling", client)} Player **${players.indexOf(graver.id) + 1} ${graver.username} (${getEmoji("grave_robber", client)} Grave Robber)** was a grave robber that now took over the role of **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji("sibling", client)} Sibling)**! Welcome them to your team.`) // send a message
            await sibChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
        } else if (["Bandit", "Accomplice"].includes(guy.role)) {
            // give perms to zombies chat
            const banditChat = guild.channels.cache.get(guy.banditChannel)
            await banditChat.send(`${getEmoji("zombie", client)} Player **${players.indexOf(graver.id) + 1} ${graver.username} (${getEmoji("grave_robber", client)} Grave Robber)** was a grave robber that now took over the role of **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(guy.role.toLowerCase(), client)} guy.role)**! Welcome them to your team.`) // send a message
            await banditChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
        }
        client.emit("playerUpdate", db.get(`player_${guy.id}`))
    }

    // check all doppelgangers
    for (const dg of doppelgangers) {
        let doppel = db.get(`player_${dg}`) // get the doppelganger player object
        const day = Math.floor(db.get(`gamePhase`) / 3) + 1 // get the current day

        // check if it's day 1
        if (day === 1) {
            // check if the doppelganger has not set their target
            if (!doppel.target) {
                // select a random player for them
                let alivePlayers = players.filter((p) => db.set(`player_${p}`).status === "Alive" && p !== doppel.id)
                let randomPlayer = alivePlayers[Math.random() * alivePlayers.length]
                let channel = message.guild.channels.cache.get(doppel.channel)

                db.set(`player_${doppel.id}.target`, randomPlayer)

                // send a message to the doppelganger
                await channel.send(`${message.guild.roles.cache.find((r) => r.name === "Alive")}`)
                await channel.send(`${getEmoji("copy", client)} Since you did not pick anyone, your target has automatically been chosen! Your target is **${players.indexOf(randomPlayer) + 1} ${db.get(`player_${randomPlayer}`).username}**!`)
            }
        }
    }
}
