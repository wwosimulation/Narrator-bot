const { emojis, fn } = require("../../config")
const { players } = require("../../db")

module.exports = {
    name: "inventory",
    description: "Lists your current inventory.",
    usage: `${process.env.PREFIX}inventory`,
    aliases: ["inv"],
    run: async (message, args, client) => {
        //if (message.channel.type != "dm") return message.channel.send("This command only works in DMs as it contains private information!")

        let data = await players.findOne({ user: message.author.id })

        // prettier-ignore
        let embed = { title: message.l10n("inventory"), author: {name: message.author.tag, iconURL: message.author.avatarURL()}, fields: [] }
        embed.fields.push({ name: "Coins", value: `${data.coins} ${emojis.coin}`, inline: true })
        embed.fields.push({ name: "Gems", value: `${data.gems} ${emojis.gem}`, inline: true })
        embed.fields.push({ name: "Roses", value: `${data.roses} ${emojis.rose}`, inline: true })
        embed.fields.push({ name: "Inventory:", value: `Roses: ${data.inventory.rose} ${emojis.rose}\nBouquets: ${data.inventory.bouquet} ${emojis.bouquet}\nLootboxes: ${data.inventory.lootbox} ${emojis.lootbox}` })

        message.channel.send({ embeds: [embed] })
    },
}
