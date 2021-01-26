const db = require("quick.db")


module.exports = {
    name: "nightmare",
    run: async (message, args, client) => {
        if (message.channel.name == "priv-nightmare-werewolf") {
            let isDay = db.get(`isDay_${message.guild.id}`)
            let alive = message.guild.roles.cache.find(r => r.name === "Alive")
            let wolfChat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
            let guy = 
                message.guild.members.cache.find(m => m.nickname === args[0]) || 
                message.guild.members.cache.find(m => m.user.username === args[0]) || 
                message.guild.members.cache.find(m => m.user.tag === args[0]) ||
                message.guild.members.cache.find(m => m.id === args[0])
            let nightmares = db.get(`nightmare_${message.channel.id}`) || 2
            console.log(nightmares)
            if (!message.member.roles.cache.has(alive.id)) return message.chanenl.send("Ok when you are dead, the only nightmares you're getting are from hell coz you're a bad bad wolf.")
            if (isDay != "yes") return message.channel.send("If players are already sleeping, how do you expect me to nightmare them?")
            if (!guy || guy == message.member) return message.channel.send("How are you gonna kill if you're nightmaring yourself...")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("That player is already dead... Have some decency bro.")
            if (wolfChat.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) return message.channel.send("Trying to nightmare other wolves just makes you look dumb...")
            if (nightmares < 1) return message.channel.send("Trying to cheat to get more nightmares isn't gonna work...")
            message.channel.send(`<:nightmare:744572848982720602> You decided to nightmare **${guy.nickname} ${guy.user.username}**`)
            db.set(`sleepy_${message.channel.id}`, guy.nickname)
        }
    }
}