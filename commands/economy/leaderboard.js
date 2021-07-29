const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js")
const { emojis, fn } = require("../../config")
const { players } = require("../../db")

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    usage: `${process.env.PREFIX}leaderboard [page] [coins | roses | gems | xp]`,
    run: async (message, args, client) => {
        async function getTag(userID) {
            return await client.users.fetch(userID).tag
        }

        let sort = "coins" //default
        let all_arr = []
        let page = 1 //default
        let lb_type = "Coin" //default
        let lb_arr = []
        let desc = ""
        let sorts = ["coins", "roses", "gems", "xp"]
        let types = ["Coin", "Rose", "Gem", "Xp"]
        let i = 0
        let n = 1

        if (isNaN(args[0]) && sorts.includes(args[0])) (sort = args[0]), (lb_type = types[sorts.indexOf(sort)])
        if (!isNaN(args[0])) page = parseInt(args[0])
        if (args[1] && isNaN(args[1]) && sorts.includes(args[1])) (sort = args[1]), (lb_type = types[sorts.indexOf(sort)])

        const drop = new MessageSelectMenu({ customId: `leaderboard-${sort}-${message.id}`, placeholder: "Select page", options: [{ label: n.toString(), value: n.toString(), description: `Go to page ${n}`, default: true }] })

        let obj = {}
        obj[sort] = -1
        await (
            await players.find({}).sort(obj)
        ).forEach((player) => {
            all_arr.push({ userID: player.user, value: player[sort] })
            i = i + 1
            if (i == 10) {
                i = 0
                n = n + 1
                drop.addOptions({ label: n.toString(), value: n.toString(), description: `Go to page ${n}` })
            }
        })

        lb_arr = all_arr.splice((page - 1) * 10, 10)
        lb_arr.forEach((user) => {
            desc = desc + `${user.value} - ${getTag(user.userID)}\n`
        })

        let max_page = Math.ceil(all_arr.length / 10)
        let lb = new MessageEmbed().setFooter(`${page}/${max_page}`).setTitle(`${lb_type} Leaderboard`).setColor("#1FFF43").setDescription(desc)

        let row = new MessageActionRow().addComponents(drop)
        if (!args[3]) {
            let msg = await message.channel.send({ embeds: [lb], components: [row] })
            setTimeout(() => {
                row.components.forEach((x) => x.setDisabled(true))
                await msg.edit({ components: [row], content: "This message is now inactive!" })
            }, 30000)
        }
        if (args[3]) {
            try {
                let chn = await client.channels.fetch(args[2])
                let m = await chn.messages.fetch(args[3])
                args[2].edit({ embeds: [lb], components: [row] })
            } catch (err) {
                console.log(err)
                args[2].delete()
                let msg = await message.channel.send({ embeds: [lb], components: [row] })
                setTimeout(() => {
                    row.components.forEach((x) => x.setDisabled(true))
                    await msg.edit({ components: [row], content: "This message is now inactive!" })
                }, 30000)
            }
        }
    },
}
