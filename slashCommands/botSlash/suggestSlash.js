const { github, ids } = require("../../config")

module.exports = {
    command: {
        name: "suggest",
        description: "Suggest a new feature for the bot.",
        defaultPermission: true,
        options: [
            {
                type: "STRING",
                name: "title",
                description: "Select a short fitting title for this suggestion",
                required: true,
            },
            {
                type: "STRING",
                name: "description",
                description: "Describe the suggestion more detailed. Include everything you want us to know",
                required: true,
            },
            {
                type: "STRING",
                name: "part",
                description: "For which part of the bot is this suggestion intended",
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
                name: "origin",
                description: "Where is this suggestion from?",
                required: true,
                choices: [
                    { name: "Staff Vote", value: "Staff Vote" },
                    { name: "Community Vote", value: "Community Vote" },
                    { name: "Dev Assistant", value: "Dev Assistant" },
                    { name: "Member", value: "Member" },
                    { name: "Other", value: "Other" },
                ],
            },
        ],
    },
    permissions: {
        sim: [{ id: "606138123260264488", type: "ROLE", permission: true }],
        game: [{ id: "892046210536468500", type: "ROLE", permission: true }],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        let body = `### What is your suggestion?

${interaction.options.getString("description")}

### For which part of the bot is this suggestion intended?

${interaction.options.getString("part") ?? "Other"}

### Where is this suggestion from?

${interaction.options.getString("origin") ?? "Other"}`

        body += `\n<hr>\n\nThe above suggestion was sent by ${interaction.user.tag}\nUser ID: ${interaction.user.id}\nLocation: ${(interaction.guildId == ids.server.game ? "" : `[#${interaction.channel.name}](https://discord.com/channels/${interaction.guildId + "/" + interaction.channelId}) (${interaction.channel.id}) in `) + `[${interaction.guild.name}](https://discord.com/channels/${interaction.guildId})`}`

        let labels = ["Suggestion"]
        if (interaction.options.getString("part") == "Economy") labels.push("Economy")

        let issue = {
            title: `SUGGESTION: ${interaction.options.getString("title") ?? "N/A"}`,
            body,
            labels,
            owner: github.org,
            repo: github.repo,
        }

        let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
        interaction.reply({ content: interaction.l10n("suggestSuccess", { url: done.data.html_url }), ephemeral: true })
    },
}
