const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require("discord.js")

module.exports = {
    name: "gamepanel",
    description: "Send the game panel.",
    usage: `${process.env.PREFIX}gamepanel`,
    run: async (message, args, client) => {
        if (message.author.id != "439223656200273932") return

        let button1 = new MessageButton().setStyle("SUCCESS").setLabel("Start a Quick Game").setCustomId("gp-start").setDisabled()
        let button2 = new MessageButton().setStyle("PRIMARY").setLabel("Request a Full Game").setCustomId("gp-request")
        let button3 = new MessageButton().setStyle("SECONDARY").setLabel("See the Last Game's Stats").setCustomId("gp-stats")
        let row = new MessageActionRow().addComponents(button1, button2, button3)
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(message.guild.name)
                    .setDescription("Welcome to Wolvesville Simulation! Select an option below!")
                    .setColor("PURPLE")
                    .setThumbnail(message.guild.iconURL({ dynamic: true })),
            ],
            components: [row],
        })
    },
}
