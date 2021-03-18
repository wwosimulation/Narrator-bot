const db = require("quick.db")


module.exports = {
    name: "sword",
    run: async (message, args, client) => {
        
                let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || 
            message.guild.members.cache.find(m => m.id === args[0]) ||  
            message.guild.members.cache.find(m => m.user.username === args[0]) || 
            message.guild.members.cache.find(m => m.user.tag === args[0])
        let sword = db.get(`sword_${message.channel.id}`)

        if (sword == true) {
            if (!message.member.roles.cache.has(client.config.ids.alive)) return message.channel.send("Pls do +suicide.... i can't take this anymore...")
            if (!args[0]) return message.channel.send("BRUH I CAN'T READ YOUR MIND YOU KNOW")
            if (!guy || guy.id == message.author.id) return message.reply("Invalid Target")
            message.guild.channels.cache.find(c => c.name === "day-chat").send(`<:getsword:744536585906683975> Player **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** was killed by the Forger's sword!`)
            guy.roles.add(client.config.ids.dead)
            guy.roles.remove(client.config.ids.alive)
            db.set(`sword_${message.channel.id}`, false)
        }
    }
}