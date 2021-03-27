const db = require("quick.db")

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
                        console.log(`Kicked ${i}`)
                    }
                }
                let spec = message.guild.roles.cache.find(r => r.name === "Spectator")
                spec.members.forEach(e => {e.kick(); console.log(`Kicked ${e.user.tag}`)})
            }, 5000)
            message.channel.send('Players have been kicked, I am now clearing channels. (This may take a while)') 
            let chans = ["vote-chat", "music-commands", "shadow-votes", "jailed-chat", "werewolves-chat", "time", "dead-chat", "day-chat"]
            let ingame = message.guild.channels.cache.filter(c => c.parentID === "606132962752331839" && chans.includes(c.name))
            ingame.forEach(async e => {
                let ashish = await e.messages.fetch()
                let filt = ashish.filter(c => !c.pinned)
                console.log(filt.size)
                if (filt.size < 50) {
                    e.bulkDelete(filt)
                    console.log(`Cleared #${e.name}`)
                } else {
                    for(let i = 0; i < filt.size; i+50) e.bulkDelete(50)
                    e.bulkDelete(filt)
                    console.log(`Bulk cleared #${e.name}`)
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
                    console.log(`Cleared #${e.name}`)
                }
            })
            
            message.channel.send("All channels have been queued to be cleared. Be sure to check behind me and make sure they actually did clear! If not, use `-c` there to finish the job")
        }
    }
}
