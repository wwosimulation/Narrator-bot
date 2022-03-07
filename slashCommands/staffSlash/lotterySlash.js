const { ids, fn, getEmoji } = require("../../config")
const { lottery } = require("../../db.js")
const ms = require("ms")
const discord = require("discord.js")

module.exports = {
    command: {
        name: "lottery",
        description: "Manage the lottery",
        options: [
            {
                type: "SUB_COMMAND",
                name: "create",
                description: "Create a lottery",
                options: [
                    {
                        type: "STRING",
                        name: "cost",
                        description: "Enter the cost of 1 ticket",
                        required: true,
                    },
                    {
                        type: "STRING",
                        name: "duration",
                        description: "Enter the lottery duration",
                        required: true,
                    },
                    {
                        type: "STRING",
                        name: "max",
                        description: "Enter how many tickets players are allowed to buy",
                        required: true,
                    },
                ],
            },
            {
                type: "SUB_COMMAND",
                name: "end",
                description: "End a lottery",
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
        let sub = interaction.options.getSubcommand()
        switch (sub) {
            case "create": {
                let cost = interaction.options.getString("cost")
                let duration = interaction.options.getString("duration")
                let max = interaction.options.getString("max")

                let lot = lottery.find()
                if (lot.length == 1) {
                    return interaction.reply({ content: `There already is a lottery going on, please wait for it to end or end it yourself.`, ephemeral: true })
                }
                if (isNaN(cost) || cost <= 0) return interaction.reply({ content: interaction.l10n("amountInvalid", { amount: cost }), ephemeral: true })
                if (isNaN(max) || max <= 0) return interaction.reply({ content: interaction.l10n("amountInvalid", { amount: max }), ephemeral: true })

                let time = ms(duration)
                if (!time) return interaction.reply({ content: interaction.l10n("timeInvalidFormat"), ephemeral: true })

                let embed = new discord.MessageEmbed().setTitle(`New Lottery!`).setDescription(`Ticket cost: ${cost} ${getEmoji("coin", client)}\nclick 🎟 to enter!\nEnds in: <t:${Math.floor(new Date(Date.now() + time) / 1000)}:R>\n\nParticipants: 0\nTickets bought: 0 \nPot size: 0 ${getEmoji("coin", client)}`)
                let button = new discord.MessageButton().setStyle("SUCCESS").setEmoji("🎟").setCustomId("joinlottery")
                let row = new discord.MessageActionRow().addComponents(button)

                let chan = client.channels.cache.get("947930500725616700")
                let msg = await chan.send({ embeds: [embed], components: [row] })
                lottery.create({ endDate: `${Math.floor(new Date(Date.now() + time))}`, msg: msg.id, max: max, cost: cost })
                break
            }
            case "end": {
                let winner = interaction.options.getString("winner")
                let lot = await lottery.find()

                if (lot.length == 0) {
                    return interaction.reply({ content: `There is no lottery going on.`, ephemeral: true })
                }
                lot = lot[0]
                let logs = client.channels.cache.get("949248776500031508")
                logs.send(`${lot}`)
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
                        let msg = await chan.messages.fetch(lot.msg)
                        msg.edit({ components: [] })
                    }
                    interaction.reply({ content: `The lottery has ended!`, ephemeral: true })
                    let player = await players.findOne({ user: person.id })
                    player.coins += lot.pot
                    player.save()
                    lot.remove()
                }
                break
            }
            default: {
                interaction.reply({ content: "An error occurred!" })
                break
            }
        }
    },
}
