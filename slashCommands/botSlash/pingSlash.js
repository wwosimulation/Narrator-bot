module.exports = {
    command: {
        name: "ping",
        description: "Replies with bot ping.",
        defaultPermission: true,
    },
    permissions: {
        sim: [{ id: "606138123260264488", type: "ROLE", permission: true }],
        game: [{ id: "", type: "" }],
    },
    run: async (interaction) => {
        interaction.reply(`${message.i10n("ping")}! ${Math.ceil(message.client.ws.ping)} ms.`)
    },
}
