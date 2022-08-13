const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client, alivePlayersBefore) => {
  
    // define all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const bakers = players.filter((p) => db.get(`player_${p}`).role === "Baker" && alivePlayersBefore.includes(p)) // get the alive Bakers array - Array<Snowflake>

    // loop through each baker
    for (const bake of bakers) {
        let baker = db.get(`player_${bake}`) // get the baker player - Object

        db.delete(`player_${bake}.target`) // reset the target (Won't affect the current target, don't worry)

        // check if the baker has a target
        if (baker.target) {
            let guy = db.get(`player_${baker.target}`) // get the player who the baker had selected to give

            // give the player the sword or shield
            db.set(`player_${baker.target}.bread`, true) // give the player the bread

            let channel1 = guild.channels.cache.get(baker.channel) // get the channel of the forger
            let channel2 = guild.channels.cache.get(guy.channel) // get the channel of the player

            // send the messages to the forger and player
            await channel1.send(`${getEmoji(`baker_bread`, client)} Player **${players.indexOf(guy.id)} ${guy.username}** has succesfully recieved your bread!`)
            await channel2.send(`${getEmoji(`baker_bread`, client)} You have recieved a bread from the Baker! This item grants you an additional vote today!`)
            await channel2.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
        }
    }
}
