const { Message, MessageReaction } = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "visit",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-red-lady") {
            let alive = message.guild.roles.cache.find(r => r.name === "Alive")
            let isNight = db.get(`isNight_${message.guild.id}`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("Umm no. Listen to yourself stupid..")
            if (!args[0]) return message.channel.send("I am not even gonna tell what's going on")

            let guy = message.guild.members.cache.find(m => m.nickname === args[0]) ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(m => m.user.username === args.join(" ")) ||
            message.guild.members.cache.find(m => m.user.tag === args.join(" "))

            if (isNight != "yes") return message.channel.send("Yo prostitute, pls do this in the night.")
            
            if (!guy || guy.id == message.author.id) return message.reply("Invalid Target!")

            if (!guy.roles.cache.has(alive.id)) return message.channel.send("Pls commit suicide... ")

            message.react("744571914034479126")
            db.set(`visit_${message.channel.id}`, guy.nickname)
        }
    }
}
