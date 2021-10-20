const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const db = require("quick.db")
const shuffle = require("shuffle-array")
const leaderboard = require("../commands/economy/leaderboard")
const { shop, ids, fn } = require("../config")

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
            //if (!interaction.member.roles.cache.has(ids.alive) && !interaction.member.roles.cache.has(ids.dead)) return interaction.reply({ content: "Only players can give candy!", ephemeral: true })
            let args = interaction.values[0].split("-")
            console.log(args, interaction.member.id)
            let king = args[0] // channel ID of king
            let action = args[1] // pass:channelID or return
            if (action.startsWith("return")) {
                db.push(`pk_${king}`, interaction.member.id)
                let users = db.get(`pk_${king}`)
                let userMap = ""
                for (let i = 1; i <= 16; i++) {
                    let x = interaction.guild.members.cache.find((x) => x.nickname == `${i}`)
                    if (x) {
                        let didGive = users.includes(x.id)
                        userMap += `${didGive ? "+" : "-"} ${x.nickname} (${x.user.tag})\n`
                    }
                }
                interaction.guild.channels.cache.get(king).send({ content: `Your candy basket has returned! ${users.length}/${interaction.guild.members.cache.filter((x) => x.roles.cache.has(ids.alive)).size} players gave candy:\n\`\`\`diff\n${userMap}\`\`\`\nBe sure to ask the narrator of the game to give each player marked with a \`+\` 5 coins.` })
                interaction.message.edit({ components: [], content: interaction.message.content })
                interaction.reply("You have returned the candy bucket!")
            }
            if (action.startsWith("pass")) {
                let passTo = action.split(":")[1]
                let droppy = new MessageSelectMenu().setCustomId("pumpkinking")
                if (passTo == interaction.channel.id) return interaction.reply("Don't be greedy and pass to yourself >:(")
                db.push(`pk_${king}`, interaction.member.id)
                droppy.addOptions({ label: `Return`, value: `${king}-return`, description: `Return the bucket`, emoji: "🎃" })
                for (let i = 1; i <= 16; i++) {
                    let player = interaction.guild.members.cache.find((x) => x.nickname == `${i}` && x.roles.cache.has(ids.alive))
                    let chan = interaction.guild.channels.cache.filter((c) => c.name.startsWith(`priv-`)).map((x) => x.id)
                    for (let j = 0; j < chan.length; j++) {
                        let tempchan = interaction.guild.channels.cache.get(chan[j])
                        if (player && tempchan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            if (!db.get(`pk_${king}`).includes(player.id)) {
                                shuffle(emojis)
                                droppy.addOptions({ label: `${i}`, value: `${king}-pass:${tempchan.id}`, description: `Pass the bucket to ${player.user.tag}`, emoji: emojis[0] })
                            }
                        }
                    }
                }
                let row = new MessageActionRow().addComponents(droppy)
                interaction.guild.channels.cache.get(passTo).send({ content: `<@&${ids.alive}>, you have been passed the candy bucket from the Pumpkin King! ${fn.getEmoji("pumpkinking", client)}\nYou may either choose to pass the bucket to another player or return it to the Pumpkin King!`, components: [row] })
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
                if (corrupted == interaction.member.nickname ? interaction.member.nickname : "0") {
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
            if (interaction.values[0].split("-")[1] == interaction.member.nickname) return interaction.reply({ content: `Trying to win as fool by voting yourself won't get you anywhere. Get a life dude.`, ephemeral: true })
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
            let omg = await interaction.message.channel.send(`${interaction.member.nickname} voted to play ${interaction.values[0]}`)
            db.set(`votemode_${interaction.member.id}`, interaction.values[0])
            db.set(`votemodeid_${interaction.member.id}`, omg.id)
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
