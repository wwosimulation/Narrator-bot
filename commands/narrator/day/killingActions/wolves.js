const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // functions
const doctor = require("./protection/doctor.js") // doctor protection
const beastHunter = require("./protection/beastHunter.js") // beast hunter protection
const witch = require("./protection/witch.js") // witch protection
const jailer = require("./protection/jailer.js") // jailer protection
const redLady = require("./protection/redLady.js") // red lady protection
const bodyguard = require("./protection/bodyguard.js") // bodyguard protection
const toughGuy = require("./protection/toughGuy.js") // tough guy protection
const forger = require("./protection/forger.js") // forger protection
const ghostLady = require("./protection/ghostLady.js") // ghost lady protection
const trapper = require("./protection/trapper.js") // trapper protection

let attackedByBeastHunter = false
let attackedByTrapper = false
let confirmedWeakestWolf = false
let newkwwdied = false

async function getProtections(client, guy, attacker) {
    let getResult

    // check if the player they are attacking is healed by the beast hunter
    getResult = await beastHunter(client, guy, attacker) // checks if a beast hunter has a trap on them
    if (getResult === true) {
        attackedByBeastHunter = true
        return false
    } // exits early if a beast hunter DOES have a trap on them

    getResult = await trapper(client, guy, attacker) // checks if a trapper has a trap on them
    if (getResult === true) {
        attackedByTrapper = true
        return false
    } // exits early if a trapper DOES have a trap on them

    // check if the player they are attacking is jailed
    getResult = await jailer(client, guy, attacker) // checks if they are jailed
    if (getResult === true) return false // exits early if they are jailed

    // check if the player they are attacking is healed by the ghost lady
    getResult = await ghostLady(client, guy, attacker) // checks if a ghost lady is protecting them
    if (getResult === true) return false // exits early if a ghost lady IS protecting them

    // check if the player they are attacking is healed by the doctor
    getResult = await doctor(client, guy, attacker) // checks if a doctor is protecting them
    console.log(`Protection results: ${getResult}`)
    if (getResult === true) return false // exits early if a doctor IS protecting them

    // check if the player they are attacking is healed by the witch
    getResult = await witch(client, guy, attacker) // checks if a witch is protecting them
    if (getResult === true) return false // exits early if a witch IS protecting them

    // check if the player they are attacking is healed by the bodyguard
    getResult = await bodyguard(client, guy, attacker) // checks if a bodyguard is protecting them
    if (getResult === true) return false // exits early if a bodyguard IS protecting them

    // check if getResult isn't an object
    if (typeof getResult !== "object" || (typeof getResult === "object" && getResult.id === guy.id)) {
        // check if the player they are attacking is healed by the tough guy
        getResult = await toughGuy(client, guy, attacker) // checks if a tough guy is protecting them
        if (getResult === true) return false // exits early if a tough guy IS protecting them

        // check if the player they are attacking is a red lady that got away visiting someone else
        getResult = await redLady(client, guy, attacker) // checks if the red lady is not home
        if (getResult === true) return false // exits early if the red lady IS not home

        // check if the player they are protecting has the forger's sheild
        getResult = await forger(client, guy) // checks if the player has the forger's sheild
        if (getResult === true) return false // exits early if the player DOES have the forger's sheild
    }

    return typeof getResult === "object" ? getResult : guy // looks like there were no protections
}

module.exports.wolves = async (client, alivePlayersBefore) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const kwwDied = db.get(`kittenWolfConvert`)
    const strongWolves = {
        Werewolf: 1,
        "Junior Werewolf": 2,
        "Split Wolf": 2,
        "Kitten Wolf": 2,
        "Wolf Shaman": 3,
        "Nightmare Werewolf": 3,
        "Voodoo Werewolf": 3,
        "Wolf Trickster": 3,
        "Wolf Pacifist": 4,
        "Guardian Wolf": 4,
        "Shadow Wolf": 5,
        "Werewolf Berserk": 5,
        "Alpha Werewolf": 6,
        "Stubborn Werewolf": 6,
        "Wolf Seer": 7,
        "Lone Wolf": 8,
    } // list the wolves from weakest to strongest

    let votes = {} // make an object to store the votes - Object<UserId, Vote>
    let toKill = "0" // store a player to kill, in string - String

    // get the wekeast wolf in game
    let mappedWolf = alivePlayersBefore.filter((a) => db.get(`player_${a}`).role?.toLowerCase().includes("wolf") && db.get(`player_${a}`).role !== "Werewolf Fan").map((a) => [a, db.get(`player_${a}`).role]) // fillter the wolves and check if there are any

    if (mappedWolf.length === 0) return toKill // exit early if no wolf was found

    let sortedWolves = mappedWolf.length === 1 ? mappedWolf : mappedWolf.sort((a, b) => strongWolves[a[1]] - strongWolves[b[1]]) // sort the wolves from weakest to strongest

    console.log(sortedWolves)

    let weakestWolf = mappedWolf.filter((w) => strongWolves[w[1]] === strongWolves[sortedWolves[0][1]]) // get all players with the same wolf rank

    console.log(weakestWolf)

    let attacker = db.get(`player_${weakestWolf[Math.floor(Math.random() * weakestWolf.length)][0]}`) // get the attacker object

    console.log(attacker.role)

    confirmedWeakestWolf = attacker

    // loop through all the alive players and get the votes from werewolves
    alivePlayersBefore.forEach((player) => {
        // check if the player belongs to the werewolf team
        if (db.get(`player_${player}`).team === "Werewolf") {
            votes[player] = db.get(`player_${player}`).vote // adds the vote
            db.delete(`player_${player}.vote`) // delete the votes to reset for the next night
        }
    })

    // define an object to store a key value pair
    let voteObject = {} // normal vote object - Object

    // loop through each vote and add it to the object
    Object.entries(votes).forEach((vote) => {
        if (!voteObject[vote[1]]) voteObject[vote[1]] = 0 // if the key doesn't exist, create one
        voteObject[vote[1]]++ // increment the value by 1 for the key

        // check if the role is Alpha Werewolf
        if (db.get(`player_${vote[0]}`).role === "Alpha Werewolf") {
            voteObject[vote[1]]++ // increment the value again since the alpha werewolf has double votes
        }
    })

    // make a 2d array with [vote, quantity] pair and sort them
    let totalVotes = Object.entries(voteObject).sort((a, b) => b[1] - a[1]) // makes a 2d array, ands sorts them by vote count

    // check if there are more than 0 votes
    if (totalVotes.length > 0) {
        // check if there are more than 1 vote
        if (totalVotes.length === 1) toKill = totalVotes[0][0]

        // check if there is a tied voted
        if (totalVotes.length > 1 && totalVotes[0][1] === totalVotes[1][1]) {
            let allSameVotes = totalVotes.filter((v) => v[1] === totalVotes[0][1]) // filter to only votes that are tied
            let filteredVotes = Object.entries(votes).filter((x) => allSameVotes.map((a) => a[0]).includes(x[1])) // get the votes in an array but filtered
            let wolvesRank = filteredVotes.map((x) => db.get(`player_${x[0]}`).role) // get all werewolves' role

            // sort the wolves in wolvesRank from strongest to weakest
            let sortedWolves = wolvesRank.map((a) => [strongWolves[a], a]).sort((a, b) => b[0] - a[0]) // we map the wolves into numbers, then sort the numbers from big to small

            // check if the first and second wolf number is same
            if (sortedWolves.length > 1 && sortedWolves[0][0] === sortedWolves[1][0]) {
                // get the last strongest wolf who votes the player
                toKill = Object.entries(votes)
                    .filter((v) => strongWolves.indexOf(db.get(`player_${v[0]}`).role) === sortedWolves[0][0])
                    .pop()[1] // gets the last strongest werewolf who voted
            } else {
                // get the voted player by the strongest wolf
                toKill = Object.entries(votes)
                    .filter((v) => db.get(`player_${v[0]}`).role === sortedWolves[0][1])
                    .pop()[1] // gets the strongest werewolf who voted
            }
        } else {
            // so there were more votes to kill this player instead
            toKill = totalVotes[0][0]
        }

        let guy = db.get(`player_${toKill}`) || { status: "Dead" } // get the user for the voted player

        if (guy.status === "Alive") {
            // protection part

            // check if kwwDied and check if they do not belong to the village or are the headhunter's target
            if (kwwDied === true || guy.role === "Cursed" || guy.role === "Werewolf Fan") {
                // conversion

                if (kwwDied === true) db.delete(`isBerserkActive`) // disable berserk

                let headhunterTargets = [] // an array of headhunter targets to be put in - Array<Snowflake>

                // get all the headhunter targets
                alivePlayers.forEach((player) => {
                    // check if their role is Headhunter
                    if (db.get(`player_${player}`).role === "Headhunter") {
                        headhunterTargets.push(db.get(`player_${player}`).target) // adds the headhunter's target to the list
                    }
                })

                // check if they are a headhunter's target or do not belong to the village team
                if ((guy.team !== "Village" && guy.role !== "Werewolf Fan") || headhunterTargets.includes(guy.id) || typeof guy.sected === "string" || guy.bitten === true || ["Bandit", "Corruptor", "Cannibal", "Illusionist", "Serial Killer", "Arsonist", "Bomber", "Alchemist", "Hacker", "Dreamcatcher", "Wise Man"].includes(guy.role)) {
                    // check if the player is not from the village

                    // send a fail message since they do not belong to the village or are the headhunter's target
                    await werewolvesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** couldn't be converted into a Werewolf! They were either protected, aren't from the Village, or they are a Headhunter's target.`) // send an unsuccesful message
                    await werewolvesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // ping the wolves in their chat
                } else {
                    // protection time
                    let result = await getProtections(client, guy, attacker)

                    if (typeof result === "object") {
                        await require("./kittenWolf.js")(client, guy.id) // call this method to make new channels for a player being converted to a wolf
                    } else {
                        await werewolvesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** couldn't be converted into a Werewolf! They were either protected, aren't from the Village, or they are a Headhunter's target.`) // send an unsuccessful message
                        await werewolvesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // ping the wolves in their chat
                    }
                }
            } else {
                // regular kill

                // check if they are a solo killer
                if (["Bandit", "Corruptor", "Cannibal", "Illusionist", "Serial Killer", "Arsonist", "Bomber", "Alchemist", "Hacker", "Dreamcatcher", "Wise Man"].includes(guy.role)) {
                    await werewolvesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** couldn't be killed!`) // send an unsuccessful message
                    await werewolvesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // ping the wolves in their chat
                } else {
                    // check for protections
                    let result = await getProtections(client, guy, attacker)

                    console.log(result)
                    if (typeof result === "object") {
                        // looks like there were no protections

                        // kill the player

                        db.set(`player_${result.id}.status`, "Dead") // set the player status to Dead
                        client.emit("playerKilled", db.get(`player_${result.id}`), attacker, { trickster: false })
                        let member = await guild.members.fetch(result.id) // get the discord member
                        let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get the discord roles
                        await dayChat.send(`${getEmoji("werewolf", client)} The Werewolves killed **${players.indexOf(result.id) + 1} ${result.username} (${getEmoji(result.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${result.role})**`)
                        await member.roles.set(memberRoles)

                        // check if berserk is active
                        if (db.get(`isBerserkActive`)) {
                            let allProtectors = db.get(`berserkProtected`) || []

                            allProtectors.forEach(async (protector) => {
                                let protectionPlayer = db.get(`player_${player}`) || { status: "Dead" }

                                if (protectionPlayer.status === "Alive") {
                                    db.set(`player_${protectionPlayer.id}.status`, "Dead") // set the player status to Dead
                                    client.emit("playerKilled", db.get(`player_${protectionPlayer.id}`), attacker, { trickster: false })
                                    let memberP = await guild.members.fetch(protectionPlayer.id) // get the discord member
                                    let memberRolesP = memberP.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get the discord roles
                                    await dayChat.send(`${getEmoji("frenzy", client)} The werewolf frenzy killed **${players.indexOf(protectionPlayer.id) + 1} ${protectionPlayer.username} (${getEmoji(protectionPlayer.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${protectionPlayer.role})**`)
                                    await memberP.roles.set(memberRolesP)
                                }
                            })

                            db.delete(`berserkProtected`)
                        }
                    } else {
                        await werewolvesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** couldn't be killed!`) // send an unsuccessful message
                        await werewolvesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // ping the wolves in their chat
                    }
                }
            }
        }
    }

    if (kwwDied === true) db.delete(`kittenWolfConvert`)
    if (newkwwdied === true) db.set(`kittenWolfConvert`, true)

    return true
}

module.exports.beastHunterKilling = async (client) => {
    // check if the wolves were attacked by beast hunter
    if (attackedByBeastHunter === true && confirmedWeakestWolf !== false) {
        // kill the weakest wolf
        const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
        const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // gets the day chat channel
        const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
        const attackerMember = await guild.members.fetch(confirmedWeakestWolf.id) // get the discord member
        const allAttackerRoles = attackerMember.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the roles from the member

        // check if the attacker is alive
        if (confirmedWeakestWolf.status === "Alive") {
            // kill the wolf
            db.set(`player_${confirmedWeakestWolf.id}.status`, "Dead") // makes the attacker dead
            await dayChat.send(`${getEmoji("trap", client)} The Beast Hunter's trap killed **${players.indexOf(confirmedWeakestWolf.id) + 1} ${confirmedWeakestWolf.username} (${getEmoji(confirmedWeakestWolf.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${confirmedWeakestWolf.role})**!`)
            await attackerMember.roles.set(allAttackerRoles) // set the role
        }
    }
}

module.exports.trapperKilling = async (client) => {
    // check if the wolves were attacked by trapper
    if (attackedByTrapper === true && confirmedWeakestWolf !== false) {
        // kill the weakest wolf
        const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
        const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // gets the day chat channel
        const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
        const attackerMember = await guild.members.fetch(confirmedWeakestWolf.id) // get the discord member
        const allAttackerRoles = attackerMember.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the roles from the member

        // check if the attacker is alive
        if (confirmedWeakestWolf.status === "Alive") {
            // kill the wolf
            db.set(`player_${confirmedWeakestWolf.id}.status`, "Dead") // makes the attacker dead
            await dayChat.send(`${getEmoji("trap", client)} The Trapper's trap killed **${players.indexOf(confirmedWeakestWolf.id) + 1} ${confirmedWeakestWolf.username} (${getEmoji(confirmedWeakestWolf.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${confirmedWeakestWolf.role})**!`)
            await attackerMember.roles.set(allAttackerRoles) // set the role
        }
    }
}

module.exports.triggerKittenWolf = async (client) => {
    newkwwdied = true
    if (!db.get(`kittenWolfConvert`)) {
        db.set(`kittenWolfConvert`, true)
        console.log("KITTEN WOLF TRIGGRED")
    }
}
