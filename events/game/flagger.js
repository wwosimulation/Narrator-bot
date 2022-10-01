const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = async (interaction) => {
    let flagger = db.get(`player_${interaction.user.id}`)
    let players = db.get("players")
    let revealedPlayers = db.get(`game`).revealedPlayers
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")

    let droppy1 = { type: 3, custom_id: "game-flagger-protect", placeholder: "Select a player to protect", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }
    let droppy2 = { type: 3, custom_id: "game-flagger-redirect", placeholder: "Select a player to redirect the attack", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }
    let options = []
    for (const p of alivePlayers) {
        let player = db.get(`player_${p}`)
        let statement = revealedPlayers.includes(p) || flagger.coupled === p || player.role === "President" || flagger.instigator?.includes(p) || flagger.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== flagger.id))?.includes(p) || flagger.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== flagger.id))?.includes(p) || flagger.id === p
        if (statement) options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protect ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
        else options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Protect ${player.username}` })
    }

    droppy1.options.push(...options)

    let message = await interaction.followUp({ content: `${getEmoji("flagger_protect", client)} Select a player below to protect`, components: [{ type: 1, components: [droppy1] }], fetchReply: true, ephemeral: true })

    await createCollector(message, "target")

    async function createCollector(msg, action) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                if (db.get(`gamePhase`) % 3 !== 0) return i.reply({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return i.reply({ content: "This player is not alive!", ephemeral: true })
                options.splice(
                    options.findIndex((a) => a.value === i.values[0]),
                    1
                )
                droppy2.options.push(...options)
                db.set(`player_${interaction.user.id}.action`, i.values[0])
                if (action === "target") await i.update({ content: `${getEmoji("flagger_kill", client)} Select a player below to redirect the attack`, components: [{ type: 1, components: [droppy2] }] })
                if (action === "target") createCollector(msg, "redirect")
                if (action === "redirect") await i.followUp({ content: `${getEmoji("flagger_protect", client)} You have decided to protect **${players.indexOf(flagger.target) + 1} ${db.get(`player_${flagger.target}`).username}** by redirecting attacks to **${players.indexOf(flagger.redirect) + 1} ${db.get(`player_${flagger.redirect}`).username}**!` })
                return
            })
            .catch(() => null)
    }
}
