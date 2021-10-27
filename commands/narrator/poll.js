const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { gameModes } = require("../../config")

module.exports = {
    name: "poll",
    description: "Asks for game modifiers to choose, similar to the mode and vt command.",
    usage: `${process.env.PREFIX}poll <options>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let items = []
        args.forEach((match) => {
            items.push(match.charAt(0).toUpperCase() + match.slice(1))
        })
        let droppy = new MessageSelectMenu().setCustomId("poll")
        items.forEach((x) => {
            droppy.addOptions({ label: `${x}`, value: `${x}` })
        })
        let row = new MessageActionRow().addComponents(droppy)
        let m = await message.channel.send({ content: `Select an option below:`, components: [row] })
    },
}
