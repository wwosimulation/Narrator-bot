const { ids } = require("../../config")

module.exports = {
    name: "nuke",
    description: "Deletes all slash commands of the bot you are using.",
    usage: `${process.env.PREFIX}nuke`,
    run: (message, args, client) => {
        try {
            if (!message.member.roles.cache.has("859099415515627540") && !message.member.roles.cache.has("606123616228343812")) return message.reply({ content: "You are missing permissions to do that!" })
            let done = 0
            client.slashCommands.each((cmd) => {
                cmd.server.forEach((server) => {
                    let id = ids.server[server]
                    client.application.commands.delete(cmd.command, id)
                    done += 1
                })
            })
            message.channel.send({ content: `${done} slash commands deleted.` })
        } catch (err) {
            console.error
        }
    },
}
