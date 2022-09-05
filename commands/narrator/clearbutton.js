const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "clearbutton",
    aliases: ["clearbtn", "btnclear"],
    description: "Creates a game.",
    usage: `${process.env.PREFIX}gwhost [supervisor] <game...>`,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (args.length !== 1) return message.channel.send("Please give me the message id so I can remove the buttons from it.")

        let guild = client.guilds.cache.get(ids.server.sim)
        let member = await guild.members.fetch(message.author.id)

        let m = await guild.channels.cache
            .get("606123818305585167")
            .messages.fetch(args[0])
            .catch(() => null)

        if (!m) return message.channel.send("I could not find my message in <#606123818305585167>!")

        if (m.author.id !== client.user.id) return message.channel.send("That is not my message!")

        if (m.components?.length < 1) return message.channel.send("That message does not have any components!")

        m.components[0].components[0].disabled = true

        m.edit({ components: m.components })

        message.channel.send("Done!")
    },
}
