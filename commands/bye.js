module.exports = {
    name: "bye",
    run: async (message, args, client) => {
        let role = message.guild.roles.cache.find(r => r.name === "Narrator")
        let role2 = message.guild.roles.cache.find(r => r.name === "Narrator Trainee")
        if (message.member.roles.cache.has(role.id) || message.member.roles.cache.has(role2.id)) {
            message.channel.send('bye bye') 
            setTimeout(function () {
                for (let i = 1 ; i < 16 ; i++) {
                    let guy = message.guild.members.cache.find(m => m.nickname === i.toString())
                    if (guy) {
                        guy.kick()
                    }
                }
                let spec = message.guild.roles.cache.find(r => r.name === "Spectator")
                spec.members.forEach(e => {e.kick()})
            }, 5000)
            let channels = message.guild.channels.cache.filter(c => c.name.startsWith("priv"))
            channels.forEach(async e => {
                let msgs = await e.messages.fetch()
                let total = await msgs.filter(e => !e.pinned())
                
                if (total.size > 0) {
                    e.bulkDelete(msgs.size)
                }
            })
            let tempchannels = message.guild.channels.cache.filter(c => c.parent.id === "748959630520090626")
            tempchannels.forEach(e => e.delete())
            let emsgs = await message.guild.channels.cache.find(c => c.name === "enter-game").messages.fetch()
            message.guild.channels.cache.find(c => c.name === "enter-game").bulkDelete(emsgs.size)
        }
    }
}
