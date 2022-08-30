const db = require("quick.db")
const jailer = require("../killingActions/protection/jailer")

module.exports = async (client) => {
    // get all the variables
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const players = db.get(`players`) // get all the players in an array - Array<Snowflakes>
    const wwchat = guild.channels.cache.find((c) => c.name === "werewolves-chat")
    const wwvote = guild.channels.cache.find((c) => c.name === "ww-vote")

    let messages = await wwvote.messages.fetch()
    let filteredmsgs = messages.filter((m) => !m.pinned)
    wwvote.bulkDelete(filteredmsgs)

    players.forEach(async (player) => {
        let guy = db.get(`player_${player}`) // get the player object - Object

        db.delete(`player_${guy.id}.jailed`)
        db.delete(`player_${guy.id}.nightmared`)
        db.delete(`player_${guy.id}.hypnotized`)
        db.delete(`player_${guy.id}.vote`)
        db.delete(`wwvotemsgid_${guy.id}`)

        if (guy.team === "Werewolf" && guy.status === "Alive" && !["Werewolf Fan", "Sorcerer"].includes(guy.role)) {
            wwchat.permissionOverwrites.edit(guy.id, { SEND_MESSAGES: false })
        }

        // if the player was nightmared or jailed
        if (guy.nightmared || guy.jailed || guy.hypnotized) {
            // unlock their channel
            let channel = guild.channels.cache.get(guy.channel) // gets the channel

            // edit the permissions of that channel
            await channel.permissionOverwrites.edit(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })

            // check if the player was jailed
            if (guy.jailed) {
                let jailedChat = guild.channels.cache.find((c) => c.name === "jailed-chat") // gets the channel
                let wardenChat = guild.channels.cache.find((c) => c.name === "warden-jail") // gets the channel

                // delete the permissions of that channel for that guy
                await wardenChat.permissionOverwrites.delete(guy.id)
                await jailedChat.permissionOverwrites.delete(guy.id)

                // delete the messages
                let allMessages1 = await jailedChat.messages.fetch({ limit: 100, cache: false }) // fetches up to 100 messages from the channel
                let allMessages2 = await wardenChat.messages.fetch({ limit: 100, cache: false }) // fetches up to 100 messages from the channel
                await jailedChat.bulkDelete(allMessages1.filter((m) => !m.pinned)) // deletes every message but pinned
                await wardenChat.bulkDelete(allMessages2.filter((m) => !m.pinned)) // deletes every message but pinned
            }
        }
    })
}
