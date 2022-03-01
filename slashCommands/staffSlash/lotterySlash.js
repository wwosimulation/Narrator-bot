const { ids, fn } = require("../../config")
const { lottery } = require("../../db.js")
const ms = require('ms')
const discord = require('discord.js')
module.exports = {
    command: {
        name: "lottery",
        description: "create an lottery",
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
                description: 'Enter how many tickets players are allowed to buy',
                required: true,

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
      let cost = interaction.getString("cost")
      let duration = interaction.getString("duration")
      let max = interaction.getString("max")
      
      if (isNaN(cost) || cost <= 0) return interaction.reply({ content: interaction.l10n("amountInvalid", { amount: cost }), ephemeral: true })
      if (isNaN(max) || max <= 0) return interaction.reply({ content: interaction.l10n("amountInvalid", { amount: max }), ephemeral: true })
      let time = ms(duration)
      if (!time) return interaction.reply({ content: interaction.l10n("timeInvalidFormat"), ephemeral: true })
      
      let embed = new discord.MessageEmbed()
      .setTitle(`New Lottery!`)
      .setDescription(`click 🎟 to enter!\nEnds in: <t:${Math.floor(new Date(Date.now() + time) / 1000)}:R>`)
      
      let button = new discord.MessageButton() 
      .setStyle("SUCCESS") 
      .setEmoji("🎟") 
      .setCustomId("lottery")
      
      let row = new discord MessageActionRow().addComponents(button)
      
      
      let msg = interaction.channel.send({ embeds: [embed], components: [row] })
      lottery.create({ id: msg.id })
    }
}
