const { MessageEmbed } = require("discord.js")
const { getRole } = require("../../config")

module.exports = {
    name: "roleinfo",
    description: "Get more information about a role in the game.",
    usage: `${process.env.PREFIX}roleinfo <role>`,
    run: async (message, args, client) => {
        let role = getRole(args.join(" "))
        let embed = new MessageEmbed().setTitle(role.name).setDescription(role.description).setThumbnail(role.icon)
        message.channel.send({ embeds: [embed] })
    },
}
