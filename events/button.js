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
