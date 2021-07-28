const { MessageEmbed } = require("discord.js")
const { emojis, fn } = require("../../config")
const { players } = require("../../db")


module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    usage: `${process.env.PREFIX}leaderboard [page] [coins | roses | gems | xp]`,
    run: async (message, args, client) => {

        async function getTag(userID) {
            return client.users.fetch(userID).tag
        }

        let sort = "coins" //default
        let all_arr = []
        let page = 1 //default
        let lb_type = "Coin" //default
        let lb_arr = []
        let desc = ""
        let sorts = ["coins", "roses", "gems", "xp"]
        let types = ["Coin", "Rose", "Gem", "Xp"]

        if(isNaN(args[0]) && sorts.includes(args[0])) sort = args[0], lb_type = types[sorts.indexOf(sort)]
        if(!isNaN(args[0])) page = parseInt(args[0])
        if(args[1] && isNaN(args[1]) && sorts.includes(args[1])) sort = args[1], lb_type = types[sorts.indexOf(sort)]

        await players.find({}).sort({coins: -1}).forEach(player => {
            all_arr.push({userID: player.user, coins: player[sort]})
        });

        lb_arr = all_arr.splice((page - 1) * 10, page * 10 - 1)

        lb_arr.forEach( user => {
            desc = desc + `${user.coins} - ${getTag(user.userID)}\n`
        })

        let lb = new MessageEmbed()
        .setFooter(`${page}/${Math.ceil(all_arr.length / 10)}`)
        .setTitle(`${lb_type} Leaderboard`)
        .setColor("#1FFF43")
        .setDescription(desc)

        message.channel.send({embeds: [lb]})

    },
}
