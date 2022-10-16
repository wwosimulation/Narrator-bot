const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = async (interaction) => {
    const client = interaction.client
    const players = db.get(`players`)
    const alch = db.get(`player_${interaction.user.id}`)
    let alivePlayers = players.filter((a) => db.get(`player_${a}`).status === "Alive")
    let revealedPlayers = db.get(`game`).revealedPlayers || []

    if (db.get("gamePhase") % 3 !== 0) return interaction.followUp({ content: "You can only give potions during the night!", ephemeral: true })

    let option = await interaction.followUp({
        content: `${getEmoji("alchemist", client)} Select which potion you would like to use.`,
        components: [
            {
                type: 1,
                components: [
                    { type: 2, style: 4, label: "Red Potion", custom_id: "alch-redp", emoji: { id: getEmoji("redp", client).id } },
                    { type: 2, style: 2, label: "Black Potion", custom_id: "alch-blackp", emoji: { id: getEmoji("blackp", client).id } },
                ],
            },
        ],
        ephemeral: true,
        fetchReply: true,
    })
    await option
        .awaitMessageComponent()
        .then(async (i) => {
            i.update({ content: `${getEmoji(i.customId.split("-")[1], client)} You have chosen to give a ${i.customId.split("-")[1].replace("p", "")} potion.`, components: [] })
            givePotion(i.customId.split("-")[1].replace("p", ""))
        })
        .catch((e) => null)

    async function givePotion(potion) {
        let droppy = { type: 3, custom_id: `game-alch-${potion}`, placeholder: `Select a player to give a ${potion} potion`, options: [{ label: "Cancel", value: "cancel", description: "Cancel" }] }

        for (const p of alivePlayers) {
            if (p === alch.id && !alch.hypnotized) continue
            let player = db.get(`player_${p}`)
            let statement = revealedPlayers.includes(p) || alch.coupled === p || player.role === "President" || alch.instigator?.includes(p) || alch.instigator?.map((a) => db.get(`player_${a}`).target.find((a) => a !== alch.id))?.includes(p) || alch.cupid?.map((a) => db.get(`player_${a}`).target.find((a) => a !== alch.id))?.includes(p) || alch.id === p
            if (statement) droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Give a ${potion} potion to ${player.username}`, emoji: { id: getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client).id } })
            else droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: p, description: `Give a ${potion} potion to ${player.username}` })
        }

        let message = await interaction.followUp({ content: `${getEmoji(`${potion}p`, client)} Select a player below to give a ${potion} potion.`, components: [{ type: 1, components: [droppy] }], fetchReply: true, ephemeral: true })

        await createCollector(message, potion)
    }

    async function createCollector(msg, potion) {
        await msg
            .awaitMessageComponent()
            .then(async (i) => {
                if (db.get(`gamePhase`) % 3 !== 0) return i.reply({ content: "This action is no longer valid now!", ephemeral: true })
                if (db.get(`player_${alch.id}`).status !== "Alive") return i.reply({ content: "You are not alive!", ephemeral: true })
                if (i.values[0] === "cancel") {
                    db.delete(`player_${alch.id}.target`)
                    await i.update({ content: "Done!", components: [] })
                    await i.followUp({ content: `${getEmoji("guard", client)} You have sucessfully canceled your action!` })
                    return
                }
                if (db.get(`player_${i.values[0]}`).status !== "Alive") return i.reply({ content: "This player is not alive!", ephemeral: true })

                db.set(`player_${interaction.user.id}.${potion}Target`, i.values[0])
                await i.update({ content: "Done!", components: [] })

                let additionalMsg = ""
                if (alch.redPotions?.includes(i.values[0]) && potion === "red") additionalMsg = "Since you are giving this player a second potion, they will die at the end of the following day."

                await i.followUp({ content: `${getEmoji(`${potion}p`, client)} You have decided to give a ${potion} potion to **${players.indexOf(i.values[0]) + 1} ${db.get(`player_${i.values[0]}`).username}**! ${additionalMsg}` })
            })
            .catch(() => null)
    }
}
