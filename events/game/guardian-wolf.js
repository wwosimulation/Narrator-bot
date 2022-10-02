const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = async (interaction) => {
    const client = interaction.client
    const players = db.get(`players`)
    const gww = db.get(`player_${interaction.user.id}`)
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")
    let revealedPlayers = db.get(`game`).revealedPlayers || []

    if (db.get("gamePhase") % 3 === 0) return interaction.followUp({ content: "You can only protest during the day!", ephemeral: true })
    if (gww.uses === 0) return interaction.followUp({ content: "You have used up your ability!", ephemeral: true })

    let droppy = { type: 3, custom_id: "game-gww-protest", placeholder: "Select a player to protest", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }

    for (const p of alivePlayers) {
        let player = db.get(`player_${p}`)
        let statement = revealedPlayers.includes(p) || gww.coupled === p || player.role === "President" || gww.instigator?.includes(p) || gww.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== gww.id))?.includes(p) || gww.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== gww.id))?.includes(p) || gww.id === p
        if (statement) droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protest ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
        else droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protest ${player.username}` })
    }

    let message = await interaction.followUp({ content: `${getEmoji("gwwprotest", client)} Select a player below to protest`, components: [{ type: 1, components: [droppy] }], fetchReply: true, ephemeral: true })

    await createCollector(message)

    async function createCollector(msg) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                if (db.get(`gamePhase`) % 3 === 0) return i.reply({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${gww.id}`).status !== "Alive") return i.reply({ content: "You are not alive!", ephemeral: true })
                if (i.values[0] === "cancel") {
                    db.delete(`player_${gww.id}.target`)
                    await i.update({ content: "Done!", components: [] })
                    await i.followUp({ content: `${getEmoji("gwwprotest", client)} You have sucessfully canceled your action!` })
                    return
                }
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return i.reply({ content: "This player is not alive!", ephemeral: true })

                db.set(`player_${interaction.user.id}.target`, i.values[0])
                await i.update({ content: "Done!", components: [] })
                await i.followUp({ content: `${getEmoji("gwwprotest", client)} You have decided to protest **${players.indexOf(i.values[0]) + 1} ${db.get(`player_${i.values[0]}`).username}**!` })
            })
            .catch(() => null)
    }
}
