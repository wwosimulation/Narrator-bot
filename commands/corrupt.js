const db = require("quick.db")

module.exports = {
    name: "corrupt",
    gameOnly: true,
    aliases: ["glitch"],
    run: async (message, args, client) => {
        if (message.channel.name == "priv-corruptor") {
            let alive = message.guild.roles.cache.find(r => r.name === "Alive")
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("If i let you do that, I'd be more corrupt than you...")
            if (!args[0]) return message.channel.send("Why glitch someone when you can glitch NOTHING!! Genius, right?")
            let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || 
            message.guild.members.cache.find(m => m.id === args[0]) ||  
            message.guild.members.cache.find(m => m.user.username === args[0]) || 
            message.guild.members.cache.find(m => m.user.tag === args[0])
            
            if (!guy || guy == message.member) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("So you want to glitch someone who can't talk or vote. Very usefull. Here's another tip: `+suicide` kills all players and makes you win alone!")

            message.channel.send(`<:corrupt:745632706838396989> You have decided to corrupt **${guy.nickname} ${guy.user.username}**!`)
            db.set(`corrupt_${message.channel.id}`, guy.nickname)
        }
    }
}