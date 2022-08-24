const db = require("quick.db")

module.exports = {
    name: "disable",
    description: "Disable buttons in #enter-game.",
    usage: `${process.env.PREFIX}disable (join | spec)`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let mid = db.get("entermsg")
        if (!args[0]) return message.channel.send(`Please specify the button to disable (join/spec)`)
        args[0] = args[0].toLowerCase()
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
                    jgbutton.disabled = true
                    m.edit({ components: [{ type: 1, components: [jgbutton, specbutton, narrbutton] }] }).then(() => {
                        message.channel.send(`Disabled join button`)
                    })
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
                    specbutton.disabled = true
                    m.edit({ components: [{ type: 1, components: [jgbutton, specbutton, narrbutton] }] }).then(() => {
                        message.channel.send(`Disabled spec button`)
                    })
                })
        } else if (args[0] == "all") {
            message.guild.channels.cache
                .find((c) => c.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components
                    let row = allc[0]
                    let jgbutton = row.components[0]
                    let specbutton = row.components[1]
                    let narrbutton = row.components[2]
                    jgbutton.disabled = true
                    specbutton.disabled = true
                    m.edit({ components: [{ type: 1, components: [jgbutton, specbutton, narrbutton] }] }).then(() => {
                        message.channel.send(`Disabled all buttons`)
                    })
                })
        } else return message.channel.send(`I could not find the button.`)
    },
}
