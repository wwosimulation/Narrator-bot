module.exports = (client) => {
    client.on("clickButton", async (button) => {
        if(button.id == "gwjoin"){
            let guy = button.guild.members.fetch(button.clicker.id)
            if(guy.roles.cache.has("606123628693684245")) return button.reply.send('You are game banned! You cannot join any games');
            //guy.roles.add("606123676668133428").catch(e => button.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
            //button.guild.channels.cache.find(x => x.name == "joined").send(`${guy.user.tag} joins match ${args.join(" ")}\nUser ID: ${guy.id}`)
            let jl = await button.guild.channels.cache.find(x => x.name == "joined-link")
            //jl.send(`<@${guy.id}>, use the link above to join the game!`).then(m => m.delete({timeout: 5000}))
            button.reply.send(`Yay! Head to <#${jl.id}> to join!`, {ephremal: true})
        }
    })
}

const Discord = require("discord.js")

module.exports = (client) => {
  client.on("interaction", async (interaction) => {
    if (!interaction.isMessageComponent() && interaction.componentType !== "BUTTON") return
    console.log(interaction.customID)
    if(interaction.customID == "gwjoin"){
        let guy = interaction.member
        if(guy.roles.cache.has("606123628693684245")) return interaction.reply('You are game banned! You cannot join any games', {ephremal: true});
        //guy.roles.add("606123676668133428").catch(e => interaction.guild.channels.cache.get("606123821656702987").send(`Error: ${e.message}`))
        //interaction.guild.channels.cache.find(x => x.name == "joined").send(`${guy.user.tag} joins match ${args.join(" ")}\nUser ID: ${guy.id}`)
        let jl = await interaction.guild.channels.cache.find(x => x.name == "joined-link")
        jl.send(`<@${guy.id}>, use the link above to join the game!`).then(m => m.delete({timeout: 5000}))
        let embed = interaction.message.embeds[0]
        embed.description += `${guy.user.tag}\n`
        interaction.update(message.content, {embeds: [embed], components: interaction.message.components})
    }
  })
}
