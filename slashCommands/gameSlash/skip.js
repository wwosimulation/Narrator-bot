const { get, push, set } = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    command: {
        name: "skip",
        description: "Skip the discussion time and move on to the voting phase.",
        defaultPermission: true,
    },
    server: ["game"],
    run: async (interaction, client) => {
        let guy = get(`player_${interaction.user.id}`)
        let players = get("players")
        let alivePlayers = players?.filter((p) => get(`player_${p}`).status === "Alive")
        await interaction.deferReply({ ephemeral: true })
        let skips = get("skipVotes") || []

        if (interaction.guild.id !== ids.server.game) return interaction.editReply(interaction.l10n("commandRestrictGameServer"))
        if (!guy || !alivePlayers) return interaction.editReply("You are not in the game.")
        if (interaction.channel.name !== "day-chat" && !interaction.channel.name.startsWith("priv")) return interaction.editReply("You can only use this command in the day-chat or your private channel.")

        if (get("gamePhase") % 3 !== 1) return interaction.editReply("You can only use this command during the discussion phase.")
        if (guy.status !== "Alive") return interaction.editReply("You can only use this command while you are alive.")
        if (alivePlayers.length > 8) return interaction.editReply("This command will be available when there are 8 or less players alive.")
        if (skips.includes(interaction.user.id)) return interaction.editReply("You have already voted to skip.")

        push("skipVotes", interaction.user.id)
        await interaction.editReply("You have voted to skip the discussion phase.")
        if(alivePlayers.length - 1 - get("skipVotes").length <= 0) client.commands.get("vt").run(interaction, [], client)
        else interaction.guild.channels.cache.find(c => c.name === "day-chat").send(`Someone has voted to skip the discussion phase. ${alivePlayers.length - 1 - get("skipVotes").length} votes left.`)

    },
}
