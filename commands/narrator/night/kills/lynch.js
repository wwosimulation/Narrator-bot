const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day chat channel - Object
    const protection = require("../others/lynchprotection.js") // get the lynch protection code - Function
    const isShadow = db.get(`game.isShadow`) // check if the shadow wolf has used their ability - Boolean
    const players = db.get(`players`) // get all the players in an array - Array<Snowflake>
    const stubbornWerewolves = require("../../day/killingActions/protection/stubbornWolves.js") // stubborn ww
    const surrogate = require("../../day/killingActions/protection/surrogate.js") // surrogate

    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players in an array - Array<Snowflake>
    let votes = {} // make a key value pair for the votes
    let countedVotes = {} // another key value pair to count the votes

    // loop through each alive player and place their vote in the votes object
    alivePlayers.forEach((player) => {
        // check if the player has voted
        if (db.get(`player_${player}`).vote) votes[player] = db.get(`player_${player}`).vote // add the vote to the votes object
    })

    // loop through all the votes
    Object.entries(votes).forEach((vote) => {
        let player = db.get(`player_${vote[0]}`) // gets the player object - Object

        // add the votes to the countedVotes object
        if (!countedVotes[vote[1]]) countedVotes[vote[1]] = 0 // set the value to 0 if the player hasn't been voted before

        countedVotes[vote[1]] += 1 // add the vote

        if (player.role === "Mayor" && player.revealed === true) countedVotes[vote[1]] += 1 // add another vote if they are a revealed Mayor

        if (player.role === "Preacher" && player.preachVotes) countedVotes[vote[1]] += player.preachVotes // add another vote if the preacher has additional votes

        if (player.bread === true) countedVotes[vote[1]] += 1 // add another vote if they have a bread (given by Baker)

        if (isShadow === true && player.team === "Werewolf") countedVotes[vote[1]] += 1 // add another vote if shadow is on, and they are a Werewolf
    })

    console.log(`See all the results`)
    console.log(`Results:`)
    console.log(countedVotes)

    // now sort the votes
    let sortedVotes = Object.entries(countedVotes).sort((a, b) => b[1] - a[1])

    console.log(`See all the sorted votes`)
    console.log(`Results:`)
    console.log(sortedVotes)

    const condition = db.get(`game.noVoting`) || sortedVotes.length === 0 || sortedVotes[0][1] < Math.floor(alivePlayers.length / 2) || (sortedVotes.length > 1 && sortedVotes[0][1] === sortedVotes[1][1])

    guild.channels.cache.find((c) => c.name === "commands")?.send(`So here are the results:\n\nAlive players: ${alivePlayers.length}\n\nPlayers required to lynch: ${Math.floor(alivePlayers.length / 2)}\n\n${sortedVotes.map((a) => ` - <@${a[0]}> had ${a[1]} votes on them.`).join("\n")}\n\nPlayer who gets killed: ${condition ? "No one" : `<@${sortedVotes[0][0]}>`}`)

    // check if the first 2 votes are same or if there are not enough votes
    if (condition) {
        await dayChat.send(`${getEmoji("votingme", client)} The Villagers couldn't decide on who to lynch!`)
    } else {
        let guy = db.get(`player_${sortedVotes[0][0]}`) // get the player to lynch

        // check if they are a Handsome Prince or an Idiot
        if (["Handsome Prince", "Idiot"].includes(guy.role)) {
            // send the unsuccessful message
            if (guy.role === "Handsome Prince") {
                await dayChat.send(`${getEmoji("votingme", client)} The Villagers tried to lynch **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji("handsome_prince", client)} Handsome Prince)**, but they were too handsome to be killed today.`)
            }
            if (guy.role === "Idiot") {
                await dayChat.send(`${getEmoji("votingme", client)} The Villagers tried to lynch **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji("idiot", client)} Idiot)**, but instead made them lose their ability to vote.`)
                db.set(`player_${guy.id}.lynched`, true) // set the lynched status to true
            }
        } else {
            let result = await protection(client, guy.id) // get the result of the protection

            // if they were protected
            if (result === true) {
                // send the unsuccessful message
                await dayChat.send(`${getEmoji("votingme", client)} The villagers tried to lynch **${players.indexOf(guy.id) + 1} ${guy.username}**, but they were protected!`)
            } else {
                // check if the player is stubborn wolf that has 2 lives
                let getResult = await stubbornWerewolves(client, guy) // checks if the player is stubborn wolf and has 2 lives
                if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                // check if the player they are attacking is protected by their surrogate
                getResult = await surrogate(client, guy, "lynch") // checks if a surrogate is prorecting them
                if (typeof getResult === "object") guy = db.get(`player_${getResult.id}`) // exits early if a surrogate IS protecting them

                // kill the player normally
                db.set(`player_${guy.id}.status`, "Dead") // change the status of the player
                let member = await guild.members.fetch(guy.id) // get the discord member - Object
                let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get the roles of the discord member
                let role = guy.role
                if (guy.tricked) role = "Wolf Trickster"
                await dayChat.send(`${getEmoji("votingme", client)} The Villagers lynched **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`) // send a message to day chat
                await member.roles.set(memberRoles) // set the roles
                client.emit("playerKilled", db.get(`player_${guy.id}`), "village")
            }
        }
    }

    db.delete(`game.noVoting`)
    db.delete(`game.isShadow`)
    db.delete(`game.fog`)
}
