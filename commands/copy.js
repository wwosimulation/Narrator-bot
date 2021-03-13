const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "copy",
    run: async (message, args, client) => {
        if (message.channel.name == "priv-doppelganger") {
            const night = db.get(`nightCount_${message.guild.id}`) || 1
            const isNight = db.get(`isNight_${message.guild.id}`) || "yes"
            const alive = message.guild.roles.cache.find(r => r.name === "Alive")

            if (night != 1 || isNight != "yes") return message.channel.send("You can only copy on the first night nucklehead")

            if (!args[0]) return message.channel.send("How do you want me to find a player!")

            let guy = message.guild.members.cache.find(m => m.nickname === args[0]) ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(m => m.user.username === args.join(" ")) ||
            message.guild.members.cache.find(m => m.user.tag === args.join(" "))

            if (!guy || !guy.roles.cache.has(client.config.ids.alive)) return message.reply("Invalid Target!")

            db.set(`copy_${message.channel.id}`, guy.nickname)
            message.react("787582587593162762")

        }
    }
}