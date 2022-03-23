const db = require("quick.db")
const { MessageActionRow } = require("discord.js")

module.exports = {
    name: "enable",
    description: "Enable buttons in #enter-game",
    usage: `${process.env.PREFIX}enable (join | spec)`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let mid = db.get("entermsg")
        if (!args[0]) return message.channel.send(`Please specify the button to enable (join/spec)`)
        if (args[0] == "join") {
            message.guild.channels.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let jgbutton = row.components[0]
                    let specbutton = row.components[1]
                    let narrbutton = row.components[2]
                    jgbutton.disabled = false
                    m.edit({ components: [new MessageActionRow().addComponents(jgbutton, specbutton, narrbutton)] })
                })
        } else if (args[0] == "spec") {
            message.guild.channels.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let jgbutton = row.components[0]
                    let specbutton = row.components[1]
                    let narrbutton = row.components[2]
                    specbutton.disabled = false
                    m.edit({ components: [new MessageActionRow().addComponents(jgbutton, specbutton, narrbutton)] })
                })
        } else return message.channel.send(`I could not find the button.`)
    },
}
