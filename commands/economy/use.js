const db = require("quick.db")
const { lootbox, emojis } = require("../../config")
const shuffle = require("shuffle-array")
const { players } = require("../../db.js")

module.exports = {
    name: "use",
    description: "Use items from your inventory like lootboxes.",
    usage: `${process.env.PREFIX}use <item>`,
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send("Which item you are opening? Specify it next time.")
        let data = await players.findOne({ user: message.author.id })

        if (args[0].toLowerCase() == "lootbox") {
            let quantity = data.inventory.lootbox || 0
            if (quantity == 0) return message.channel.send("You don't have this item!")
            //return message.channel.send("Lootboxes are currently disabled right now, as the RNG was found to be flawed. Enjoy saving them up for the release in a couple days, and keep an eye on <#606123881824256000> for when they will be available to use!")

            let t = await message.reply("Opening Lootbox...")

            let item = shuffle(lootbox)[0]
            setTimeout(async () => {
                await t.edit(`${emojis[item.id] ? `${emojis[item.id]} ` : ""}You recieved ${item.name} from the lootbox!${item.id == "other" ? "\nPlease contact Staff for your prize!" : ""}`)
                data.inventory.lootbox = data.inventory.lootbox - 1
                if (item.id != "other") {
                    if (item.id == "coin") {
                        data.coins += item.amount
                    } else {
                        data.inventory[item.id] += item.amount
                    }
                }
                data.save()
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
