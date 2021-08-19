const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    run: async (message) => {
//         let embed = new MessageEmbed()
//             .setTitle("About Narrator Bot")
//             .setColor(0x7419b4)
//             .setDescription(
//                 `**__How to join a simulation game?__**
// When a game is live, it will be announced in <#606123818305585167>. Click on the join game button to join a game server.
// Read more about how to play in <#859001588617445436>. Ranked games will be announced in <#860552178095882240>.

// For any questions head over to the <#606123788257591297>.

// Use following commands with <@744538701522010174>'s prefix (+).
// `
//             )
//             .addField("Economy", "`shop` Buy different items in the shop.\n" + "`daily` Get coins, roses, items as a daily reward.\n" + "`inventory` Find the roses, coins, items in your inventory.\n" + "`balance` Check how many narrator bot coins you got.\n" + "`namechange` Give your custom role a new name.\n" + "`colorchange` Give your custom role a new color.\n" + "`profile` Checkout your exclusive profile. Available in the shop!\n" + "`use` Use this command with the item name such as lootbox, icon to use them.\n" + "`rose` Give rose(s)/bouquets during a game.")
//             .addField("Fun", "`emoji` use emojis from different servers available from `emojilist`.\n" + "`write` Write something with fancy letters and numbers.\n")
//             .addField("Bot", "`settings` Customise your preferred language for the bot replies.\n" + "`botinfo` Get to know more about the bot.\n" + "`bug` Report a bug to the development team.\n" + "`suggest` Suggest a improvement, enhancement for the simulation.\n" + "`roleinfo` Know more about the in game roles and interactions.\n")

        let embed = new MessageEmbed()
            .setTitle(message.i10n("helpHeader"))
            .setColor(0x7419b4)
            .setDescription(message.i10n("helpMain", {"game-warning": `<#606123818305585167>`, "how-to-play": "<#859001588617445436>", "ranked-warn": "<#860552178095882240>", "support-and-questions": "<#606123788257591297>", "clientUser": `<@${client.user.id}>`, "prefix": process.env.prefix}))
            .addField(message.i10n("economy"), message.i10n("helpEconomy"))
            .addField(message.i10n("fun"), message.i10n("helpEconomy"))
            .addField(message.i10n("bot"), message.i10n("helpEconomy"))
        message.channel.send({ embeds: [embed] })
    },
}
