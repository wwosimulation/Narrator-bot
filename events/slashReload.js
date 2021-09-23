const { ids } = require("../config")

module.exports = (client) => {
    client.on("slashReload", async () => {
        client.slashCommands.each((cmd) => {
            cmd.server.forEach((server) => {
                let id = ids.server[server]
                client.application.commands.create(cmd.command, id).then((command) => {
                    if (cmd.permissions[server]) command.permissions.set({ command: command, permissions: cmd.permissions.sim })
                })
            })
        })
    })
}
