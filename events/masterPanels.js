const db = require("quick.db")
const { shop } = require("../config")
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return
        if (interaction.customId == "dev-restart") {
            await interaction.reply({content: "Restart in progress...", ephemeral: true})
            process.exit(0)
        }
        if(interaction.customId == "dev-emergencystop") {
            await interaction.reply({content: "Emergency stop initiated by " + interaction.user.tag})
            db.set("emergencystop", true)
            process.exit(0)
        }
        if(interaction.customId == "dev-status") {
            await interaction.reply({content: "Coming soon!", ephemeral: true})
        }
        
    })
}
