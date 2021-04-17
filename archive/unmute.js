const Discord = require("discord.js")

module.exports = {
    name: "unmute",
    run: async (message, args, client) => {
        
        if (!message.member.permissions.has("MANAGE_ROLES")) return message.channel.send("You don't have the permissions to run this command!")

        if (args.length < 1) return message.channel.send("Invalid Usage!\nCorrect Usage: `+unmute [user] (reasons)`") 

        let guy = message.mentions.members.first() ||
            message.guild.members.cache.find(m => m.nickname === args[0]) ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(m => m.user.username.includes(args[0])) ||
            message.guild.members.cache.find(m => m.user.tag === args[0])
        
        if (!guy) return message.channel.send("User not found!")

        if (guy == message.member) return message.channel.send("You cannot unmute yourself!")

        if (message.member.roles.cache.has("606123693655195668")) return message.channel.send("You cannot mute someone else when having the muted role!")

        if (message.member.roles.highest.comparePositionTo(guy.roles.highest) <= 0) return message.channel.send("You cannot unmute this person!")

        if (!guy.roles.cache.has("606123693655195668")) return message.channel.send("You cannot unmute someone who does not have the muted role!")

        guy.roles.remove("606123693655195668")

        let t = ""

        for (let i = 1 ; i < args.length ; i++) {
            t += args[i] + " "
        }

        message.channel.send(
            new Discord.MessageEmbed()
            .setTitle("Action: Unmute")
            .setAuthor(guy.user.tag, guy.user.avatarURL())
            .setDescription("Responsible Moderator: `" + message.author.tag + "`\nReason: ", t)
        )
    }
}