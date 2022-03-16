module.exports = (client) => {
    client.on("interactionCreate", (interaction) => {
        if (!interaction.isAutocomplete()) return
        let res = []
        switch (interaction.commandName) {
            case "player": {
                if (interaction.options.getString("column") !== "badge") res = []
                let possible = [
                    { name: "Staff", value: "staff" },
                    { name: "Suggestor", value: "suggestor" },
                    { name: "Item roulette master", value: "item_roulette_master" },
                    { name: "Active Player (bronze)", value: "active_player_bronze" },
                    { name: "Active Player (silver)", value: "active_player_silver" },
                    { name: "Active Player (gold)", value: "active_player_gold" },
                    { name: "Pro Player (bronze)", value: "pro_player_bronze" },
                    { name: "Pro Player (silver)", value: "pro_player_silver" },
                    { name: "Pro Player (gold)", value: "pro_player_gold" },
                    { name: "Beta Tester", value: "beta_tester" },
                    { name: "Interaction Tester", value: "interaction_tester" },
                ]
                let typed = interaction.options.getString("value")
                typed.replace(/ /g, "") === ""
                    ? (res = possible)
                    : possible.forEach((e) => {
                          if (e.name.toLowerCase().startsWith(typed.toLowerCase())) res.push(e)
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
