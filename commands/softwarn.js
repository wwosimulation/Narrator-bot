const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
    name: "softwarn",
    run: async (message, args, client) => {

        if (!message.member.permissions.has("MANAGE_ROLES")) return message.channel.send("You do not have enough permissions to run this command!")

        if (args.length < 4) return message.channel.send("Invalid Usage!\nCorrect Usage: `+softwarn [user] [reason]`")

        let guy = message.mentions.members.first() ||
            message.guild.members.cache.find(m => m.nickname === args[0]) ||
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(m => m.user.username.includes(args[0])) ||
            message.guild.members.cache.find(m => m.user.tag === args[0])

        if (!guy) return message.channel.send("Invalid User!")

        if (guy == message.member) return message.channel.send("You cannot softwarn yourself!")

        let t = '' 
        let avc = ''

        for (let i = 1 ; i < args.length ; i++) {
            t += args[i] + " "
        }

        if (message.attachments.size > 0) {
            message.attachments.forEach(a => avc += a.url + '\n')
        }

        db.add(`softwarn_${guy.id}`, 1)

        let softwarns = db.get(`softwarn_${guy.id}`)
        client.guilds.cache.get("465795320526274561").channels.cache.get("606123769031032863").send(
            new Discord.MessageEmbed()
            .setTitle("Action: Softwarn")
            .setAuthor(guy.user.tag, guy.user.avatarURL())
            .setDescription(`Reason: ${t}\n\nTotal softwarns: ${softwarns}`)
            .setFooter("Softwarned by: ${message.author.tag} (${message.author.id})", message.author.displayAvatarURL())
        )
        client.guilds.cache.get("465795320526274561").channels.cache.get("606123769031032863").send(avc)
        guy.send(`[Werewolf Online Simulation]\n\nYou have been softwarned for the following reason: ${t}`)
        
        
    }
}
