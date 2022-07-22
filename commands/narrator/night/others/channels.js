const db = require("quick.db")

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get(`players`) // get all the players in an array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players in an array - Array<Snowflake>
    const zombieChat = guild.channels.cache.find((c) => c.name === "zombies") // get the zombie chat channel - Object
    const banditChat = guild.channels.cache.find((c) => c.name === "bandit") // get the bandit chat channel - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day chat channel - Object
    const wwChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves chat channel - Object

    if (db.get(`game.isShadow`)) db.delete(`game.isShadow`)

    // loop through each player
    players.forEach(async (player) => {
        let guy = db.get(`player_${player}`) // get the player object - Object
        let channel = guild.channels.cache.get(guy.channel) // get the player's channel object - Object

        // check if NOT they are nightmared, jailed, or hypnotized
        if (!guy.nightmared || !guy.jailed || !guy.hypnotized) {
            // check if they are a zombie
            if (guy.role === "Zombie") {
                // change the channel's permissions
                zombieChat.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
            } else if (guy.role === "Bandit" || guy.role === "Accomplice") {
                // check if they are a Bandit or an accomplice

                // change the channel's permissions
                banditChat.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
            } else if (guy.team === "Werewolf" && guy.role !== "Sorcerer" && guy.role !== "Werewolf Fan") {
                // check if they are a werewolf

                // change the channel's permissions
                wwChat.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
            }
        }
    })
}
