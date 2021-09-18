const players = require("../../schemas/players")
const { MessageEmbed } = require("discord.js")

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
    name: "badges", 
    description: "Displays all your badges.",
    usage: `${process.env.PREFIX}badges [user]`,
    run: (message, args, client) => {
        let guy = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(' ') || x.user.username === args[0] || x.user.tag === args[0])
        if(!guy) guy = message.author

        let embed = new MessageEmbed()
        .setThumbnail(message.author.avatarURL())
        .setTitle(message.author.tag + "'s Badges")
        .setColor(message.member ? message.member.displayHexColor : "#1FFF43")
        .setTimestamp()

        let desc = ""

        let playerData = await players.findOne({user: guy.id})

        for(const badge in playerData.badges) {
            if(badge === "invite" && playerData.badges.invite.unlocked ) desc = desc + capitalizeFirstLetter(badge)
            if(badge !== "invite") desc = desc + `\`${capitalizeFirstLetter(badge)}\``
        }

        if(desc === "") desc = `${message.author.tag} does not have any badges.`
        embed.setDescription(desc)

        message.channel.send({embeds:[embed]})
    }
}