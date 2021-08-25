const db = require("quick.db")
const leaderboard = require("../commands/economy/leaderboard")
const { shop, ids } = require("../config")
const { players } = require("../db")
function terrorCheck(interaction) {
    let prog = interaction.guild.channels.cache.filter((c) => c.name === "priv-prognosticator").map((x) => x.id)
    let dayCount = db.get(`dayCount`)
    let res = false
    for (let i = 0; i < prog.length; i++) {
        let tempchan = interaction.guild.channels.cache.get(prog[i])
        let terror = db.get(`terror_${tempchan[i].id}`)
        if (terror.day >= dayCount && interaction.member.nickname === terror.guy) res = true
    }
    return res
}

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isSelectMenu()) return
        if (interaction.customId.startsWith("configLanguage")) {
            let user = interaction.member.id
            await players.findOneAndUpdate({ user }, { language: interaction.values[0] }).exec()
            interaction.reply({ content: `Your language has been set to ${interaction.values[0]}!`, ephemeral: true })
        }

        if (interaction.customId.startsWith("votephase")) {
            let day = (await db.fetch(`dayCount`)) || "0"
            if (terrorCheck(interaction)) return interaction.reply({ content:"The Prognosticator prevents you from voting.", ephemeral: true })
            let allpaci = interaction.guild.channels.cache.filter((c) => c.name === "priv-pacifist").map((x) => x.id)
            for (let x = 0; x < allpaci.length; x++) {
                let dayactivated = db.get(`pacday_${allpaci[x]}`)
                if (dayactivated != null && day == dayactivated) {
                    return interaction.reply({ content: `A pacifist has revealed someone's role you can't vote today.`, ephemeral: true })
                }
            }
            if (interaction.values[0].split("-")[1] == interaction.member.nickname) return interaction.reply({ content: `Trying to win as fool by voting yourself won't get you anywhere. Get a life dude.`, ephemeral: true })
            if (interaction.member.roles.cache.has(ids.dead)) return interaction.reply({ content: `You're dead, you can't vote!`, ephemeral: true })
            if (interaction.member.roles.cache.has(ids.spectator)) return interaction.reply({ content: `You're spectating, you can't vote!`, ephemeral: true })
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
        }
        if (interaction.customId.startsWith("leaderboard")) {
            let arg = customId.slice(11).split("-") // ['', sort, message.id]
            let new_page = interaction.values[0]
            let m = interaction.message
            let message = interaction.channel.messages.fetch(arg[2])

            let args = [new_page, arg[1], interaction.channelId, m]

            leaderboard.run(message, args, client)
        }
    })
}
