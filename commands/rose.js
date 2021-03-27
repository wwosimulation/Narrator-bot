const db = require("quick.db")

module.exports = {
    name: "rose",
    run: async (message, args, client) => {
        if (message.guild.id != '472261911526768642') return message.channel.send("This can only be used when playing a game!")

        let roseBouquet = db.get(`roseBouquet_${message.author.id}`) || 0
        let roses = db.get(`roseG_${message.author.id}`) || 0
        let mininarr = message.guild.roles.cache.find(
            r => r.name === "Narrator Trainee"
          );
        let narrator = message.guild.roles.cache.find(r => r.name === "Narrator");
        let spec = message.guild.roles.cache.find(r => r.name === "Spectator")

        if (!args[0]) return message.channel.send("You need to state if you want to give a rose to a player or as a bouquet!\n\nOptions: `single [player number]` or `bouquet`")

        if (args[0] == "single") {
            if (roses == 0) return message.channel.send("You can't give roses to anyone if you don't have any.")
        let guy = message.guild.members.cache.find(m => m.nickname === args[1]) || 
            message.guild.members.cache.find(m => m.id === args[1]) ||  
            message.guild.members.cache.find(m => m.user.username === args[1]) || 
            message.guild.members.cache.find(m => m.user.tag === args[1])
        if (message.member.roles.cache.has(spec.id)) return message.channel.send("You can't give the rose as a spectator!")
        if (message.member.roles.cache.has(mininarr.id) || message.member.roles.cache.has(narrator.id)) return message.channel.send("You can't give the rose as a narrator!")    
        if (!guy) return message.channel.send("Player does not exist!")
        if (guy.roles.cache.has(spec.id)) return message.channel.send("You can't give the rose to a spectator!")
        if (guy.roles.cache.has(mininarr.id) || guy.roles.cache.has(narrator.id)) return message.channel.send("You can't give the rose to a narrator!")
        if (message.member == guy) return message.channel.send("Sure, adding a rose to yourself. Try that one more time and i will suicide you ;)")
        db.subtract(`roseG_${message.author.id}`, 1)
        db.add(`roses_${guy.id}`, 1)
        } else if (args[0] == "bouquet") {
            let alive = message.guild.roles.cache.find(r => r.name === "Alive")
            let dead = message.guild.roles.cache.find(r => r.name === "Dead")

            if (message.member.roles.cache.has(spec.id)) return message.channel.send("You can't give the rose as a spectator!")
            if (message.member.roles.cache.has(mininarr.id) || message.member.roles.cache.has(narrator.id)) return message.channel.send("You can't give the rose as a narrator!") 

            if (roseBouquet == 0) return message.channel.send("You don't have any bouquet!")
            for (let i = 0 ; i <= alive.members.size + dead.members.size ; i++)  {
                let guy = message.guild.channels.cache.find(m => m.nickname === i.toString())
                if (guy) {
                    db.add(`roses_${guy.id}`, 1)
                }
            }
            db.subtract(`roseBouquet_${message.author.id}`, 1)
            
        }
    }
}
