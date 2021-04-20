const config = require("../../config.js")
const Discord = require("discord.js")
module.exports = {
    name: "emojilist",
    aliases: ["elist", "emojis", "allemojis", "emotes"],
    run: async (message, args, client) => {
        if (!client.guilds.cache.get(config.ids.server.sim).members.cache.get(message.author.id).roles.cache.has("663389088354664477")) return
        message.delete()
        message.author.send(client.userEmojis.map(x => `${x} - ${x.name}`).join("\n"), {split: true})
    },
}
