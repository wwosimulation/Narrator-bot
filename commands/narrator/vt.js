const db = require("quick.db")
const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "vt",
    narratorOnly: true,
    gameOnly: true,
    run: async (message, args, client) => {
        if (args[0] == "nm") return message.channel.send("Invalid format! The way you use this command has changed, check the pins in <#606123759514025985>")
        let timer = ms(args.join(" "))
        if (!timer) return message.channel.send("Invalid time!")
        let voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat")
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive")
        db.set(`wwsVote`, "NO")
        db.set(`skippedpl`, 0)
        let votes = Math.floor(parseInt(aliveRole.members.size) / 2)
        
        let voteobject = []
        let votemenu = new Discord.MessageSelectMenu()
            .setCustomID("ig-voting")
            .setPlaceholder("Select a player to vote!")
        
        for (let i = 1 ; i <= 16 ; i++) {
            let guy = message.guild.members.cache.find(m => m.nickname === i.toString())
            if (guy) {
                if (guy.roles.cache.has(aliveRole.id)) {
                    let tempobject = {
                        label: `${i} ${guy.user.username}`,
                        value: i.toString()
                    }
                    voteobject.push(tempobject)
                }
            }
        }
        voteobject.push({ label: "Cancel", value: "0" })
        votemenu.addOptions(voteobject)
        
        let row = new Discord.MessageActionRow(votemenu)
        voteChat.send({ content: `Timer set to ${ms(timer)} <@&${aliveRole.id}>`, components: [row]})
        dayChat.send(`Get ready to vote! (${votes} vote${votes == 1 ? "" : "s"} required)`)
        db.set(`commandEnabled`, `yes`)
        message.channel.send(`Setting the vote time for ${ms(timer)}`)
        setTimeout(() => {
            voteChat.send(`Time is up!`)
            db.set(`commandEnabled`, `no`)
        }, timer)
    },
}
