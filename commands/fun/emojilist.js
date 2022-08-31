const config = require("../../config")
const Discord = require("discord.js")
module.exports = {
    name: "emojilist",
    description: "Sends all available emojis and their names.",
    usage: `${process.env.PREFIX}emojilist`,
    aliases: ["elist", "emojis", "allemojis", "emotes"],
    run: async (message, args, client) => {
        if (!client.guilds.cache.get(config.ids.server.sim).members.cache.get(message.author.id).roles.cache.has("663389088354664477")) return
        message.delete()
        let emojis = client.userEmojis.map((x) => `${x} - ${x.name}`)
        // split emojis at \n and add them to bigger strings till they reach the max lenght of 2000
        let emojisArray = []
        let emojisString = ""
        for (let i = 0; i < emojis.length; i++) {
            if (emojisString.length + emojis[i].length + 1 >= 2000) {
                emojisArray.push(emojisString)
                emojisString = ""
            }
            emojisString += emojis[i] + "\n"
        }
        if (emojisString.length > 0) emojisArray.push(emojisString)
        // send each string in the array
        for (let i = 0; i < emojisArray.length; i++) {
            await message.author.send(emojisArray[i])
        }
    },
}
