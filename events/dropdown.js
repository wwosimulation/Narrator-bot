const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const db = require("quick.db")
const shuffle = require("shuffle-array")
const leaderboard = require("../commands/economy/leaderboard")
const { shop, ids, fn, getEmoji } = require("../config")

const emojis = ["🍬", "🍭", "🍫"]
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
            const allPlayers = db.get(`players`)
            let args = interaction.values[0].split("-")
            let king = args[0] // player ID of king
            let action = args[1] // pass:channelID or return
            let player = db.get(`player_${king}`) // the pumpkin king player object
            let bucket = player.pk || [] // the bucket

            if (action.startsWith("return")) {
                interaction.reply("You have returned the candy bucket!")

                bucket.push(interaction.member.id)
                db.set(`player_${king}.pk`, bucket)

                interaction.guild.channels.cache.get(player.channel).send({ content: `Your candy basket has returned! ${bucket.length}/${allPlayers.length} players gave candy:\n\`\`\`diff\n${bucket.map((p) => `+ ${allPlayers.indexOf(p) + 1} ${db.get(`player_${p}`).username}`).join("\n")}\`\`\`\nBe sure to ask the narrator of the game to give each player above 5 coins.` })

                interaction.message.edit({ components: [], content: interaction.message.content })
            }

            if (action.startsWith("pass")) {
                let passTo = action.split(":")[1]
                let droppy = { type: 3, custom_id: "pumpkinking", options: [] }

                if (passTo == interaction.channel.id) return interaction.reply("You cannot pass the bucket to yourself! Imagine being greedy lmao.")

                bucket.push(interaction.member.id)
                db.set(`player_${king}.pk`, bucket)

                droppy.options.push({ label: `Return`, value: `${king}-return`, description: `Return the bucket`, emoji: "🎃" })

                let deadPlayers = allPlayers.filter((p) => db.get(`player_${p}`).status === "Dead").map((p) => db.get(`player_${p}`))
                deadPlayers.forEach((p) => {
                    if (!bucket.includes(p.id)) {
                        shuffle(emojis)
                        droppy.options.push({ label: `${allPlayers.indexOf(p) + 1}`, value: `${king}-pass:${p.channel}`, description: `Pass the bucket to ${p.username}`, emoji: { name: emojis[0] } })
                    }
                })

                let row = { type: 1, components: [droppy] }

                interaction.guild.channels.cache.get(passTo).send(`${message.guild.roles.cache.find((r) => r.name === "Alive")}`)
                interaction.guild.channels.cache.get(passTo).send({ content: `${getEmoji("pumpkinking", client)} You have been passed the candy bucket from the Pumpkin King! ${getEmoji("pumpkinking", client)}\nYou may either choose to pass the bucket to another player or return it to the Pumpkin King!`, components: [row] })

                interaction.message.edit({ components: [], content: interaction.message.content })

                interaction.reply("You have passed on the candy bucket!")
            }
        }

        if (interaction.customId.startsWith("votephase")) {
            let day = Math.floor(db.get(`gamePhase`) / 3) + 1
            if (interaction.member.roles.cache.has(ids.dead)) return interaction.reply({ content: `You're dead, you can't vote!`, ephemeral: true })
            if (interaction.member.roles.cache.has(ids.spectator)) return interaction.reply({ content: `You're spectating, you can't vote!`, ephemeral: true })
            if (terrorCheck(interaction)) return interaction.reply({ content: "The Prognosticator prevents you from voting.", ephemeral: true })
            let corrs = interaction.guild.channels.cache.filter((c) => c.name === "priv-corruptor").map((corr) => corr.id)
            for (let corr = 0; corr < corrs.length; corr++) {
                let corrupted = db.get(`corrupt_${corrs[corr]}`)
                if (corrupted == interaction.member.displayName) {
                    return interaction.reply({ content: "You are corrupted! You can't vote today.", ephemeral: true })
                }
            }
            let allpaci = interaction.guild.channels.cache.filter((c) => c.name === "priv-pacifist").map((x) => x.id)
            for (let x = 0; x < allpaci.length; x++) {
                let dayactivated = db.get(`pacday_${allpaci[x]}`)
                if (dayactivated != null && day == dayactivated) {
                    return interaction.reply({ content: `A pacifist has revealed someone's role you can't vote today.`, ephemeral: true })
                }
            }

            // check if channel is not sendable
            let yourRole = db.get(`role_${interaction.user.id}`) || "None"
            let allChannels = interaction.guild.channels.cache.filter((c) => c.name === `priv-${yourRole}?.toLowerCase().replace(/\s/g, "-")`)
            allChannels.forEach((yourChan) => {
                if (yourChan.permissionsFor(interaction.member.id).has("VIEW_CHANNEL")) {
                    if (!yourChan.permissionsFor(interaction.member.id).has("SEND_MESSAGES")) {
                        return interaction.reply({ content: "You are muted! You can't vote today.", ephemeral: true })
                    }
                }
            })
            if (interaction.values[0].split("-")[1] == interaction.member.nickname) return interaction.reply({ content: `Trying to win as fool by voting yourself won't get you anywhere. Get a life dude.`, ephemeral: true })
            if (interaction.values[0].split("-")[1] == "cancel") {
                await interaction.deferUpdate()
                if (db.get(`game.isShadow`)) return
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
                if (db.get(`game.isShadow`)) return
                let voted = db.get(`votemsgid_${interaction.member.id}`)
                if (voted) {
                    let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                    if (tmestodel) {
                        await tmestodel.delete()
                    }
                }

                let omg = await interaction.message.channel.send(`${interaction.member.displayName} voted ${interaction.values[0].split("-")[1]}`)
                db.set(`vote_${interaction.member.id}`, interaction.values[0].split("-")[1])
                db.set(`votemsgid_${interaction.member.id}`, omg.id)
            }
        }
        if (interaction.customId.startsWith("votemode")) {
            if (interaction.member.roles.cache.has(ids.dead)) return interaction.reply({ content: `You're dead, you can't vote!`, ephemeral: true })
            if (interaction.member.roles.cache.has(ids.spectator)) return interaction.reply({ content: `You're spectating, you can't vote!`, ephemeral: true })
            await interaction.deferUpdate()
            let voted = db.get(`votemodeid_${interaction.member.id}`)
            if (voted) {
                let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                if (tmestodel) {
                    await tmestodel.delete()
                }
            }
            let omg = await interaction.message.channel.send(`${interaction.member.displayName} voted to play ${interaction.values[0]}`)
            db.set(`votemode_${interaction.member.id}`, interaction.values[0])
            db.set(`votemodeid_${interaction.member.id}`, omg.id)
        }
        if (interaction.customId.startsWith("poll")) {
            await interaction.deferUpdate()
            let voted = db.get(`poll${interaction.message.id}id_${interaction.member.id}`)
            if (voted) {
                let tmestodel = await interaction.message.channel.messages.fetch(voted).catch((e) => console.log(e.message))
                if (tmestodel) {
                    await tmestodel.delete()
                }
            }
            let omg = await interaction.message.channel.send(`${interaction.member.displayName} voted ${interaction.values[0]}`)
            db.set(`poll${interaction.message.id}_${interaction.member.id}`, interaction.values[0])
            db.set(`poll${interaction.message.id}id_${interaction.member.id}`, omg.id)
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
