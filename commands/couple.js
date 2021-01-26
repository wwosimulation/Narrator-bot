const db = require("quick.db")


module.exports = {
    name: "couple",
    run: async (message, args, client) => {
        if (message.channel.name == "priv-cupid") {
            let alive = message.guild.roles.cache.find(r => r.name === "Alive")
            let nightCount = db.get(`nightCount_${message.guild.id}`) || 1
            let isNight = db.get(`isNight_${message.guild.id}`)
            if (nightCount > 1 || isNight != "yes" || !message.member.roles.cache.has(alive.id)) return message.channel.send("You already used your ability!")
            if (args.length != 2) return message.channel.send("Bruh, you just need 2 players to be in couple. Not more, not less.")
            let guy1 = message.guild.members.cache.find(m => m.nickname === args[0]) || 
            message.guild.members.cache.find(m => m.id === args[0]) ||  
            message.guild.members.cache.find(m => m.user.username === args[0]) || 
            message.guild.members.cache.find(m => m.user.tag === args[0])

            let guy2 = message.guild.members.cache.find(m => m.nickname === args[1]) || 
            message.guild.members.cache.find(m => m.id === args[1]) ||  
            message.guild.members.cache.find(m => m.user.username === args[1]) || 
            message.guild.members.cache.find(m => m.user.tag === args[1])

            if (!guy1 || !guy2 || guy1.nickname == message.member.nickname || guy2.nickname == message.member.nickname) return message.reply("Invalid Target!")

            if (!guy1.roles.cache.has(alive.id) || !guy2.roles.cache.has(alive.id)) return message.channel.send("You can't couple players that are dead moron...")

            if (db.get(`role_${guy1.id}`) == "President" || db.get(`role_${guy2.id}`) == "President") return message.channel.send("You can't make the president in love you snob.")


            db.set(`couple_${message.channel.id}`, [guy1.nickname, guy2.nickname])
            message.channel.send(`You decided to make player **${guy1.nickname} ${guy1.user.username}** and **${guy2.nickname} ${guy2.user.username}** fall in love!`)
            
        }
    }
}