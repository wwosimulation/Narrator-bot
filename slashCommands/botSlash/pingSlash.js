module.exports = {
    command: {
        name: "ping",
        description: "Replies with bot ping.",
        defaultPermission: true,
    },
    run: async (interaction, client) => {
        interaction.reply(`${interaction.l10n("ping")}! ${Math.ceil(interaction.client.ws.ping)} ms.`)
    },
}
