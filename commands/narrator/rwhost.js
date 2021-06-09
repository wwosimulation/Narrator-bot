/*const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "rwhost",
    run: async (message, args, client) => {
        
        let narrator = message.guild.roles.cache.get("606123619999023114")
         if (!message.member.roles.cache.has(narrator.id)) return
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let rs = db.get("rankedseason")
        let m = await message.guild.channels.cache.get("606123818305585167").send(`<@&606123691889393705> We are now starting game RS.${rs}[${args.join(' ')}]. Our host will be <@${message.author.id}>! To join the game, react with 💰. If you do not wish to get future pings about the game, go to <#606123783605977108> and react with 🏆`)
        await m.react("💰")
        db.set(`game`, m.id)
        const filter = (reaction, user) => reaction.emoji.name === '💰'


        const collector = m.createReactionCollector(filter,  {})
        

        collector.on('collect', (reaction, user) => {
            //console.log(reaction.emoji.name)
            if (reaction.emoji.name == "💰") {
            //console.log(reaction.emoji.name)
            reaction.users.remove(user).catch(e => message.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
            let guy = message.guild.members.cache.find(m => m.id === user.id)
            if(guy.roles.cache.has("606123628693684245")) return message.author.send("You are ranked banned!")
            guy.roles.add("606123676668133428").catch(e => message.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
            message.guild.channels.cache.find(x => x.name == "joined").send(`${guy.user.tag} joins match RS.${rs}[${args.join(" ")}]\nUser ID: ${guy.id}`)
            message.guild.channels.cache.find(x => x.name == "joined-link").send(`<@${guy.id}>, join the server above to join the game!`).then(m => m.delete({timeout: 5000}))
            }
        });

        collector.on('end', collected => {
*/
const db = require("quick.db")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
    name: "rwhost",
    run: async (message, args, client) => {
        let narrator = message.guild.roles.cache.get("606123619999023114")
         if (!message.member.roles.cache.has(narrator.id)) return
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let rs = db.get("rankedseason")
        let button = new MessageButton().setStyle("SUCCESS").setLabel("Join Game").setCustomID(`gwjoin-rs.${rs}[${args.join(" ")}]`)
        const row = new MessageActionRow().addComponents(button)
        const embed = new MessageEmbed().setTitle("Player and Spectator List:").setDescription("** **").setColor(0x327210)
        let m = await message.guild.channels.cache.get("606123818305585167").send(`We are now starting game RS.${rs}[${args.join(" ")}]. Our host will be <@${message.author.id}>!\nIf you do not wish to get future pings about the game, go to <#606123783605977108> and react with 🏆`, { embed, components: [row] })
        db.set(`game`, m.id)
    },
}
