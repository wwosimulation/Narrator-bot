const db = require("quick.db")
const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
  name: "vt",
  narratorOnly: true,
  gameOnly: true,
  run: async (message, args, client) => {
    if(args[0] == "nm") return message.channel.send("Invalid format! The way you use this command has changed, check the pins in <#606123759514025985>")
    let timer = ms(args[0])
    if (!timer) return message.channel.send("Invalid time!")
    let voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat")
    let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
    let aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive")
    db.set(`wwsVote`, "NO")
    db.set(`skippedpl`, 0)
    let votes = Math.floor(parseInt(aliveRole.members.size) / 2)
    voteChat.send(`<@&${aliveRole.id}>`)
    dayChat.send(`Get ready to vote! (${votes} vote${votes == 1 ? "" : "s"} required)`)
    db.set(`commandEnabled`, `yes`)
<<<<<<< HEAD
    message.channel.send(`Setting the vote time for ${ms(timer)}`)
=======
    message.channel.send(`Setting the vote time for ${timer}`)
>>>>>>> 2ee6c2e2fa73971906ab248d214ed31393041a4c
    setTimeout(() => {
      voteChat.send(`Time is up!`)
    }, timer)
  },
}
