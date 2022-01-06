module.exports = (client) => {
    client.on("interactionCreate", (interaction) => {
        if (!interaction.isAutocomplete()) return
        let res = []
        switch (interaction.commandName) {
            case "player": {
                if (interaction.options.getString("column") !== "badge") res = []
                let possible = [
                    { name: "staff", value: "staff" },
                    { name: "suggestor", value: "suggestor" },
                    { name: "item_roulette_master", value: "item_roulette_master" },
                    { name: "active_player_bronze", value: "active_player_bronze" },
                    { name: "active_player_silver", value: "active_player_silver" },
                    { name: "active_player_gold", value: "active_player_gold" },
                    { name: "pro_player_bronze", value: "pro_player_bronze" },
                    { name: "pro_player_silver", value: "pro_player_silver" },
                    { name: "pro_player_gold", value: "pro_player_gold" },
                ]
                let typed = interaction.options.getString("value")
                typed.replace(/ /g, "") === ""
                    ? (res = possible)
                    : possible.forEach((e) => {
                          if (e.name.startsWith(typed.toLowerCase())) res.push(e)
                      })
                break
            }
            default: {
                break
            }
        }
        interaction.respond(res)
    })
}
