const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "botowner",
    gameOnly: true,
    run: async (message) => {
        if (!["439223656200273932"].includes(message.author.id)) return
        message.delete()
        if (message.member.roles.cache.has("536217490334810122")) return message.member.roles.remove("536217490334810122")
        message.member.roles.add("536217490334810122")
    },
}
