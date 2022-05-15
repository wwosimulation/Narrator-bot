const { badgesFilter } = require("../config/src/badges")

module.exports = (client) => {
    client.on("interactionCreate", (interaction) => {
        if (!interaction.isAutocomplete()) return
        let res = []
        switch (interaction.commandName) {
            case "player": {
                res = badgesFilter(interaction.options.getString("value"))
            }
            default: {
                break
            }
        }
        interaction.respond(res)
    })
}
