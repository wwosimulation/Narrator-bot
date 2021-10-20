const db = require("quick.db")
module.exports = {
    name: "unlock",
    description: "Unlock the day-chat channel.",
    usage: `${process.env.PREFIX}unlock`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((x) => x.name == "Alive")
        let dayChat = message.guild.channels.cache.find((x) => x.name == "day-chat") // allowing players to speak in #day-chat
        dayChat.permissionOverwrites.edit(alive.id, {
            SEND_MESSAGES: true,
        })
        dayChat.send(`<@&${alive.id}>`)
        message.channel.send("Done")

        let vote_channel = message.guild.channels.cache.find((c) => c.name === "vote-chat")
        vote_channel.bulkDelete(vote_channel.messages.cache.filter((msg) => !msg.pinned))

        let wwvote_channel = message.guild.channels.cache.find((c) => c.name === "ww-vote")
        wwvote_channel.bulkDelete(wwvote_channel.messages.cache.filter((msg) => !msg.pinned))

        message.channel.send("Vote chats are cleared.")
    },
}
