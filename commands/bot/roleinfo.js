const { getRole } = require("../../config")

module.exports = {
    name: "roleinfo",
    description: "Get more information about a role in the game.",
    usage: `${process.env.PREFIX}roleinfo <role>`,
    run: async (message, args, client) => {
        let role = getRole(args.join(" "))
        let embed = { title: role.name, description: role.description, thumbnail: { url: role.icon } }
        message.channel.send({ embeds: [embed] })
    },
}
