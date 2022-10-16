const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = async (interaction) => {
    const client = interaction.client
    const players = db.get(`players`)
    const bg = db.get(`player_${interaction.user.id}`)
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")
    let revealedPlayers = db.get(`game`).revealedPlayers || []

    if (db.get("gamePhase") % 3 !== 0) return interaction.followUp({ content: "You can only protect during the night!", ephemeral: true })

    let droppy = { type: 3, custom_id: "game-bg-protect", placeholder: "Select a player to protect", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }

    for (const p of alivePlayers) {
        if (p === bg.id && !bg.hypnotized) continue
        let player = db.get(`player_${p}`)
        let statement = revealedPlayers.includes(p) || bg.coupled === p || player.role === "President" || bg.instigator?.includes(p) || bg.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== bg.id))?.includes(p) || bg.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== bg.id))?.includes(p) || bg.id === p
        if (statement) droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protect ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
        else droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protect ${player.username}` })
    }

    let message = await interaction.followUp({ content: `${getEmoji("guard", client)} Select a player below to protect`, components: [{ type: 1, components: [droppy] }], fetchReply: true, ephemeral: true })

    await createCollector(message)

    async function createCollector(msg) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                if (db.get(`gamePhase`) % 3 !== 0) return i.reply({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${bg.id}`).status !== "Alive") return i.reply({ content: "You are not alive!", ephemeral: true })
                if (i.values[0] === "cancel") {
                    db.delete(`player_${bg.id}.target`)
                    await i.update({ content: "Done!", components: [] })
                    await i.followUp({ content: `${getEmoji("guard", client)} You have sucessfully canceled your action!` })
                    return
                }
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return i.reply({ content: "This player is not alive!", ephemeral: true })

                db.set(`player_${interaction.user.id}.target`, i.values[0])
                await i.update({ content: "Done!", components: [] })
                await i.followUp({ content: `${getEmoji("guard", client)} You have decided to protect **${players.indexOf(i.values[0]) + 1} ${db.get(`player_${i.values[0]}`).username}**!` })
            })
            .catch(() => null)
    }
}
