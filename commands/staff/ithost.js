const db = require("quick.db")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const { ids } = require("../../config")

module.exports = {
    name: "ithost",
    description: "Start a interaction test.",
    usage: `${process.env.PREFIX}ithost <test...>`,
    staffOnly: true,
    run: async (message, args, client) => {
        if (db.get(`game`) != null) return message.channel.send("Another game/test is being hosted!")
        let button = new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("Join Test")
            .setCustomId("itest-" + args.join(" "))
        const row = new MessageActionRow().addComponents(button)
        const embed = new MessageEmbed({
            title: "Interaction Test Participants:",
            description: "** **",
            color: 0x327210,
        })
        let m = await message.guild.channels.cache.find((x) => x.id == "606123818305585167").send({ content: `<@&955141762010202173>, we are now starting an interaction test ${args.join(" ")}. Our host will be <@${message.author.id}>!\nIf you do not wish to get future pings about tests, go to <#862712560511221791> and click on 🧪.`, embeds: [embed], components: [row] })
        db.set("game", m.id)
        db.set("gameCode", args.join(" "))
    },
}
