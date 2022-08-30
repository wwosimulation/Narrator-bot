const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // functions
const beastHunter = require("./protection/beastHunter.js") // beast hunter protection
const jailer = require("./protection/jailer.js") // jailer protection
const trapper = require("./protection/trapper.js") // trapper protection

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

    return guy // looks like there were no protections
}

module.exports = async (client) => {
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const arsonist = alivePlayers.filter((p) => db.get(`player_${p}`).role === "Arsonist") // get the alive Arsonists array - Array<Snowflake>

    // loop through each arsonist
    for (let arso of arsonist) {
        let attacker = db.get(`player_${arso}`) // the attacker object - Object

        // check if the arso has doused someone
        if (attacker.target) {
            // delete the targets
            db.delete(`player_${attacker.id}.target`) // don't worry, this won't affect the current target

            // loop through each douse
            for (let target of attacker.target) {
                let guy = db.get(`player_${target}`)

                // check if the arso's target is alive
                if (guy.status === "Alive") {
                    // check for any protections
                    let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>
                    let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object

                    // check if the result type is an object - indicating that there were no protections
                    if (typeof result === "object") {
                        // douse the players
                        let doused = db.get(`player_${attacker.id}.doused`) || [] // get the doused players
                        doused.push(guy.id) // push the current doused player
                        db.set(`player_${attacker.id}.doused`, doused) // set the new value of the doused players
                        await channel.send(`${getEmoji("doused", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** has been doused.`) // sends a success message
                    } else {
                        // otherwise they were protected

                        await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id) + 1} ${guy.username}** could not be doused!`) // sends an error message
                        await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`) // pings the player in the channel
                    }
                }
            }
        }
    }

    return true // exit early
}
