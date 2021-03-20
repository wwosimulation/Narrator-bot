module.exports = {
    name: "bye",
    gameOnly: true,
    run: async (message, args, client) => {
        let role = message.guild.roles.cache.find(r => r.name === "Narrator")
        let role2 = message.guild.roles.cache.find(r => r.name === "Narrator Trainee")
        if (message.member.roles.cache.has(role.id) || message.member.roles.cache.has(role2.id)) {
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
            message.channel.send('Players have been kicked, I am now clearing channels. (This may take a while)') 
            let channels = message.guild.channels.cache.filter(c => c.name.startsWith("priv") && c.parentID != "748959630520090626")
            channels.forEach(async e => {
                let msgs = await e.messages.fetch()
                let total = await msgs.filter(m => !m.pinned && (Date.now() - m.createdTimestamp < (60*60*24*14)))
                
                if (total.size > 0) {
                    e.bulkDelete(total)
                }
            })
            let tempchannels = message.guild.channels.cache.filter(c => c.parentID === "748959630520090626")
            tempchannels.forEach(e => e.delete())
            let emsgs = await message.guild.channels.cache.find(c => c.name === "enter-game").messages.fetch()
            let oki = emsgs.filter(m => !m.pinned && (Date.now() - m.createdTimestamp < (60*60*24*14)))
            message.guild.channels.cache.find(c => c.name === "enter-game").bulkDelete(oki)
            let settings = message.guild.channels.cache.filter(c => c.parentID === "606250714355728395")
            settings.forEach(async e => {
                let oki = await e.messages.fetch()
                let hmm = oki.filter(m => !m.pinned && (Date.now() - m.createdTimestamp < (60*60*24*14)))
                if (hmm.size > 0) {
                    e.bulkDelete(hmm)
                }
            })
            let chans = ["vote-chat", "music-commands", "shadow-votes", "jailed-chat", "werewolves-chat", "time", "dead-chat", "day-chat"]
            let ingame = message.guild.channels.cache.filter(c => c.parentID === "606132962752331839" && chans.includes(c))
            ingame.forEach(async e => {
                let ashish = await e.messages.fetch()
                let filt = ashish.filter(c => !c.pinned && (Date.now() - c.createdTimestamp < (60*60*24*14)))
                if (filt.size < 100) {
                    e.bulkDelete(filt)
                } else {
                    filt = filt.filter(m => m.size < 101  && (Date.now() - m.createdTimestamp < (60*60*24*14)))
                    e.bulkDelete(filt)
                }
            })
            message.channel.send("All channels have been queued to be cleared")
        }
    }
}
