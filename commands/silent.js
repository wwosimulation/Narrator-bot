const Discord = require("discord.js")
const ms = require('ms')

module.exports = {
    name: "silent",
    //aliases: ["mute"],
    run: async (message, args, client) => {
        if (!message.member.permissions.has("MANAGE_ROLES")) return message.channel.send("You do not have enough permissions to run this command!")

        if (args.length < 2) return message.channel.send("Invalid Usage!\nCorrect Usage: `+mute [user] [time or 0] [reason]`")

        let guy = message.mentions.members.first() ||
            message.guild.members.cache.find(m => m.nickname === args[0]) ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(m => m.user.username.includes(args[0])) ||
            message.guild.members.cache.find(m => m.user.tag === args[0])

        if (!guy) return message.channel.send("User not found!")

        if (guy == message.member) return message.channel.send("You cannot mute yourself!")

        if (message.member.roles.highest.comparePositionTo(guy.roles.highest) <= 0) return message.channel.send("You cannot mute these members!")

        let content = ""
        for (let i = 2; i < args.length; i++) {
            content += args[i] + " "
        }
        let embed = new Discord.MessageEmbed()
            .setTitle("Action: Mute")
            .setAuthor(guy.user.tag, guy.user.avatarURL())
            .setDescription(`Reason: ${content}`)


        if (args[1] != "0") {
            let time = ms(args[1])
            if (!time) return message.channel.send("Invalid time format at " + args[1] +"! Please use `0` or a valid time argument!")
            embed.setDescription(`Reason: ${content}\n\nMuted for: ${time/1000}s`)
            setTimeout(() => {
                
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setTitle("Action: Unmute")
                    .setAuthor(guy.user.tag, guy.user.avatarURL())
                    .setDescription("Responsible moderator: `Narrator Bot#2460`\nReason: Mute expired!")
                )
                guy.roles.remove("606123693655195668")
            }, time)
        } 

        guy.roles.add("606123693655195668")

        message.channel.send(embed)


    }
}