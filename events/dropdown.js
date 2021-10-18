const db = require("quick.db")
const leaderboard = require("../commands/economy/leaderboard")
const { shop, ids } = require("../config")
const { players } = require("../db")
const terrorCheck = (message) => {
    let prog = message.guild.channels.cache.filter((c) => c.name === "priv-prognosticator").map((x) => x.id)
    let dayCount = Math.floor(db.get(`gamePhase`) / 3) + 1
    let res = false
    for (let i = 0; i < prog.length; i++) {
        let terrorDay = db.get(`terror_${prog[i]}.day`) || "no"
        let terrorGuy = db.get(`terror_${prog[i]}.guy`) || "no"
        if (terrorDay !== "no" && terrorGuy !== "no" && terrorDay >= dayCount && message.member.nickname === terrorGuy) res = true
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

        if (interaction.customId.startsWith("pumpkinking")) {
            if (!interaction.member.roles.cache.has(ids.alive) && !interaction.member.roles.cache.has(ids.dead)) return interaction.reply({ content: "Only players can give candy!", ephemeral: true })
            let args = interaction.customId.split("-")
            let king = args[0] // channel ID of king
            let action = args[1] // pass:channelID or return
            if (action == "return") {
                let count = db.get(`pk_${king}`).size
                let users = db.get(`pk_${king}`)
                let userMap = ""
                interaction.guild.members.cache
                    .filter((x) => x.roles.cache.has(ids.alive) || x.roles.cache.has(ids.dead))
                    .forEach((x) => {
                        let didGive = users.includes(x.id)
                        usermap += `${didGive ? "+" : "-"} ${x.nickname} (${x.user.tag})`
                    })
                    .map((x) => interaction.guild.members.cache.find((m) => m.id == x)?.nickname || "Unknown User")
                king.send({ content: `Your candy basket has returned! ${count}/${interaction.guild.roles.cache.get(ids.alive).members.cache.size} players gave candy:\n${userMap}` })
                interaction.message.delete()
                interaction.reply("You have returned the candy bucket!")
            }
            if (action == "pass") {
                let passTo = action.split(":")[1]
                interaction.guild.channels.cache.get(passTo).send({content: interaction.message.content, components: interaction.message.components})
                interaction.message.delete()
                interaction.reply("You have passed on the candy bucket!")
            }
        }

        if (interaction.customId.startsWith("votephase")) {
            let day = Math.floor(db.get(`gamePhase`) / 3) + 1
            if (terrorCheck(interaction)) return interaction.reply({ content: "The Prognosticator prevents you from voting.", ephemeral: true })
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
            let arg = interaction.customId.slice(11).split("-") // ['', sort, message.id]
            let new_page = interaction.values[0]
            let m = interaction.message
            let message = interaction.channel.messages.fetch(arg[2])

            let args = [new_page, arg[1], interaction.channelId, m]

            leaderboard.run(message, args, client)
        }
    })
}
