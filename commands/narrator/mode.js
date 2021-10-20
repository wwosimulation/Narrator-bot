const { MessageEmbed } = require("discord.js")
const { gameModes } = require("../../config")

module.exports = {
    name: "mode",
    description: "Pings the alive role and asks which gamemode to play",
    usage: `${process.env.PREFIX}mode`,
    gameOnly: true,
    narratorOnly: true,
    alias: ["csr", "cs", "gamemode"],
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let droppy = new MessageSelectMenu().setCustomId("votemode")
        gameModes.forEach(x => {
            droppy.addOptions({label: `${x}`, value: `${x}`})
        })
        let row = new MessageActionRow().addComponents(droppy)
        let m = await message.channel.send({content: `${alive}`, embeds: [embed]})
    },
}
