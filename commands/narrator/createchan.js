const { getRole } = require("../../config")

module.exports = {
    name: "createchan",
    description: "Kill a player in corrupter's name.",
    usage: `${process.env.PREFIX}corrkill <player>`,
    aliases: ["cc"],
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let chan1 = await message.guild.channels.create(`priv-${args[0].replace(" ", "-").toLowerCase()}`, {
            parent: args[1],
        })
        let chan2 = await message.guild.channels.create(`priv-${args[0].replace(" ", "-").toLowerCase()}`, {
            parent: args[1],
        })
    },
}
