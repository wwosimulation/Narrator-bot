const { github, ids } = require("../config")
const players = require("../schemas/players")
const l10n = require("../l10n")

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isModalSubmit()) return;

        function getValue(customID) {
            return interaction.components.find(component => component.components.some(field => field.customId == customID)).components.find(field => field.customId == customID).value;
        }

        interaction.dbUser = await players.findOne({ user: interaction.user.id }).exec()
        if (!interaction.dbUser) interaction.dbUser = await players.create({ user: interaction.author.id })

        interaction.l10n = (key, replaceKeys = {}, language = interaction.dbUser.language) => {
            if (!language) language = "en"
            let string = l10n(key, language, replaceKeys)
            return string
        }

        switch (interaction.customId) {
            case "bug-modal": {
                let title = getValue("bug-title");
                let description = getValue("bug-description");
                let part = getValue("bug-part");
                let gamecode = getValue("bug-gamecode");

                let body = `### What happened?\n\n${description}\n\n### What part of the bot are you seeing the problem on?\n\n${part}\n\n${gamecode ? `### Game Code\n\n${gamecode}` : ""}`;
                body += `\n<hr>\n\nThe above bug was reported by\n**Username:** ${interaction.user.tag}\n**User ID:** ${interaction.user.id}`;

                let labels = ["Bug", "Unverified"]
                if (part.toLowerCase().includes("economy")) labels.push("Economy")

                let issue = {
                    title: `BUG: ${title}`,
                    body,
                    labels,
                    owner: github.org,
                    repo: github.repo,
                }

                let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
                let r = await interaction.reply({ content: interaction.l10n("bugSuccess", { url: done.data.html_url }), fetchReply: true })

                await client.github.request(`PATCH /repos/${github.org}/${github.repo}/issues/${done.data.number}`, {
                    body: body + `\n**Message:** [here](${r.url})`,
                })
                break;
            }
            case "suggestion-modal": {
                let title = getValue("suggestion-title");
                let description = getValue("suggestion-description");
                let part = getValue("suggestion-part");
                let origin = getValue("suggestion-origin");

                let body = `### What is your suggestion?\n\n${description}\n\n### For which part of the bot is this suggestion intended?\n\n${part}\n\n### Where is this suggestion from?\n\n${origin ? origin : "Member"}`;

                let labels = ["Suggestion"]
                if (part.toLowerCase().includes("economy")) labels.push("Economy")

                body += `\n<hr>\n\nThe above suggestion was suggested by\n**Username:** ${interaction.user.tag}\n**User ID:** ${interaction.user.id}`;

                let issue = {
                    title: `SUGGESTION: ${title}`,
                    body,
                    labels,
                    owner: github.org,
                    repo: github.repo,
                }

                let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
                let r = await interaction.reply({ content: interaction.l10n("suggestSuccess", { url: done.data.html_url }), fetchReply: true })

                await client.github.request(`PATCH /repos/${github.org}/${github.repo}/issues/${done.data.number}`, {
                    body: body + `\n**Message:** [here](${r.url})`,
                })
                break;
            }
        }
    });
}