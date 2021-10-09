const { ids } = require("../../config")

module.exports = {
    name: "nuke",
    description: "Deletes all slash commands of the bot you are using.",
    usage: `${process.env.PREFIX}nuke`,
    run: (message, args, client) => {
        try {
            if (!message.member.roles.cache.has("859099415515627540") && !message.member.roles.cache.has("606123616228343812")) return message.reply({ content: "You are missing permissions to do that!" })
            client.guilds.cache
                .filter((guild) => guild.id === ids.server.sim || guild.id === ids.server.game)
                .each((server) => {
                    server.commands.set([])
                })
            message.channel.send({ content: `The servers have the following count of slash commands:\nSim: ${client.guilds.resolve(ids.server.sim).commands.cache.size}\nGame: ${client.guilds.resolve(ids.server.game).commands.cache.size}` })
        } catch (err) {
            message.channel.send("An error occurred!")
            console.error
        }
    },
}
