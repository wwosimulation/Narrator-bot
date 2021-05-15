const db = require("quick.db")
const Discord = require("discord.js")
const { lootbox, emojis } = require("../../config.js")
const shuffle = require("shuffle-array")

module.exports = {
    name: "use",
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send("Get a freaking life dude! You gotta specify an item!")

        if (args[0].toLowerCase() == "lootbox") {
            let quantity = db.get(`lootbox_${message.author.id}`) || 0
            if (quantity == 0) return message.channel.send("You don't have this item!")
            //return message.channel.send("Lootboxes are currently disabled right now, as the RNG was found to be flawed. Enjoy saving them up for the release in a couple days, and keep an eye on <#606123881824256000> for when they will be available to use!")

            let t = await message.inlineReply("Opening Lootbox...")

            let item = shuffle(lootbox)[0]
            setTimeout(async () => {
                await t.edit(`${emojis[item.id] ? `${emojis[item.id]} ` : ""}You recieved ${item.name} from the lootbox!${item.id == "other" ? "\nPlease contact Shadow for your prize!" : ""}`)
                db.subtract(`lootbox_${message.author.id}`, 1)
                if (item.id != "other") db.add(`${item.id == "coin" ? "money" : item.id}_${message.author.id}`, item.amount)
                
            }, 3000)
        } else {
            return message.channel.send("This item does not exist!")
        }
    },
}
