const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "punish",
    description: "The option you select will be the punishment",
    usage: `${process.env.PREFIX}punish <trick/treat>`,
    gameOnly: true,
    run: async (message, args, client) => { 
        let isDay = db.get(`isDay`)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
        if (isDay == "no") return message.channel.send("You can only select a option during the day.")
        if (!ownself.roles.cache.has(alive.id)) return message.channel.send("You are dead.")
        if (args[0] == "trick") {
          db.set(`punish_${message.channel.id}`, "trick")
          message.channel.send(`Done! the person that select's trick will now die.`)
        } else if (args[0] == "treat") {
          db.set(`punish_${message.channel.id}`, "treat")
          message.channel.send(`Done! the person that select's treat will now die.`)
        } else {
          message.channel.send(`That's not a valid option, either select trick or treat!`)
        }
        
        
        
    }
}
    