const { github, ids } = require("../../config")

module.exports = {
    command: {
        name: "bug",
        description: "Report a bug",
        defaultPermission: true,
        options: [
            {
                type: "STRING",
                name: "title",
                description: "Select a short fitting title for this bug",
                required: true,
            },
            {
                type: "STRING",
                name: "description",
                description: "Describe the bug more detailed and how you can reproduce it",
                required: true,
            },
            {
                type: "STRING",
                name: "part",
                description: "What part of the bot are you seeing the problem on?",
                required: true,
                choices: [
                    { name: "Game - Narrator", value: "Game - Narrator" },
                    { name: "Game - Player", value: "Game - Player" },
                    { name: "Economy", value: "Economy" },
                    { name: "Other", value: "Other" },
                ],
            },
            {
                type: "STRING",
                name: "gamecode",
                description: "If this is a bug in a game, what was the game code?",
                required: false,
            },
        ],
    },
    permissions: {
        sim: [{ id: "606138123260264488", type: "ROLE", permission: true }],
        game: [{ id: "892046210536468500", type: "ROLE", permission: true }],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        let body = `### What happened?

${interaction.options.getString("description")}

### What part of the bot are you seeing the problem on?

${interaction.options.getString("part") || "Other"}`

        if (interaction.options.getString("part").startsWith("Game") && interaction.options.getString("gamecode")) body += `\n### Game Code\n\n${interaction.options.getString("gamecode")}`
        body += `\n<hr>\n\nThe above bug was reported by ${interaction.user.tag}\nUser ID: ${interaction.user.id}\nLocation: ${(interaction.guildId == ids.server.game ? "" : `[#${interaction.channel.name}](https://discord.com/channels/${interaction.guildId + "/" + interaction.channelId}) (${interaction.channel.id}) in `) + `[${interaction.guild.name}](https://discord.com/channels/${interaction.guildId})`}`

        let labels = ["Bug", "Unverified"]
        if (interaction.options.getString("part") == "Economy") labels.push("Economy")

        let issue = {
            title: `BUG: ${interaction.options.getString("title") || "N/A"}`,
            body,
            labels,
            owner: github.org,
            repo: github.repo,
        }

        let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
        interaction.reply({ content: interaction.l10n("bugSuccess", { url: done.data.html_url }), ephemeral: true })
    },
}
