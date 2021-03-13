const db = require("quick.db")

module.exports = {
    name: "shadow",
    run: async (message, args, client) => {
        if (message.channel.name == "priv-shadow-wolf") {
            
            let abil = db.get(`shadow_${message.channel.id}`) 
            if (!message.member.roles.cache.has(client.config.ids.alive)) return message.channel.send("You can't manipulate voting when dead, dumb.")
            if (abil == "yes") return message.channel.send("YOU ALREADY ENABLED MANIPULATING STUPID.")
            message.guild.channels.cache.find(c => c.name === "day-chat").send("<:shadow:744573018147127394> The Shadow Wolf has manipulated voting today!")
            db.set(`vtshadow`, true)
            db.set(`shadow_${message.channel.id}`, "yes")
            message.guild.channels.cache.find(c => c.name === "vote-chat").updateOverwrite(client.config.ids.alive, {
                VIEW_CHANNEL: false
            })
        }
    }
}