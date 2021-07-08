const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

const { shop, emojis, fn } = require("../../config")

module.exports = {
    name: "shop",
    run: async (message, args, client) => {
        let embeds = [new MessageEmbed()]

        if (["color", "colors", "colour", "colours"].includes(args[0])) {
            embeds[0].setDescription("Available colors:\n\nUse \`+buy <color> role\` to purchase a color")
            shop.colors.forEach((x) => {
                embeds[0].description += `${x.name} Color\n`
            })
            embeds[0].setTitle("Wolvesville Simulation Store").setColor("#1FFF43")
            return message.channel.send(embeds[0])
        } else {
            let row = new MessageActionRow()
            for (let i = 0; i < shop.embeds.length; i++) {
                row.addComponents(new MessageButton().setStyle("SUCCESS").setLabel(`Page ${i + 1}`).setCustomID(`shoppage-${i + 1}`))
            }
            let m = await message.reply({ embeds: [shop.embeds[0]], components: [row] })
            setTimeout(() => {
                row.components.forEach(x => x.setDisabled(true))
                m.edit({components: [row]})
            }, 30000)
        }

    }
}

