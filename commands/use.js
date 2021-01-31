const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "use",
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send("Get a freaking life dude")
        
        if (args[0].toLowerCase() == "lootbox") {
            let items = ["roses", "coins"]
            let roses = [1, 1, 1, 1, 1, 5, 5]
            let coins = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 15, 15, 15, 30, 30, 50]

            let quantity = db.get(`lootbox_${message.author.id}`) || 0
            if (quantity == 0) return message.channel.send("You don't have this item dumb.")
            db.subtract(`lootbox_${message.author.id}`, 1)
            let t = await message.author.send("Opening Lootbox...").catch(e => {
                return message.channel.send(`Error: ${e.message}.\nPlease enable DMs with me.`)
            })
            setTimeout(async () => {
                let item = items[Math.floor(Math.random() * 2)]
                let amt 
                if (item == "roses") {
                    amt = roses[Math.floor(Math.random() * 2)]
                    if (amt == 1) {
                        item = "bouquet of roses"
                        db.add(`roseBouquet_${message.author.id}`, 1)
                    } else {
                        db.add(`rosesG_${message.author.id}`, 5)
                    }
                } else {
                    amt = coins[Math.floor(Math.random * coins.length)]
                    db.add(`money_${message.author.id}`, amt)
                }
                await t.edit(`You recieved ${amt} ${item} from the lootbox!`)
            })
        } else {
            return message.channel.send("You are lost and dumb. This item does not exist!")
        }
    }
}
