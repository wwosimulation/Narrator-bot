const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

const { shop } = require("../../config")

module.exports = {
    name: "shop",
    description: "Displays the shop with all items you can buy. It can also list available colors to buy.",
    usage: `${process.env.PREFIX}shop [color]`,
    run: async (message, args, client) => {
        if (["color", "colors", "colour", "colours"].includes(args[0])) {
            let embed = new MessageEmbed().setDescription(`${message.l10n("availableColors")}:\n\n`)
            shop.colors.forEach((x) => {
                embed.description += `${x.name} Color\n`
            })
            embed.setTitle(message.l10n("shopTitle")).setColor("#1FFF43")
            embed.setFooter(message.l10n("shopFooter"))
            return message.channel.send({ embeds: [embed] })
        } else {
            let row = new MessageActionRow()
            for (let i = 0; i < shop.embeds.length; i++) {
                row.addComponents(
                    new MessageButton()
                        .setStyle("SUCCESS")
                        .setLabel(`${message.l10n("page")} ${i + 1}`)
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
