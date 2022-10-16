const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = async (interaction) => {
    const client = interaction.client
    const players = db.get(`players`)
    const bh = db.get(`player_${interaction.user.id}`)
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")
    let revealedPlayers = db.get(`game`).revealedPlayers || []

    if (db.get("gamePhase") % 3 !== 0) return interaction.followUp({ content: "You can only place your trap during the night!", ephemeral: true })

    if (bh.placed) {
        let msg = await interaction.followUp({ content: `${getEmoji("activetrap", client)} Your trap is active! Changing your trap will deactive it.`, components: [{ type: 1, components: [{ type: 2, style: 4, label: "Change Trap", custom_id: "change-bh-trap" }] }], ephemeral: true, fetchReply: true })
        msg.awaitMessageComponent()
        .then(async i => {
            i.update({ content: `${getEmoji("constructiontrap", client)} Your trap has been dismantled!`, components: [] })
            db.delete(`player_${bh.id}.target`)
            db.delete(`player_${bh.id}.placed`)
            setTrap()
        })
        .catch(() => null)
    } else {
        setTrap()
    }


    async function setTrap() {

        let droppy = { type: 3, custom_id: "game-bh-trap", placeholder: "Select a player to place your trap on", options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }

        for (const p of alivePlayers) {
            let player = db.get(`player_${p}`)
            let statement = revealedPlayers.includes(p) || bh.coupled === p || player.role === "President" || bh.instigator?.includes(p) || bh.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== bh.id))?.includes(p) || bh.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== bh.id))?.includes(p) || bh.id === p
            if (statement) droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Place your trap on ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
            else droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Place your trap on ${player.username}` })
        }

        let message = await interaction.followUp({ content: `${getEmoji("constructiontrap", client)} Select a player below to place your trap on`, components: [{ type: 1, components: [droppy] }], fetchReply: true, ephemeral: true })

        await createCollector(message)
    }

    async function createCollector(msg) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                if (db.get(`gamePhase`) % 3 !== 0) return i.reply({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${bh.id}`).status !== "Alive") return i.reply({ content: "You are not alive!", ephemeral: true })
                if (i.values[0] === "cancel") {
                    db.delete(`player_${bh.id}.target`)
                    await i.update({ content: "Done!", components: [] })
                    await i.followUp({ content: `${getEmoji("trap", client)} You have sucessfully canceled your action!` })
                    return
                }
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return i.reply({ content: "This player is not alive!", ephemeral: true })

                db.set(`player_${interaction.user.id}.target`, i.values[0])
                await i.update({ content: "Done!", components: [] })
                await i.followUp({ content: `${getEmoji("constructiontrap", client)} You have decided to place your trap on **${players.indexOf(i.values[0]) + 1} ${db.get(`player_${i.values[0]}`).username}**!` })
            })
            .catch(() => null)
    }
}

