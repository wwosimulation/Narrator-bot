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
        let errorReply = ""

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
        /* args[1] is the page */
        if (!isNaN(args[1])) page = parseInt(args[1])

        if (args[0] && isNaN(args[0]) && !sortedByOptions.includes(args[0])) errorReply = `\`${args[0]}\` is neither a valid page nor a valid leaderboard type!\n`
        if (args[1] && isNaN(args[1]) && !sortedByOptions.includes(args[0])) errorReply += `\`${args[1]}\` is neither a valid page nor a valid leaderboard type!\n`

        let obj = {}
        obj[sortedBy] = -1
        let obj2 = {}
        obj2[sortedBy] = { $gt: 0 }

        let embeds = []
        let embedItemArray = []
        let currentEmbedItems = []

        await (
            await players.find(obj2).sort(obj)
        ).forEach((player) => {
            if (currentEmbedItems.length < 10) currentEmbedItems.push({ userID: player.user, value: player[sortedBy] })
            else {
                embedItemArray.push(currentEmbedItems)
                currentEmbedItems = [{ userID: player.user, value: player[sortedBy] }]
            }
        })
        embedItemArray.push(currentEmbedItems)

        function getTag(userID) {
            let user = client.users.cache.find((user) => user.id === userID)
            if (!user) return "N/A"
            else return user.tag
        }
        /* 
    Only visualization! 
    embedItemArray = [[{}, {}, {}], [{}, {}, {}]]
    */

        embedItemArray.forEach(async (arr, i, embedItemArr) => {
            let description = ""
            arr.forEach((item) => {
                if (getTag(item.userID).includes("#")) description = description + `${item.value} - ${getTag(item.userID)}\n`
            })
            let embed = new MessageEmbed({ title: `${lbType} Leaderboard`, description: description, color: "#1FFF43", footer: { text: `Page ${i + 1}/${embedItemArr.length}` } }).setTimestamp()

            embeds.push(embed)
        })

        let msg

        if (!embeds[page - 1]) (msg = await message.channel.send({ content: errorReply + `${message.author}, page ${page} does not exist on this leader board!`, embeds: [embeds[0]] })), (page = 1)
        else {
            if (errorReply !== "") msg = await message.channel.send({ content: errorReply, embeds: [embeds[page - 1]] })
            else msg = await message.channel.send({ embeds: [embeds[page - 1]] })
        }

        client.buttonPaginator(message.author.id, msg, embeds, page)
    },
}
