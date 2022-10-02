const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = async (interaction) => {
    const client = interaction.client
    const players = db.get(`players`)
    const sh = db.get(`player_${interaction.user.id}`)
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")
    let revealedPlayers = db.get(`game`).revealedPlayers || []

    if (db.get("gamePhase") % 3 !== 0) return interaction.followUp({ content: "You can only hunt during the night!", ephemeral: true })

    let droppy = { type: 3, custom_id: "game-sh-hunt", placeholder: "Select a player to hunt", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }

    for (const p of alivePlayers) {
        if (p === sh.id && !sh.hypnotized) continue;
        let player = db.get(`player_${p}`)
        let statement = revealedPlayers.includes(p) || sh.coupled === p || player.role === "President" || sh.instigator?.includes(p) || sh.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== sh.id))?.includes(p) || sh.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== sh.id))?.includes(p) || sh.id === p
        if (statement) droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Hunt ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
        else droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Hunt ${player.username}` })
    }

    let message = await interaction.followUp({ content: `${getEmoji("sect_hunter", client)} Select a player below to hunt`, components: [{ type: 1, components: [droppy] }], fetchReply: true, ephemeral: true })

    await createCollector(message)

    async function createCollector(msg) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                if (db.get(`gamePhase`) % 3 !== 0) return i.reply({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${sh.id}`).status !== "Alive") return i.reply({ content: "You are not alive!", ephemeral: true })
                if (i.values[0] === "cancel") {
                    db.delete(`player_${sh.id}.target`)
                    await i.update({ content: "Done!", components: [] })
                    await i.followUp({ content: `${getEmoji("sect_hunter", client)} You have sucessfully canceled your action!` })
                    return
                }
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return await i.update({ content: "This player is not alive!", ephemeral: true })
                let teammates = fn.teammateCheck({ player: sk.id, target: i.values[0], db })
                if (teammates.couple) return await i.update({ content: "You can't hunt your own couple!", ephemeral: true })
                if (teammates.recruit) return await i.update({ content: "You can't hunt your own recruit!", ephemeral: true })
                if (teammates.instigator) return await i.update({ content: "You can't hunt the Instigator who recruited you!", ephemeral: true })
                if (db.get(`player_${i.values[0]}`).role === "President") return await i.update({ content: "You can't hunt the President!", ephemeral: true })

                db.set(`player_${interaction.user.id}.target`, i.values[0])
                await i.update({ content: "Done!", components: [] })
                await i.followUp({ content: `${getEmoji("sect_hunter", client)} You have decided to hunt **${players.indexOf(i.values[0]) + 1} ${db.get(`player_${i.values[0]}`).username}**!` })
            })
            .catch(() => null)
    }
}
