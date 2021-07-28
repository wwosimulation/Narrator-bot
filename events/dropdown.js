const db = require("quick.db")
const leaderboard = require("../commands/economy/leaderboard")
const { shop, ids } = require("../config")
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isSelectMenu()) return
        if (interaction.customId.startsWith("votephase")) {
            if (interaction.values[0].split("-")[1] == interaction.member.nickname) return interaction.reply({ content: `Trying to win as fool by voting yourself won't get you anywhere. Get a life dude.`, ephemeral: true })
            if (interaction.member.roles.cache.has(ids.dead)) return interaction.reply({ content: `You're dead, you can't vote!`, ephemeral: true })
            if (interaction.values[0].split("-")[1] == "cancel") {
                await interaction.deferUpdate()
                let voted = db.get(`votemsgid_${interaction.member.id}`)
                if (voted) {
                    let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                    if (tmestodel) {
                        await tmestodel.delete()
                    }
                }
                db.delete(`vote_${interaction.member.id}`)
                db.delete(`votemsgid_${interaction.member.id}`)
            } else {
                await interaction.deferUpdate()
                let voted = db.get(`votemsgid_${interaction.member.id}`)
                if (voted) {
                    let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                    if (tmestodel) {
                        await tmestodel.delete()
                    }
                }
                let omg = await interaction.message.channel.send(`${interaction.member.nickname} voted ${interaction.values[0].split("-")[1]}`)
                db.set(`vote_${interaction.member.id}`, interaction.values[0].split("-")[1])
                db.set(`votemsgid_${interaction.member.id}`, omg.id)
            }
            if (interaction.customId.startsWith("leaderboard")) {
                let arg = customId.slice(11).split('-') // ['', sort, message.id]
                let new_page = interaction.values[0]
                let m = interaction.message
                let message = interaction.channel.messages.fetch(args[2])

                let args = [new_page, arg[1], m]

                leaderboard.run( message , args, client)
            }
        }
    })
}
