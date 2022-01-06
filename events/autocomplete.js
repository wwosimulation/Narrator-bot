module.exports = (client) => {
<<<<<<< HEAD
    client.on("interactionCreate", interaction => {
        if(!interaction.isAutocomplete()) return
        let res = []
        switch(interaction.commandName) {
            case "player": {
                if(interaction.options.getString("column") !== "badge") res = []
                let possible = [
                    {name: "staff", value: "staff"},
                    {name: "suggestor", value: "suggestor"},
                    {name: "item_roulette_master", value: "item_roulette_master"}
                ]
                let typed = interaction.options.getString("value")
                typed.replace(/ /g, "") === "" ? res = possible : possible.forEach(e => {
                    if(e.name.startsWith(typed.toLowerCase())) res.push(e)
                })
=======
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
                ]
                let typed = interaction.options.getString("value")
                typed.replace(/ /g, "") === ""
                    ? (res = possible)
                    : possible.forEach((e) => {
                          if (e.name.startsWith(typed.toLowerCase())) res.push(e)
                      })
>>>>>>> 4699c5720dccb20364dfd91739d24829a21b595f
                break
            }
            default: {
                break
            }
        }
        interaction.respond(res)
    })
<<<<<<< HEAD
}
=======
}
>>>>>>> 4699c5720dccb20364dfd91739d24829a21b595f
