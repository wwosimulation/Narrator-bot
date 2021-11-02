const { rosewheel } = require("../../config/src")
const { sleep } = require("../../config/src/fn")
const players = require("../../schemas/players")

module.exports = {
    name: "rosewheel",
    description: "Spin the rosewheel for 30 roses and win awsome prizes!",
    usage: `${process.env.PREFIX}rosewheel`,
    aliases: ["rw", "spin"],
    run: async (message, args, client) => {
        let guy = await players.findOne({ user: message.author.id })
        if (!guy || !guy.roses >= 30) return message.channel.send(message.l10n("notEnoughCurrency", { currency: "roses" }))

        let prize = rosewheel[Math.floor(Math.random() * rosewheel.length)]
        let res = ["Congratulations! You won {prize}!", "{prizeAmount} wild {prizeName} appeared! You successfully cought the {prizeName}.", "You found {prize}!", "The rosewheel reveals {prize}!"] // Will be replaced with l10n strings later
        let msg = message.channel.send("The wheel is spinning...")
        await sleep(2500)
        let update = {}
        let response = res[Math.floor(Math.random() * res.length)]
            .replace(/{prize}/g, prize.name)
            .replace(/{prizeAmount}/g, prize.amount)
            .replace(/{prizeName}/g, prize.name.split(" ").slice(-1)[0])

        switch (prize.item) {
            case "coin": {
                update["coins"] = prize.amount
                break
            }
            case "lootbox": {
                update["inventory.lootbox"] = prize.amount
                break
            }
            case "rose": {
                update["inventory.rose"] = prize.amount
                break
            }
            case "other": {
                update["coins"] = prize.amount
                break
            }
            default: {
                update[prize.item] = prize.amount
                break
            }
        }
        await guy.updateOne({ $inc: update })
        msg.edit(response)
    },
}
