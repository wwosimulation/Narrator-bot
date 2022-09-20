const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const jailedChat = guild.channels.cache.find((c) => c.name === "jailed-chat")
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
    const surrogates = alivePlayers.filter((p) => ["Surrogate"].includes(db.get(`player_${p}`).role)) // get the alive surrogate array - Array<Snowflake>
    

    for (let sg of surrogates) {

        let surro = db.get(`player_${sg}`)

        if (surro.target) {
            
            let target = db.get(`player_${surro.target}`)

            if (surro.protectAt + 5 === db.get(`gamePhase`)) {
                
                db.subtract(`player_${sg}.uses`, 1)

                if (target.status === "Alive") {

                    let channel = guild.channels.cache.get(surro.channel)

                    let components = [{ type: 1, components: [{ type: 2, style: 3, label: "Protect", custom_id: "surr_protect" }, { type: 2, style: 4, label: "Kill and steal", custom_id: "surr_kill" }] }]

                    await channel.send({ content: `${getEmoji("surrogate", client)} You have completed your job as a Surrogate by protecting your target for 2 days! You can now choose to protect them by giving a shield or by killing them and taking their role. Please note that if the player you try to kill is not a villager, you will die and reveal your target's role.`, components })

                }

            }
        }
    }
}
