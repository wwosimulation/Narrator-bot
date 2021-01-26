const db = require("quick.db")
const Discord = require("discord.js")


module.exports = {
    name: "tictactoe",
    aliases: ["ttt"],
    run: async (message, args, client) => {
        if (args[0] == "bet") {
            if (db.get(`hostedttt`) == true) return message.channel.send("A game is already being hosted!")
            if (!args[1]) return message.channel.send("You need to bet something dummy.")
            if (isNaN(args[1]) || args[1] < 10 || args[1] > 250) return message.channel.send("The bet was either not a number, the bet was below 10 or the bet was above 250")
            message.channel.send(new Discord.MessageEmbed().setTitle("A game has started!").setDescription(`The bet of this game is ${args[1]}! To join, do \`+ttt join\``))
            db.set(`hostttt`, message.author.id)
            db.set(`hostedttt`, true)
        }
        if (args[0] == "join") {
            if (db.get('startedttt') === true) return message.channel.send("The game has already started!")
            if (db.get(`hostttt`) == message.author.id) return message.channel.send("You are the host of this game ...")
            message.channel.send("Starting the game...\n\nAs usual, the host of the game starts first. They will be ")
            let m = ":black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square:"
            let t = await message.channel.send(":black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square:\n:black_large_square::black_large_square::black_large_square:")
            const reactions = ["➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "⏹️"]
            await t.react("↖️")
            await t.react("⬆️")
            await t.react("↗️")
            await t.react("⬅️")
            await t.react("⏹️")
            await t.react("➡️")
            await t.react("↙️")
            await t.react("⬇️")
            await t.react("↘️")

            const filter = (reaction, user) => reactions.includes(reaction.emoji.name)
            const collector = t.createReactionCollector(filter, {time: 700000})
            collector.on('collect', async () => {
                await t.edit("Test")
            })
        }
    }
}