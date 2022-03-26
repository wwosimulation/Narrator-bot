const db = require("quick.db")
const { ids, fn } = require("../../config")

module.exports = {
    name: "disablebuttons",
    description: "Disable buttons of a message.",
    usage: `${process.env.PREFIX}disablebuttons <msg_id | msg_link> [channel_id]`,
    staffOnly: true,
    run: async (message, args, client) => {
        let chan = args[1] ?? "606123818305585167"
        let msg = args[0]
        let guild = ids.server.sim
        if (!args[0]) return message.channel.send("Please specify a message ID.")
        if (args[0].startsWith("https://")) {
            let arr = args[0].split("/")
            msg = arr[arr.length - 1]
            chan = arr[arr.length - 2]
            guild = arr[arr.length - 3]
        }

        let m = await client.guilds.resolve(guild).channels.resolve(chan).messages.fetch(msg)
        m.edit(fn.disableButtons(m)).then((e) => {
            message.channel.send("Buttons cleared!")
        })
    },
}
