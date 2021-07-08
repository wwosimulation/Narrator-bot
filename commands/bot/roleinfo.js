const db = require("quick.db")
const Discord = require("discord.js")
const { getRole } = require("../../config")

module.exports = {
    name: "roleinfo",
    run: async (message, args, client) => {
        let role = getRole(args.join(" "))
        let embed = new Discord.MessageEmbed()
        .setTitle(role.name)
        .setDescription(role.description)
        .setThumbnail(role.icon)
        message.channel.send({ embeds: [embed]})
    },
}
