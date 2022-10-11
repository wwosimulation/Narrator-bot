const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = async (interaction) => {
    const client = interaction.client
    const gamePhase = db.get("gamePhase")
    let flagger = db.get(`player_${interaction.user.id}`)
    let players = db.get("players")
    let revealedPlayers = db.get(`game`).revealedPlayers || []
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")
    let droppy1 = { type: 3, custom_id: "game-flagger-protect", placeholder: "Select a player to protect", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }
    let droppy2 = { type: 3, custom_id: "game-flagger-redirect", placeholder: "Select a player to redirect the attack", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }
    let options = []

    if (gamePhase % 3 !== 0) return interaction.followUp({ content: "You can only protect during the night!", ephemeral: true })
    if (gamePhase === 0) return interaction.followUp({ content: "You can only protect after the first night!", ephemeral: true })
    if (flagger.uses === 0) return interaction.followUp({ content: "You already used up your ability!", ephemeral: true })

    for (const p of alivePlayers) {
        let player = db.get(`player_${p}`)
        let statement = revealedPlayers.includes(p) || flagger.coupled === p || player.role === "President" || flagger.instigator?.includes(p) || flagger.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== flagger.id))?.includes(p) || flagger.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== flagger.id))?.includes(p) || flagger.id === p
        if (statement) options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protect ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
        else options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protect ${player.username}` })
    }

    droppy1.options.push(...options)

    let message = await interaction.followUp({ content: `${getEmoji("flagger_protect", client)} Select a player below to protect`, components: [{ type: 1, components: [droppy1] }], fetchReply: true, ephemeral: true })

    await createCollector1(message)

    async function createCollector1(msg) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                await i.deferUpdate()
                if (db.get(`gamePhase`) % 3 !== 0) return i.followUp({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${flagger.id}`).status !== "Alive") return i.followUp({ content: "You are not alive!", ephemeral: true })
                if (i.values[0] === "cancel") {
                    db.delete(`player_${flagger.id}.target`)
                    db.delete(`player_${flagger.id}.redirect`)
                    await i.editReply({ content: "Done!", components: [] })
                    await i.followUp({ content: `${getEmoji("flagger_protect", client)} You have sucessfully canceled your action!` })
                    return
                }
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return await i.editReply({ content: "This player is not alive!", ephemeral: true })

                options.splice(
                    options.findIndex((a) => a.value === i.values[0]),
                    1
                )

                droppy2.options.push(...options)
                droppy2.options.forEach((o) => {
                    o.description = o.description.replace("Protect", "Redirect the attack to")
                })

                db.set(`player_${interaction.user.id}.target`, i.values[0])
                await i.editReply({ content: "Done!", components: [] })
                let reply = await i.followUp({ content: `${getEmoji("flagger_kill", client)} Select a player below to redirect the attack`, components: [{ type: 1, components: [droppy2] }], ephemeral: true, fetchReply: true })
                await createCollector2(reply)
            })
            .catch(() => null)
    }

    async function createCollector2(msg) {
        await i.deferUpdate()
        if (db.get(`gamePhase`) % 3 !== 0) return i.followUp({ content: "This action is no longer valid now!", ephemeral: true })
        if (db.get(`player_${flagger.id}`).status !== "Alive") return i.followUp({ content: "You are not alive!", ephemeral: true })
        if (i.values[0] === "cancel") {
            db.delete(`player_${flagger.id}.target`)
            db.delete(`player_${flagger.id}.redirect`)
            await i.editReply({ content: "Done!", components: [] })
            await i.followUp({ content: `${getEmoji("flagger_protect", client)} You have sucessfully canceled your action!` })
            return
        }
        if (db.get(`player_${i.values[0]}`).status !== "Alive") return await i.editReply({ content: "This player is not alive!", ephemeral: true })

        let teammates = fn.teammateCheck({ player: sk.id, target: i.values[0], db })
        if (teammates.couple) return await i.editReply({ content: "You can't redirect an attack to your own couple!", ephemeral: true })
        if (teammates.recruit) return await i.editReply({ content: "You can't redirect an attack to your own recruit!", ephemeral: true })
        if (teammates.instigator) return await i.editReply({ content: "You can't redirect an attack to the Instigator who recruited you!", ephemeral: true })
        if (db.get(`player_${i.values[0]}`).role === "President") return await i.editReply({ content: "You can't redirect an attack to the President!", ephemeral: true })

        db.set(`player_${interaction.user.id}.redirect`, i.values[0])
        await i.editReply({ content: "Done!", components: [] })
        await i.followUp({ content: `${getEmoji("flagger_protect", client)} You have decided to protect **${players.indexOf(db.get(`player_${flagger.id}`).target) + 1} ${db.get(`player_${db.get(`player_${flagger.id}`).target}`).username}** by redirecting attacks to **${players.indexOf(i.values[0]) + 1} ${db.get(`player_${i.values[0]}`).username}**!` })
    }
}
