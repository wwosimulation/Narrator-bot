const { github, ids, fn } = require("../../config")

module.exports = {
    command: {
        name: "suggestion",
        description: "Suggest a new feature for the bot.",
        defaultPermission: true,
    },
    permissions: {
        sim: [{ id: "606138123260264488", type: "ROLE", permission: true }],
        game: [{ id: "892046210536468500", type: "ROLE", permission: true }],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        // create an embed
        let embed = {
            title: "Suggestions",
            description: "To start a suggestion, please click the button below. You will be asked to provide some information about the suggestion.\nDo not abuse this feature as it can get you banned from using the bot.",
            color: 0x2f3136,
        }

        // create a button to start the suggestion
        let button = {
            type: 1,
            components: [{
                type: 2,
                label: "Start Suggestion",
                custom_id: "suggestion-start",
                style: 3,
            }]
        }

        // send the embed and button
        let repl = await interaction.reply({ embeds: [embed], components: [button], fetchReply: true })

        // wait for the user to click the button
        let coll = repl.createMessageComponentCollector({ idle: 15_000 })
        coll.on("collect", async (button) => {
            // suggestion modal
            let modal = {
                title: "Suggestion",
                custom_id: "suggestion-modal",
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "suggestion-title",
                        label: "Title",
                        style: 1,
                        placeholder: "Enter a short title for this suggestion",
                        required: true,
                        min_length: 1,
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "suggestion-description",
                        label: "Description",
                        style: 2,
                        placeholder: "Describe the suggestion more in detail",
                        required: true,
                        min_length: 20,
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "suggestion-part",
                        label: "Part",
                        style: 1,
                        placeholder: "For which part of the bot is this suggestion intended?",
                        required: true,
                        min_length: 4,
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "suggestion-origin",
                        label: "Origin",
                        style: 1,
                        placeholder: "Where is this suggestion from?",
                        required: false,
                    }]
                }]
            }

            // send the modal
            await button.showModal(modal)
        })

        coll.on("end", async () => {
            interaction.editReply(fn.disableButtons(repl));
        })
    },
}
