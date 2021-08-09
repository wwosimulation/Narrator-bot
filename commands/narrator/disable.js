const db = require("quick.db")
const { MessageActionRow } = require("discord.js")

module.exports = {
    name: "disable",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let mid = db.get("entermsg")
        if (!args[0]) return message.channel.send(`Please specify the button to disable (join/spec)`)
        if (args[0] == "join") {
            message.guild.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let jgbutton = row.components[0]
                    let specbutton = row.components[1]
                    jgbutton.disabled = true
                    m.edit({ components: [new MessageActionRow().addComponents(jgbutton, specbutton)] })
                })
        } else if (args[0] == "spec") {
            message.guild.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let jgbutton = row.components[0]
                    let specbutton = row.components[1]
                    specbutton.disabled = true
                    m.edit({ components: [new MessageActionRow().addComponents(jgbutton, specbutton)] })
                })
        } else return message.channel.send(`I could not find the button.`)
    }
}