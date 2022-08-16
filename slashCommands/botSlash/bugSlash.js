const { fn } = require("../../config")

module.exports = {
    command: {
        name: "bug",
        description: "Report a bug",
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
            title: "Bug Reports",
            description: "To start a bug report, please click the button below. You will be asked to provide some information about the bug.\nDo not abuse this feature as it can get you banned from using the bot.",
            color: 0x2f3136,
        }

        // create a button to start the bug report
        let button = {
            type: 1,
            components: [{
                type: 2,
                label: "Start Bug Report",
                custom_id: "bug-start",
                style: 3,
            }]
        }

        // send the embed and button
        let repl = await interaction.reply({ embeds: [embed], components: [button], fetchReply: true })

        // wait for the user to click the button
        let coll = repl.createMessageComponentCollector({ idle: 15_000 })
        coll.on("collect", async (button) => {
            // bug modal
            let modal = {
                title: "Bug Report",
                custom_id: "bug-modal",
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "bug-title",
                        label: "Title",
                        style: 1,
                        placeholder: "Enter a short title for this bug",
                        required: true,
                        min_length: 1,
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "bug-description",
                        label: "Description",
                        style: 2,
                        placeholder: "Describe the bug more detailed and how you can reproduce it",
                        required: true,
                        min_length: 20,
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "bug-part",
                        label: "Part",
                        style: 1,
                        placeholder: "What part of the bot are you seeing the problem on?",
                        required: true,
                        min_length: 4,
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "bug-gamecode",
                        label: "Game Code",
                        style: 1,
                        placeholder: "If this is a bug in a game, what was the game code?",
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
