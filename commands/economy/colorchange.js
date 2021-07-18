const toHex = require("colornames")
const { players } = require("../../db.js")

module.exports = {
    name: "colorchange",
    run: async (message, args, client) => {
        let data = await players.findOne({ user: message.author.id })
        let role = data.customRole

        if (!role) {
            let specialrolesname = client.guilds.cache.get("465795320526274561").roles.cache.get("606247032553865227")
            let colorsrolename = client.guilds.cache.get("465795320526274561").roles.cache.get("606247387496972292")
            let allsprole = client.guilds.cache.get("465795320526274561").roles.cache.filter((r) => r.position < specialrolesname.position && r.position > colorsrolename.position)
            let hassprole = false
            allsprole.forEach((e) => {
                if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has(e.id)) {
                    data.role = e.id
                    data.save()
                    role = e.id
                }
            })
        }

        let color = args.join(" ")

        if (!color) return message.channel.send("Hey which color you want? Specify it next time.")

        if (!role) return message.channel.send("Special role is missing! If you have one, report this using +bug.")

        if (color.length < 1) return message.channel.send("It is not even a color. 👀")

        if (color.length > 99) return message.channel.send("It is not even a color. 👀")

        if (!color.startsWith("#")) {
            color = toHex(color)
        }

        if (!color.startsWith("#")) return message.channel.send(color + " is not even a color. 👀")

        client.guilds.cache
            .get("465795320526274561")
            .roles.cache.get(role)
            .setColor(color)
            .then(() => {
                message.channel.send("Done! Your special role color has been changed!")
            })
            .catch((e) => {
                return message.channel.send(e.message)
            })
    },
}
