module.exports = {
    command: {
        name: "ping",
        description: "Replies with bot ping.",
        defaultPermission: true,
    },
    permissions: {
        sim: [{ id: "606138123260264488", type: "ROLE", permission: true }],
        game: [{ id: "892046210536468500", type: "ROLE", permission: true }],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        interaction.reply(`${interaction.l10n("ping")}! ${Math.ceil(interaction.client.ws.ping)} ms.`)
    },
}
