const { shop } = require("../../config")

module.exports = {
    name: "shop",
    description: "Displays the shop with all items you can buy. It can also list available colors to buy.",
    usage: `${process.env.PREFIX}shop [color]`,
    run: async (message, args, client) => {
        if (["color", "colors", "colour", "colours"].includes(args[0])) {
            let embed = { title: message.l10n("shopTitle"), color: 0x1fff43, description: `${message.l10n("availableColors")}:\n\n`, footer: { text: message.l10n("shopFooter") } }
            shop.colors.forEach((x) => {
                embed.description += `${x.name} Color\n`
            })
            return message.channel.send({ embeds: [embed] })
        } else {
            let row = { type: 1, components: [] }
            for (let i = 0; i < shop.embeds.length; i++) {
                row.components.push({ type: 2, style: 3, label: `${message.l10n("page")} ${i + 1}`, custom_id: `shoppage-${i + 1}` })
            }
            let m = await message.reply({ embeds: [shop.embeds[0]], components: [row] })
            setTimeout(() => {
                row.components.forEach((x) => (x.disabled = true))
                m.edit({ components: [row] })
            }, 30000)
        }
    },
}
