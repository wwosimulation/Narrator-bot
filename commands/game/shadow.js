const db = require("quick.db")

module.exports = {
    name: "shadow",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-shadow-wolf") {
            let alive = message.guild.roles.cache.find(r => r.name === "Alive")
            let abil = db.get(`shadow_${message.channel.id}`) 
            let isDay = db.get(`isDay`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't manipulate voting when dead, dumb.")
            if (abil == "yes") return message.channel.send("YOU ALREADY ENABLED MANIPULATING STUPID.")
            if (isDay != "yes") return message.channel.send("Yup, trying to manipulate during the night.")
            message.guild.channels.cache.find(c => c.name === "day-chat").send("<:shadow:744573018147127394> The Shadow Wolf has manipulated voting today!")
            db.set(`vtshadow`, true)
            db.set(`shadow_${message.channel.id}`, "yes")
            message.guild.channels.cache.find(c => c.name === "vote-chat").updateOverwrite(alive.id, {
                VIEW_CHANNEL: false
            })
        }
    }
}
