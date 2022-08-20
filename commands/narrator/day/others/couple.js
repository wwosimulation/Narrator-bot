const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // functions

module.exports.getCoupleTargets = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get(`players`) // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const cupids = players.filter((p) => db.get(`player_${p}`).role === "Cupid") // get all cupids - Array<Snowflake>
    const night = db.get(`gamePhase`) / 3 + 1 // get the night info - Number

    if (night !== 1) return true // exit early if night isn't night 1

    // loop through each cupid (Usually there's one, but just in case there's a crazy gamemode)
    for (const cupid of cupids) {
        let lovemaker = db.get(`player_${cupid}`) // get the cupid object - Object

        // check if the cupid had not set any lovers, or there aren't enough alive players
        if (!lovemaker.target || lovemaker.target?.filter((p) => alivePlayers.includes(p))?.length < 2) {
            // assign the targets
            let target = lovemaker.target?.filter((t) => db.get(`player_${t}`)).filter((t) => db.get(`player_${t}`).status === "Alive") || []

            // check how many players are there
            if (target.length === 1) {
                // if there is only 1 couple alive, assign a random target
                let newTarget = players.filter((t) => db.get(`player_${t}`).status === "Alive" && !["Cupid", "President"].includes(db.get(`player_${t}`).role) && t !== target[0])

                // check if there aren't any valid targets
                if (newTarget.length === 0) {
                    // get the channel and send the unsuccesful message
                    let channel = guild.channels.cache.get(lovemaker.channel) // get the message
                    await channel.send(`${getEmoji("lovers", client)} There were not enough valid roles to make your couple!`) // send the unsuccessful message
                    await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // ping the player
                    break
                } else {
                    // get a new couple
                    let theCouple = newTarget[Math.floor(Math.random() * target.length)] // get a random player
                    target.push(theCouple) // push into the array
                    db.set(`player_${lovemaker.id}.target`, target) // assign the cupid's target as the current one.
                }
            } else {
                // so both couple died

                // filter the current players and see if there are any eligible targets
                let newTarget = players.filter((t) => db.get(`player_${t}`).status === "Alive" && !["Cupid", "President"].includes(db.get(`player_${t}`).role) && t !== target[0])

                // check if there aren't enough valid targets
                if (newTarget.length < 2) {
                    // get the channel and send the unsuccesful message
                    let channel = guild.channels.cache.get(lovemaker.channel) // get the message
                    await channel.send(`${getEmoji("lovers", client)} There were not enough valid roles to make your couple!`) // send the unsuccessful message
                    await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // ping the player
                    break
                } else {
                    // noice there were enough targets

                    // get a new couple
                    let theFirstCouple = newTarget[Math.floor(Math.random() * target.length)] // get a random player
                    let theSecondCouple = newTarget.filter((d) => d !== theFirstCouple)[Math.floor(Math.random() * target.length)] // get a random player

                    // push the couple into the array
                    target.push(theFirstCouple) // push the first couple
                    target.push(theSecondCouple) // push the second couple
                    db.set(`player_${lovemaker.id}.target`, target) // assign the cupid's target as the current one.
                }
            }
        }
    }
}

module.exports.couple = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get(`players`) // get the players array - Array<Snowflake>
    const cupids = players.filter((p) => db.get(`player_${p}`).role === "Cupid") // get all cupids - Array<Snowflake>
    const night = db.get(`gamePhase`) / 3 + 1 // get the night info - Number

    if (night !== 1) return true // exit early if night isn't night 1

    // loop through each cupid
    for (const cupid of cupids) {
        let lovemaker = db.get(`player_${cupid}`) // get the couple - Array<Snowflake>

        // send a message to both players
        let couple1 = db.get(`player_${lovemaker.target[0]}`) // get the first couple player
        let couple2 = db.get(`player_${lovemaker.target[1]}`) // get the second couple player
        let channel = guild.channels.cache.get(lovemaker.channel) // get the cupid's channel
        let channel1 = guild.channels.cache.get(couple1.channel) // get the first couple's channel
        let channel2 = guild.channels.cache.get(couple2.channel) // get the second couple'c channel
        let existingCupids1 = db.get(`player_${couple1.id}`).cupid || [] // get all the existing cupids
        let existingCupids2 = db.get(`player_${couple2.id}`).cupid || [] // get all the existing cupids
        existingCupids1.push(cupid)
        existingCupids2.push(cupid)
        db.set(`player_${couple1.id}.cupid`, existingCupids1)
        db.set(`player_${couple2.id}.cupid`, existingCupids2)
        await channel1.send(`${getEmoji("couple", client)} You are in love with **${players.indexOf(couple2.id) + 1} ${couple2.username} (${getEmoji(couple2.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${couple2.role})**. You win if you stay alive together until the end of the game. You die if your lover dies.`) // sends the love message
        await channel1.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings the player
        await channel2.send(`${getEmoji("couple", client)} You are in love with **${players.indexOf(couple1.id) + 1} ${couple1.username} (${getEmoji(couple1.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${couple1.role})**. You win if you stay alive together until the end of the game. You die if your lover dies.`) // sends the love message
        await channel2.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings the player
        await channel.send(`${getEmoji("couple", client)} Player **${players.indexOf(couple1.id) + 1} ${couple1.username}** and **${players.indexOf(couple2.id) + 1} ${couple2.username}** are in love!`) // sends the confirmation message

        // remove bomb, douse, corruption, and disguise from the player if their couple is the attacker
        if (["Bomber", "Arsonist", "Illusionist", "Alchemist"].includes(couple1.role) || ["Bomber", "Arsonist", "Illusionist", "Alchemist"].includes(couple2.role)) {
            // now check if the first couple has targetted their second couple
            if (
                couple1.target?.includes(couple2.id) || // check if bomber has placed a bomb on their couple
                couple1.redPotions?.includes(couple2.id) || // check if alchemist has placed a red potion on their couple
                couple2.poisoned?.includes(couple1.id) || // check if bomber has placed a black potion on their couple
                couple1.doused?.includes(couple2.id) || // check if arsonits has placed a douse on their couple
                couple1.disguisedPlayers?.includes(couple2.id) || // check if illusionist disguised their couple
                couple1.hackedPlayers?.includes(couple2.id) // check if hackers have hacked their target
            ) {
                // send a message regarding the action of canceling their abilities on thier couple
                await channel1.send(`${getEmoji("couple", client)} Since you have unconditional love with player **${players.indexOf(couple2.id) + 1} ${couple2.username}**, you decided to cancel your action on this player.`)
                await channel1.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)

                // revert their actions
                switch (couple1.role) {
                    case "Alchemist": {
                        let poisoned = db.get(`player_${couple2.id}.posioned`) || [] // gets all the alchemist who poisoned them
                        let redPotions = db.get(`player_${couple1.id}.redPotions`) || [] // gets all the red potion
                        if (poisoned?.includes(couple1.id)) {
                            delete poisoned[poisoned.indexOf(couple1.id)] // deletes the alchemist's couple's potion
                            db.set(`player_${couple2.id}.poisoned`, poisoned.filter(Boolean)) // deletes the black potion on the player
                        } else if (redPotions.includes(couple2.id)) {
                            delete redPotions[redPotions.indexOf(couple2.id)] // deletes the alchemist's couple's potion
                            db.set(`player_${couple1.id}.redPotions`, redPotions.filter(Boolean)) // deletes the black potion on the player
                        }
                        break
                    }
                    case "Arsonist": {
                        let douses = db.get(`player_${couple1.id}.douses`) || [] // gets all the douses
                        delete douses[douses.indexOf(couple2.id)] // deletes the arsonist's couple's douse
                        db.set(`player_${couple1.id}.douses`, douses.filter(Boolean)) // deletes the douse on the player
                        break
                    }
                    case "Bomber": {
                        let bombs = db.get(`player_${couple1.id}.target`) || [] // gets all the bombs
                        delete bombs[bombs.indexOf(couple2.id)] // deletes the bombers's couple's bombs
                        db.set(`player_${couple1.id}.target`, bombs.filter(Boolean)) // deletes the bomb on the player
                        break
                    }
                    case "Hacker": {
                        let hackedPlayers = db.get(`player_${couple1.id}.hackedPlayers`) || [] // get all the hacked players
                        delete hackedPlayers[hackedPlayers.indexOf(couple2.id)]
                        db.set(`player_${couple1.id}.hackedPlayers`, hackedPlayers.filter(Boolean)) // deletes the hacked player
                        break
                    }
                    case "Illusionist": {
                        let disguises = db.get(`player_${couple1.id}.disguisedPlayers`) || [] // // gets all the disguises
                        delete disguises[disguises.indexOf(couple2.id)] // // deletes the illusionist's couple's disguise
                        db.set(`player_${couple1.id}.disguisedPlayers`, disguises) // deletes the disguise on the player
                        let allIllus = players.filter((p) => db.get(`player_${p}`).role === "Illusionist" && db.get(`player_${p}`).status === "Alive") // get all the alive illusionist

                        // check if there are any other illusionist disguising this player
                        if (
                            !allIllus
                                .map((p) => db.get(`player_${p}`).disguisedPlayers)
                                .join(",")
                                .split(",")
                                .includes(couple2.id)
                        ) {
                            db.delete(`player_${couple2.id}.disguised`) // delete the disguise on the player
                        }
                    }
                }
            }

            // now check if the second couple has targetted their first couple
            if (
                couple2.target?.includes(couple1.id) || // check if bomber has placed a bomb on their couple
                couple2.redPotions?.includes(couple1.id) || // check if alchemist has placed a red potion on their couple
                couple1.poisoned?.includes(couple2.id) || // check if bomber has placed a black potion on their couple
                couple2.doused?.includes(couple1.id) || // check if arsonits has placed a douse on their couple
                couple2.disguisedPlayers?.includes(couple1.id) || // check if illusionist disguised their couple
                couple2.hackedPlayers?.includes(couple1.id) // check if hackers have hacked their target
            ) {
                // send a message regarding the action of canceling their abilities on thier couple
                await channel2.send(`${getEmoji("couple", client)} Since you have unconditional love with player **${players.indexOf(couple2.id) + 1} ${couple2.username}**, you decided to cancel your action on this player.`)
                await channel2.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)

                // revert their actions
                switch (couple2.role) {
                    case "Alchemist": {
                        let poisoned = db.get(`player_${couple1.id}.posioned`) || [] // gets all the alchemist who poisoned them
                        let redPotions = db.get(`player_${couple2.id}.redPotions`) || [] // gets all the red potion
                        if (poisoned?.includes(couple2.id)) {
                            delete poisoned[poisoned.indexOf(couple2.id)] // deletes the alchemist's couple's potion
                            db.set(`player_${couple1.id}.poisoned`, poisoned.filter(Boolean)) // deletes the black potion on the player
                        } else if (redPotions.includes(couple1.id)) {
                            delete redPotions[redPotions.indexOf(couple1.id)] // deletes the alchemist's couple's potion
                            db.set(`player_${couple2.id}.redPotions`, redPotions.filter(Boolean)) // deletes the black potion on the player
                        }
                        break
                    }
                    case "Arsonist": {
                        let douses = db.get(`player_${couple2.id}.douses`) || [] // gets all the douses
                        delete douses[douses.indexOf(couple1.id)] // deletes the arsonist's couple's douse
                        db.set(`player_${couple2.id}.douses`, douses.filter(Boolean)) // deletes the douse on the player
                        break
                    }
                    case "Bomber": {
                        let bombs = db.get(`player_${couple2.id}.target`) || [] // gets all the bombs
                        delete bombs[bombs.indexOf(couple1.id)] // deletes the bombers's couple's bombs
                        db.set(`player_${couple2.id}.target`, bombs.filter(Boolean)) // deletes the bomb on the player
                        break
                    }
                    case "Hacker": {
                        let hackedPlayers = db.get(`player_${couple2.id}.hackedPlayers`) || [] // get all the hacked players
                        delete hackedPlayers[hackedPlayers.indexOf(couple1.id)]
                        db.set(`player_${couple2.id}.hackedPlayers`, hackedPlayers.filter(Boolean)) // deletes the hacked player
                        break
                    }
                    case "Illusionist": {
                        let disguises = db.get(`player_${couple2.id}.disguisedPlayers`) || [] // // gets all the disguises
                        delete disguises[disguises.indexOf(couple1.id)] // // deletes the illusionist's couple's disguise
                        db.set(`player_${couple2.id}.disguisedPlayers`, disguises) // deletes the disguise on the player
                        let allIllus = players.filter((p) => db.get(`player_${p}`).role === "Illusionist" && db.get(`player_${p}`).status === "Alive") // get all the alive illusionist

                        // check if there are any other illusionist disguising this player
                        if (
                            !allIllus
                                .map((p) => db.get(`player_${p}`).disguisedPlayers)
                                .join(",")
                                .split(",")
                                .includes(couple1.id)
                        ) {
                            db.delete(`player_${couple1.id}.disguised`) // delete the disguise on the player
                        }
                    }
                }
            }
        }
    }
}
