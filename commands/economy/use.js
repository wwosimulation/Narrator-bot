const db = require("quick.db")
const { lootbox, emojis } = require("../../config")
const shuffle = require("shuffle-array")
const { players } = require("../../db.js")
const pluralize = require("pluralize")

module.exports = {
    name: "use",
    description: "Use items from your inventory like lootboxes.",
    usage: `${process.env.PREFIX}use <item>`,
    cooldown: 4,
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send("Which item you are opening? Specify it next time.")
        let data = await players.findOne({ user: message.author.id })

        if (args[0].toLowerCase() == "lootbox") {
            let quantity = data.inventory.lootbox || 0
            let amount = (args[1] == "all" ? quantity : parseInt(args[1])) || 1
            if (quantity == 0) return message.channel.send("You don't have this item!")
            if (quantity < amount) return message.channel.send("You don't have that many lootboxes!")

            let t = await message.reply("Opening Lootbox...")

            let prizes = [
                { name: "Coin", id: "coin", amount: 0 },
                { name: "Rose", id: "rose", amount: 0 },
                { name: "Gem", id: "gem", amount: 0 },
                { name: "Bouquet", id: "bouquet", amount: 0 },
            ]
            for (let i = 0; i < amount; i++) {
                let item = shuffle(lootbox)[0]
                data.inventory.lootbox = data.inventory.lootbox - 1
                if (item.id != "other") {
                    if (["coin", "gem"].includes(item.id)) data[item.id + "s"] += item.amount
                    else data.inventory[item.id] += item.amount
                    prizes.find(x => x.id == item.id).amount += item.amount
                }
            }
            data.save()

            let str = "You recieved\n"
            for (let i = 0; i < prizes.length; i++) {
                if (prizes[i].amount > 0) {
                    let name = pluralize(prizes[i].name, prizes[i].amount)
                    str += `${emojis[prizes[i].id]} **${prizes[i].amount}** ${name}\n`
                }
            }
            str += `from the ${pluralize("lootbox", amount)} you opened!`

            setTimeout(() => {
                t.edit(str)
            }, 3000)
        } else if (args[0].toLowerCase() == "icon") {
            let quantity = db.get(`iconinv_${message.author.id}`) || 0
            if (quantity == 0) return message.channel.send("You don't have this item!")
            return message.channel.send("Icons are currently unavailable!")
        } else if (args[0].toLowerCase() === "description") {
            if (data.description === "") return message.channel.send("You don't have a profile description yet. You can buy it in the shop!")
            args[1] ? (args.shift(), await data.updateOne({ $set: { profileDesc: args.join(" ") } })) : message.channel.send("Please state your description after `description`")
            return message.channel.send({ content: "Your description has been updated!" })
        } else {
            return message.channel.send("This item does not exist!")
        }
    },
}
