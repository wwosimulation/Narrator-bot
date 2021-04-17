const db = require("quick.db")

module.exports = {
    name: "logs",
    run: async (message, args, client) => {
        let logs = db.get(`logs`)
        message.channel.send(new require("discord.js").MessageEmbed().setTitle("Logs").setDescription(logs))
        message.delete()
    }
}