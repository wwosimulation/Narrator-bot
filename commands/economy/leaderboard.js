const { MessageEmbed } = require("discord.js")
const { players } = require("../../db")

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    description: "Displays the current leaderboard for coins, roses, gems or XP!",
    usage: `${process.env.PREFIX}leaderboard [page] [coins | roses | gems | xp]`,
    run: async (message, args, client) => {
        // required sorting and embed variables
        let page = 1 //default
        let sortedBy = "coins" // default
        let lbType = "Coin" //default

        // extended arrays to check arguments and modify embed title
        let sortedByOptions = ["coins", "roses", "gems", "xp"]
        let lbTypes = ["Coin", "Rose", "Gem", "Xp"]

        //checking args and changeing line 12-14
        /* args[0] is the leader board type (coins etc) */
        if (isNaN(args[0]) && sortedByOptions.includes(args[0])) (sortedBy = args[0]), (lbType = lbTypes[sortedByOptions.indexOf(sortedBy)])
        /* args[0] is the page */
        if (!isNaN(args[0])) page = parseInt(args[0])
        /* args[1] is the leader board type */
        if (isNaN(args[1]) && sortedByOptions.includes(args[1])) (sortedBy = args[1]), (lbType = lbTypes[sortedByOptions.indexOf(sortedBy)])
        else {
            message.channel.send(`Invalid arguments! Please use \`${this.usage}\`\n`)
        }

        let obj = {}
        obj[sortedBy] = -1

        let embeds = []
        let embedItemArray = []
        let currentEmbedItems = []

        await (
            await players.find({}).sort(obj)
        ).forEach((player) => {
            if (currentEmbedItems.length <= 10) currentEmbedItems.push({ userID: player.user, value: player.player[sortedBy] })
            else {
                embedItemArray.push(currentEmbedItems)
                currentEmbedItems = [{ userID: player.user, value: player.player[sortedBy] }]
            }
        })
        embedItemArray.push(currentEmbedItems)

        async function getTag(userID) {
            let user = client.users.resolve(userID)
            return user.tag
        }
        /* 
    Only visualization! 
    embedItemArray = [[{}, {}, {}], [{}, {}, {}]]
    */

        await embedItemArray.forEach(async (arr, i, embedItemArr) => {
            let description = ""
            await arr.forEach((item) => {
                description = description + `${item.value} - ${getTag(item.userID)}\n`
            })
            embed = new MessageEmbed()
                .setDescription(description)
                .setColor("#1FFF43")
                .setTimestamp()
                .setFooter(`Page ${i + 1}/${embedItemArr.length}`)
                .setTitle(`${lbType} Leaderboard`)

            embeds.push(embed)
        })

        let msg

        if (!embeds[page - 1]) (msg = await message.channel.send({ content: `${message.author}, page ${page} does not exist in this leader board!`, embeds: [embeds[0]] })), (page = 1)
        else {
            msg = await message.channel.send({ embeds: embeds[page - 1] })
        }

        client.paginator(message.author, msg, embeds, page)
    },
}
