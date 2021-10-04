const { ids } = require("../../config")

module.exports = {
    name: "reloadslash",
    description: "Loads slash commands, add them if they don't exist yet and overrides the permissions.",
    usage: `${process.env.PREFIX}reloadslash`,
    run: (message, args, client) => {
        try {
            if (!message.member.roles.cache.has("859099415515627540") && !message.member.roles.cache.has("606123616228343812")) return message.reply({ content: "You are missing permissions to do that!" })
            let done = 0
            client.slashCommands.each((cmd) => {
                cmd.server.forEach((server) => {
                    let id = ids.server[server]
                    client.application.commands.create(cmd.command, id).then((command) => {
                        if (cmd.permissions[server]) command.permissions.set({ command: command, permissions: cmd.permissions[server] })
                    })
                    done += 1
                })
            })
            message.channel.send({ content: `${done} slash commands created/updated.` })
        } catch (err) {
            console.error
        }
    },
}
