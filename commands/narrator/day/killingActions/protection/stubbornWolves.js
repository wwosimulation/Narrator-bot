const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../../config") // functions

module.exports = async (client, guy) => {
    if (typeof guy !== "object") return false // makes sure if "guy" and "attacker" is an object, otherwise exit early

    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat")
    let isProtected = false

    if (guy.role === "Stubborn Werewolf") {
        if (guy.lives === 2) {
            let channel = guild.channels.cache.get(guy.channel)
            await dayChat.send(`${getEmoji("stubborn_werewolf", client)} The Stubborn Werewolf has been attacked! The next attack will be fatal.`)
            await channel.send(`${getEmoji("stubborn_werewolf", client)} You have been attacked! Your next attack will be fatal.`)
            await channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
            isProtected = true
        }
    }

    // return the isProtected value
    return isProtected
}
