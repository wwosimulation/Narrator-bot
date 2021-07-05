const db = require("quick.db")
const { shop } = require("../config")
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isSelectMenu()) return
        if (interaction.customID.startsWith("votephase")) {
            if (interaction.values[0].split("-")[1] == interaction.member.nickname) {
                return interaction.reply({ content: `Trying to win as fool by voting yourself won't get you anywhere. Get a life dude.`, ephemeral: true })
            } else if (interaction.values[0].split("-")[1] == "cancel") {
                await interaction.deferUpdate()
                let voted = db.get(`votemsgid_${interaction.message.channel.id}`)
                if (voted) {
                    let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                    if (tmestodel) {
                        await tmestodel.delete()
                    }
                }
                db.delete(`vote_${interaction.member.id}`)
                db.delete(`votemsgid_${interaction.message.channel.id}`)
            } else {
                await interaction.deferUpdate()
                let voted = db.get(`votemsgid_${interaction.message.channel.id}`)
                if (voted) {
                    let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                    if (tmestodel) {
                        await tmestodel.delete()
                    }
                }
                let omg = await interaction.message.channel.send(`${interaction.member.nickname} voted ${interaction.values[0].split("-")[1]}`)
                db.set(`vote_${interaction.member.id}`, interaction.values[0].split("-")[1])
                db.set(`votemsgid_${interaction.message.channel.id}`, omg.id)
            }
        }
    })
}
