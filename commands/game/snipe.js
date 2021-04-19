const db = require("quick.db")

module.exports = {
    name: "snipe",
    run: async (message, args, client ) => {
        if (message.channel.name === "priv-sheriff") {
            let alive = message.guild.roles.cache.find(r => r.name === "Alive")
            let guy = 
            message.guild.members.cache.find(m => m.nickname === args[0]) || 
            message.guild.members.cache.find(m => m.user.username === args[0]) || 
            message.guild.members.cache.find(m => m.id === args[0]) || 
            message.guild.members.cache.find(m => m.user.tag === args[0]) 
            let isNight = db.get(`isNight`) 
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("THE NEXT TIME YOU TRY TO BREAK ME, YOU WILL SEE YOUR NAME IN <#>.")
            if (isNight != "yes") return message.channel.send("How are you gonna check who killed who if you do it in the day?")
            if (!args[0]) return message.channel.send("You know, dumbvill isn't that far from here.")
            if (!guy || guy.id == message.author.id) return message.reply("Invalid Target!")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("As Sheriff, you need to CHECK a player that is ALIVE and they must be DEAD when DAY STARTS. Hope you can understand English moron.")
            message.react("789734103364272148")
            db.set(`snipe_${message.channel.id}`, guy.nickname)
        }
    }
}