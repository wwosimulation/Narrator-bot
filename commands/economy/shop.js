const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

const { shop } = require("../../config")

module.exports = {
    name: "shop",
    run: async (message, args) => {
        if (["color", "colors", "colour", "colours"].includes(args[0])) {
            let embed = new MessageEmbed().setDescription(`${message.i10n("availableColors")}:\n\n`)
            shop.colors.forEach((x) => {
                embed.description += `${x.name} Color\n`
            })
            embed.setTitle(message.i10n("shopTitle")).setColor("#1FFF43")
            embed.setFooter(message.i10n("shopFooter"))
            return message.channel.send({ embeds: [embed] })
        } else {
            let row = new MessageActionRow()
            for (let i = 0; i < shop.embeds.length; i++) {
                row.addComponents(
                    new MessageButton()
                        .setStyle("SUCCESS")
                        .setLabel(`${message.i10n("page")} ${i + 1}`)
                        .setCustomId(`shoppage-${i + 1}`)
                )
            }
            let m = await message.reply({ embeds: [shop.embeds[0]], components: [row] })
            setTimeout(() => {
                row.components.forEach((x) => x.setDisabled(true))
                m.edit({ components: [row] })
            }, 30000)
        }
    },
}
