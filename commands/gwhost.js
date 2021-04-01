const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "gwhost",
    run: async (message, args, client) => {
        
        let narrator = message.guild.roles.cache.get("606123619999023114")
        let mininarr = message.guild.roles.cache.get("606123620732895232")
        if (!message.member.roles.cache.has(narrator.id) && !message.member.roles.cache.has(mininarr.id)) return
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let sup = ""
        if (message.member.roles.cache.has(mininarr.id)) {
            let guy = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.nickname === args[0]) || message.guild.members.cache.find(m => m.user.username === args[0])  || message.guild.members.cache.find(m => m.user.tag === args[0])
            if (!guy) return message.channel.send(`Supervisor \`${args[0]}\` was not found!`)
            let rol = message.guild.roles.cache.find(r => r.name === "Supervisor")
            if (!guy.roles.cache.has(rol.id)) return message.channel.send(`${guy.user.tag} is not a supervisor!`)
            sup = `The supervisor for this game is: ${guy}`
            args[0] = ""
        }
        let m = await message.guild.channels.cache.get("606123818305585167").send(`<@&606123686633799680> We are now starting game ${args.join(' ')}. Our host will be <@${message.author.id}>! To join the game, react with :fries:. If you do not wish to get future pings about the game, go to <#606123783605977108> and react with 🎮${sup ? `\n\n${sup}` : ""}`)
        await m.react("🍟")
        db.set(`game`, m.id)
        const filter = (reaction, user) => reaction.emoji.name === '🍟'


        const collector = m.createReactionCollector(filter,  {})
        

        collector.on('collect', (reaction, user) => {
            //console.log(reaction.emoji.name)
            if (reaction.emoji.name == "🍟") {
            //console.log(reaction.emoji.name)
            let guy = message.guild.members.cache.find(m => m.id === user.id)
            guy.roles.add("606123676668133428").catch(e => message.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
            reaction.users.remove(user).catch(e => message.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
            message.guild.channels.cache.find(x => x.name == "joined").send(`${guy.user.tag} joins match ${args.join(" ")}\nUser ID: ${guy.id}`)
            message.guild.channels.cache.find(x => x.name == "joined-link").send(`<@${guy.id}>`).then(m => m.delete({timeout: 5000}))
            }
        });

        collector.on('end', collected => {
            message.channel.send("Done!")
        })
    }
}
