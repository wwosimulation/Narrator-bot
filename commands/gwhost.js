const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "gwhost",
    run: async (message, args, client) => {
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let m = await message.guild.channels.cache.get("606123818305585167").send("<@&606123686633799680> We are now starting game " + args.join(' ') + '. Our host will be <@' + message.author.id +'>! To join the game, react with :fries:. If you do not wish to get future pings about the game, go to <#606123783605977108> and react with :video_game:')
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
            
            }
        });

        collector.on('end', collected => {
            message.channel.send("Done!")
        })
    }
}