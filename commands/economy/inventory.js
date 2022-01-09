const Discord = require("discord.js")
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
        let embed = new Discord.MessageEmbed().setTitle(message.l10n("inventory"))
          .setAuthor(message.author.tag, message.author.avatarURL())
          .addField("Coins", `${data.coins} ${emojis.coin}`, true)
          .addField("Gems", `${data.gems} ${emojis.gem}`, true)
          .addField("Roses", `${data.roses} ${emojis.rose}`, true)
          .addField("Inventory:", `Roses: ${data.inventory.rose} ${emojis.rose}\nBouquets: ${data.inventory.bouquet} ${emojis.bouquet}\nLootboxes: ${data.inventory.lootbox} ${emojis.lootbox}`)

        message.channel.send({ embeds: [embed] })
    },
}
