const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "snipe",
    description: "Stalk a person.",
    usage: `${process.env.PREFIX}snipe <player>`,
    run: async (message, args, client) => {
        if (message.channel.name === "priv-sheriff") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dc
            if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = config.fn.dcActions(message, db, alive)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`What is the sheriff supposed to see about themselves? They already know they are ugly so...`)
            let isNight = db.get(`isNight`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            if (isNight != "yes") return message.channel.send("You can use your ability only at night!")
            if (!args[0]) return message.channel.send("Who are you snipping? Mention the player.")
            if (!guy || guy.id == message.author.id) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            message.react("789734103364272148")
            db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `snipe_${dc.chan.id}` : `snipe_${message.channel.id}`}`, guy.nickname)
        }
    },
}
