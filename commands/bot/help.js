const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    run: async (message, args, client) => {
        let embed = new MessageEmbed()
            .setTitle("What do I got?")
            .setColor(0x7419b4)
            .addDescription(
                `**__How to join a simulation game?__**
When a game is live, it will be announced in <#606123818305585167>. Click on the join game button to join a game server.
Read more about how to play in <#859001588617445436>. Ranked games will be announced in <#860552178095882240>.

For any questions head over to the <#606123788257591297>.


`
            )
            .addField(
                "Economy",
                "`shop` Buy different items in the shop.\n" +
                "`daily` Get coins, roses, items as a daily reward.\n" +
                "`inventory` Find the roses, coins, items in your inventory.\n" +
                "`balance` Check how many narrator bot coins you got.\n" +
                "`namechange` Give your custom role a new name.\n" +
                "`use` Use this command with the item name such as lootbox, icon to use them."
            )
            .addField(
                "Fun",
                "`emoji` use emojis from different servers available from `emojilist`.\n" +
                "`write` Write something with fancy letters.\n"
            )
            .addField(
                "Bot",
                "`botinfo` Get to know more about the bot.\n" +
                "`bug` Report a bug to the development team.\n" +
                "`suggest` Suggest a improvement, enhancement for the simulation.\n" +
                "`roleinfo` Know more about the in game roles and interactions.\n"
            )
        message.channel.send({ embeds: [embed] })
    },
}
