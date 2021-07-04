const db = require("quick.db")
const { shop } = require("../config")
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isSelectMenu()) return
        if(interaction.customID.startsWith("votephase")) {
            interaction.reply(`${interaction.member.nickname} voted ${interaction.values[0].split("-")[1]}`)
        }
    })
}