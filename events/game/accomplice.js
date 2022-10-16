const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = async (interaction) => {
    const client = interaction.client
    const players = db.get(`players`)
    const acc = db.get(`player_${interaction.user.id}`)
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")
    let revealedPlayers = db.get(`game`).revealedPlayers || []

    if (db.get("gamePhase") % 3 !== 0) return interaction.followUp({ content: "You can only stab during the night!", ephemeral: true })

    let droppy = { type: 3, custom_id: "game-acc-kill", placeholder: "Select a player to stab", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }

    for (const p of alivePlayers) {
        if (p === acc.id && !acc.hypnotized) continue
        let player = db.get(`player_${p}`)
        let statement = revealedPlayers.includes(p) || acc.coupled === p || player.role === "President" || acc.instigator?.includes(p) || acc.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== acc.id))?.includes(p) || acc.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== acc.id))?.includes(p) || acc.id === p
        if (statement) droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Stab ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
        else droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Stab ${player.username}` })
    }

    let message = await interaction.followUp({ content: `${getEmoji("thieve", client)} Select a player below to stab`, components: [{ type: 1, components: [droppy] }], fetchReply: true, ephemeral: true })

    await createCollector(message)

    async function createCollector(msg) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                if (db.get(`gamePhase`) % 3 !== 0) return i.reply({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${acc.id}`).status !== "Alive") return i.reply({ content: "You are not alive!", ephemeral: true })
                if (i.values[0] === "cancel") {
                    db.delete(`player_${acc.id}.target`)
                    await i.update({ content: "Done!", components: [] })
                    await i.followUp({ content: `${getEmoji("thieve", client)} You have sucessfully canceled your action!` })
                    return
                }
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return await i.update({ content: "This player is not alive!", components: [] })

                let teammates = fn.teammateCheck({ player: acc.id, target: i.values[0], db })

                if (!corr.hypnotized) {
                    if (teammates.couple) return await i.update({ content: "You can't stab your own couple!", ephemeral: true })
                    if (teammates.recruit) return await i.update({ content: "You can't stab your own recruit!", ephemeral: true })
                    if (teammates.instigator) return await i.update({ content: "You can't stab the Instigator who recruited you!", ephemeral: true })
                    if (player.bandit === i.values[0]) return await i.update({ content: "You can't stab your own Bandit!", ephemeral: true })
                }

                db.set(`player_${interaction.user.id}.target`, i.values[0])
                await i.update({ content: "Done!", components: [] })
                await i.followUp({ content: `${getEmoji("thieve", client)} You have decided to stab **${players.indexOf(i.values[0]) + 1} ${db.get(`player_${i.values[0]}`).username}**!` })

                let channel = message.guild.channels.cache.get(player.banditChannel) || message.channel

                await channel.send(`${getEmoji("thieve", client)} **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**`)
            })
            .catch(() => null)
    }
}
