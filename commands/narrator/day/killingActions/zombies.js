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

module.exports = async (client, alivePlayersBefore) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
    const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")
    const zombiesChat = guild.channels.cache.find((c) => c.name === "zombies-chat") // get the zombies channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const zombies = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Zombie") // get the alive Zombie array - Array<Snowflake>
    const bitten = alivePlayers.filter((p) => db.get(`player_${p}`).bitten === true) // get all the valid bitten players - Array<Snowflake>
    const proggies = players.filter((p) => db.get(`player_${p}`).role === "Prognosticator") // get all the prognosticators

    // convert all zombies
    for (let bite of bitten) {
        // check if the prognosticator peace is active, and if so do not convert anyone
        if (proggies.map((p) => db.get(`player_${p}`)).filter((a) => a.peace === true).length > 0) break

        let guy = db.get(`player_${bite}`)

        // check if the zombie(s) who bit them are alive
        if (guy.bittenBy.filter((p) => alivePlayersBefore.includes(p)).length > 0) {
            // convert the player, yay

            // set the previous roles
            let previousRoles = guy.allRoles || [guy.role]
            previousRoles.push("Zombie")
            db.set(`player_${guy.id}.allRoles`, previousRoles)

            let channel = guild.channels.cache.get(guy.channel)

            await zombiesChat.permissionOverwrites.create(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })

            await channel.edit({ name: "priv-zombie" }) // edit the channel name

            await channel.bulkDelete(100)

            await channel.send(getRole("zombie").description).then(async (c) => {
                await c.pin()
                await c.channel.bulkDelete(1)
            }) // sends the description, pins the message and deletes the last message
            await channel.send(`<@${result.id}>`).then((c) => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds

            db.set(`player_${guy.id}.role`, "Zombie") // changes the player's role in the database
            db.set(`player_${guy.id}.team`, "Zombie") // changes the player's team in the database
            db.set(`player_${guy.id}.bittenAt`, db.get(`gamePhase`)) // set when they were turned
            db.delete(`player_${guy.id}.bitten`) // delete the bitten database since player is converted
            db.delete(`player_${guy.id}.bittenBy`) // delete this since player is converted

            // send a message to the bandits chat
            await zombiesChat.send(`${getEmoji("zombie", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** is now a zombie.`) // sends a message
            client.emit("playerUpdate", db.get(`player_${guy.id}`))
        }
    }

    // loop through each zombie
    for (let zomb of zombies) {
        let attacker = db.get(`player_${zomb}`) // the attacker object - Object

        // check if the zombie has a target
        if (attacker.target) {
            // delete the target
            db.delete(`player_${zomb}.target`) // don't worry, this won't affect the current target

            let guy = db.get(`player_${attacker.target}`)

            // check if the zombie's target is alive
            if (guy.status === "Alive") {
                // check for any protections

                // check if they tried converting non-village
                if ((guy.team !== "Village" && !["Fool", "Headhunter"].includes(guy.role)) || typeof guy.sected === "string" || guy.role === "Cursed" || guy.role === "President") {
                    await zombiesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** could not be converted!`) // sends an error message
                    await zombiesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings the player in the channel

                    // check if the player they bit is a wolf, and check if they aren't the original zombie
                    if (guy.team === "Werewolf" && ["Werewolf Fan", "Sorcerer"].includes(guy.role) && attacker.isOriginal !== true) {
                        // kill the damn player
                        db.set(`player_${attacker.id}.status`, "Dead")
                        client.emit("playerKilled", db.get(`player_${attacker.id}`), attacker)
                        let member = await guild.members.fetch(attacker.id) // get the discord member
                        let memberRoles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)) // get the roles of the member
                        await dayChat.send(`${getEmoji("bitten", client)} Player **${players.indexOf(attacker.id) + 1} ${attacker.username} (${getEmoji("zombie", client)} Zombie)** tried biting a werewolf and died.`) // sends the message
                        await member.roles.set(memberRoles) // set the roles
                    }
                } else {
                    let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>

                    // check if the result type is an object - indicating that there were no protections
                    if (typeof result === "object") {
                        db.set(`player_${guy.id}.bitten`, true)

                        let bittenBy = db.get(`player_${guy.id}.bittenBy`) || [] // get the bitten by array
                        bittenBy.push(attacker.id) // push the zombie into the array
                        db.set(`player_${guy.id}.bittenBy`, bittenBy) // set the database

                        await zombiesChat.send(`${getEmoji("bitten", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** has been bitten.`) // sends a succesful message
                    } else {
                        // otherwise they were protected

                        await zombiesChat.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** could not be converted!`) // sends an error message
                        await zombiesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings the player in the channel
                    }
                }
            }
        }
    }

    return true // exit early
}
