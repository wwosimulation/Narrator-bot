module.exports = {
    command: {
        name: "ping",
        description: "Replies with bot ping.",
        defaultPermission: true,
    },
    permissions: {
        sim: [{ id: "606138123260264488", type: "ROLE", permission: true }],
        game: [{ id: "606131215526789120", type: "ROLE", permission: true }],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        interaction.reply(`${interaction.i10n("ping")}! ${Math.ceil(message.client.ws.ping)} ms.`)
    },
}
