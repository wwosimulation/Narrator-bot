const { gameModes } = require("../../config")

module.exports = {
    name: "poll",
    description: "Asks for game modifiers to choose, similar to the mode and vt command. Separate arguments with |",
    usage: `${process.env.PREFIX}poll <options>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let items = []
        args = args.join(" ").split("|")
        args.forEach((match) => {
            items.push(match.charAt(0).toUpperCase() + match.slice(1))
        })
        let droppy = { type: 3, custom_id: "poll", options: [] }
        items.forEach((x) => {
            droppy.options.push({ label: `${x}`, value: `${x}` })
        })
        let row = { type: 1, components: [droppy] }
        let m = await message.channel.send({ content: `Select an option below:`, components: [row] })
    },
}
