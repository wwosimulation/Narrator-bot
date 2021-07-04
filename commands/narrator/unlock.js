const db = require("quick.db")
module.exports = {
    name: "unlock",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((x) => x.name == "Alive")
        let dayChat = message.guild.channels.cache.find((x) => x.name == "day-chat") // allowing players to speak in #day-chat
        dayChat.updateOverwrite(alive.id, {
            SEND_MESSAGES: true,
        })
        dayChat.send(`<@&${alive.id}>`)
        message.channel.send("Done")
    },
}
