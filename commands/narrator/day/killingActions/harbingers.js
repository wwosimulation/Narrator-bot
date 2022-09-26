const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // functions
const doctor = require("./protection/doctor.js") // doctor protection
const nightwatchman = require("./protection/nightWatchmen.js") // night watchman protection
const beastHunter = require("./protection/beastHunter.js") // beast hunter protection
const witch = require("./protection/witch.js") // witch protection
const jailer = require("./protection/jailer.js") // jailer protection
const redLady = require("./protection/redLady.js") // red lady protection
const bodyguard = require("./protection/bodyguard.js") // bodyguard protection
const toughGuy = require("./protection/toughGuy.js") // tough guy protection
const forger = require("./protection/forger.js") // forger protection
const ghostLady = require("./protection/ghostLady.js") // ghost lady protection
const trapper = require("./protection/trapper.js") // trapper protection
const stubbornWerewolves = require("./protection/stubbornWolves.js") // stubborn ww
const surrogate = require("./protection/surrogate.js") // surrogate

async function getProtections(client, guy, attacker) {
    let getResult

    // check if the player they are attacking is healed by the beast hunter
    getResult = await beastHunter(client, guy, attacker) // checks if a beast hunter has a trap on them
    if (getResult === true) return false // exits early if a beast hunter DOES have a trap on them

    // check if the player they are attacking is saved by the trapper
    getResult = await trapper(client, guy, attacker)
    if (getResult === true) return false // exits early if a trapper DOES have a trap on them

    // check if the player they are attacking is jailed
    getResult = await jailer(client, guy, attacker) // checks if they are jailed
    if (getResult === true) return false // exits early if they are jailed

    // check if the player they are attacking is healed by the ghost lady
    getResult = await ghostLady(client, guy, attacker) // checks if a ghost lady is protecting them
    if (getResult === true) return false // exits early if a ghost lady IS protecting them

    // check if the player they are attacking is healed by the doctor
    getResult = await doctor(client, guy, attacker) // checks if a doctor is protecting them
    if (getResult === true) return false // exits early if a doctor IS protecting them

    // check if the player they are attacking is healed by the night watchman
    getResult = await nightwatchman(client, guy, attacker) // checks if a night watchman is protecting them
    if (getResult === true) return false // exits early if a night watchman IS protecting them

    // check if the player they are attacking is healed by the witch
    getResult = await witch(client, guy, attacker) // checks if a witch is protecting them
    if (getResult === true) return false // exits early if a witch IS protecting them

    // check if the player they are attacking is healed by the bodyguard
    getResult = await bodyguard(client, guy, attacker) // checks if a bodyguard is protecting them
    if (getResult === true) return false // exits early if a bodyguard IS protecting them

    // check if getResult isn't an object
    if (typeof getResult !== "object") {
        // check if the player they are attacking is healed by the tough guy
        getResult = await toughGuy(client, guy, attacker) // checks if a tough guy is protecting them
        if (getResult === true) return false // exits early if a tough guy IS protecting them

        // check if the player they are attacking is protected by their surrogate
        getResult = await surrogate(client, guy, attacker) // checks if a surrogate is prorecting them
        if (typeof getResult === "object") return getResult // exits early if a surrogate IS protecting them

        // check if the player they are attacking is a red lady that got away visiting someone else
        getResult = await redLady(client, guy, attacker) // checks if the red lady is not home
        if (getResult === true) return false // exits early if the red lady IS not home

        // check if the player they are protecting has the forger's sheild
        getResult = await forger(client, guy) // checks if the player has the forger's sheild
        if (getResult === true) return false // exits early if the player DOES have the forger's sheild

        // check if the player is stubborn wolf that has 2 lives
        getResult = await stubbornWerewolves(client, guy) // checks if the player is stubborn wolf and has 2 lives
        if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
    }

    return typeof getResult === "object" ? getResult : guy // looks like there were no protections
}

module.exports.killDoomed = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const doomedPlayers = alivePlayers.filter((p) => db.get(`player_${p}`).doomed === true) // get all the doomed players array - Array<Snowflake>

    for (const p of doomedPlayers) {
        let guy = db.get(`player_${p}`)
        let role = guy.role
        if (guy.tricked) role = "Wolf Trickster"
        let attackedPlayer = await guild.members.fetch(guy.id) // fetch the discord member - Object
        let attackedPlayerRoles = attackedPlayer.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get all the roles and replace the Alive role with Dead.
        await attackedPlayer.roles.set(attackedPlayerRoles) // removes the Alive and adds the Dead discord role
        await dayChat.send(`${getEmoji("doom", client)} **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** has been doomed by the Harbinger!`)
        db.delete(`player_${guy.id}.doomAttacker`)
        db.set(`player_${guy.id}.status`, "Dead")
        client.emit("playerKilled", db.get(`player_${guy.id}`), db.get(`player_${guy.doomAttacker}`))
    }
}

module.exports.action = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const harbingers = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Harbinger") // get the alive Harbingers array - Array<Snowflake>

    // loop through each illusionist
    for (let hb of harbingers) {
        let attacker = db.get(`player_${hb}`) // the attacker object - Object

        // check if the illu has a target
        if (attacker.target) {
            // delete the target
            db.delete(`player_${hb}.target`) // don't worry, this won't affect the current target

            let guy = db.get(`player_${attacker.target}`)

            // check if the illu's target is alive
            if (guy.status === "Alive" && !guy.doomed) {
                // check if harbinger's ability type is herald or doom

                if (attacker.abilityType === "doom") {
                    // check for any protections
                    let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>

                    let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object

                    // check if the result type is an object - indicating that there were no protections

                    if (typeof result === "object") {
                        // send a succesful message to the illusionist
                        await channel.send(`${getEmoji("doom", client)} Player **${players.indexOf(result.id) + 1} ${result.username}** is now doomed!`)

                        let channel2 = guild.channels.cache.get(result.channel)
                        await channel2.send(`${getEmoji("doom", client)} You have been doomed by the Harbinger. You cannot use your abilities and will die before voting starts.`)

                        // set the database
                        db.set(`player_${result.id}.doomed`, true) // set the player as doomed
                        db.set(`player_${result.id}.doomAttacker`, attacker.id)
                    } else {
                        // otherwise they were protected

                        await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** could not be doomed!`) // sends an error message
                        await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings the player in the channel
                    }
                } else {
                    let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object

                    let role = guy.role
                    if (guy.disguised === true) role === "Illusionist"
                    if (guy.shamaned) role = "Wolf Shaman"
                    if (guy.role === "Sorcerer") role = guy.fakeRole
                    if (guy.role === "Wolf Trickster" && guy.trickedRole) role = guy.trickedRole.role

                    channel.send(`${getEmoji("herald", client)} You checked **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`)
                }
            }
        }
    }

    return true // exit early
}
