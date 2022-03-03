const { ids, fn, getEmoji } = require("../../config")
const { lottery } = require("../../db.js")
const ms = require("ms")
const discord = require("discord.js")
module.exports = {
    command: {
        name: "endLottery",
        description: "end an lottery",
        options: [
            {
                type: "STRING",
                name: "winner",
                description: "Decide if there should be a winner or not.",
                required: true,
                choices: [
                    { name: "yes", value: "yes" },
                    { name: "no", value: "no" },
                ],
            },
        ],
        defaultPermission: false,
    },
    permissions: {
        sim: [
            { id: ids.staff, type: "ROLE", permission: true }, // @Staff
            { id: ids.afkstaff, type: "ROLE", permission: true }, //@AFK STAFF
            { id: "606167032425218084", type: "ROLE", permission: false }, // @Member
        ],
    },
    server: ["sim"],
    run: async (interaction, client) => {
        let winner = interaction.options.getString("winner")
        let lot = await lottery.find()

        if (lot.length == 1) {
            return interaction.reply({ content: `There is no lottery going on.`, ephemeral: true })
        }
        lot = lot[0]

        if (winner == "no") {
            let msg = await interaction.channel.messages.fetch(lot.msg)
            msg.edit({ components: [] })
            lot.remove()

            return interaction.reply({ content: `The lottery has been ended without a winner being chosen!`, ephemeral: true })
        } else {
            let chan = client.channels.cache.get("947930500725616700")
            if (lot.participants.length == 0) {
                chan.send(`No one has joined this lottery, so no winner.`)
            } else {
                let winner = fn.randomWeight(lot.participants)
                let person = client.users.cache.find((u) => u.id === winner)
                chan.send(`Congratulations to ${person} for winning the lottery! You have won ${lot.pot} ${getEmoji("coin", client)}, they have been added to your balance.`)
                let msg = await interaction.channel.messages.fetch(lot.msg)
                msg.edit({ components: [] })
            }
            return interaction.reply({ content: `The lottery has ended!`, ephemeral: true })
            lot.remove()
        }
    },
}
