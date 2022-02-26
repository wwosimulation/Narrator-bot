const toHex = require("colornames")
const { players } = require("../../db.js")

module.exports = {
    name: "colorchange",
    description: "Change the color of your special role.",
    usage: `${process.env.PREFIX}colorchange <color>`,
    aliases: ["colourchange"],
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

        if (!color) return message.channel.send(message.l10n("colorInvalid", { color: "Nothing" }))

        if (!role) return message.channel.send(message.l10n("specialRoleMissing"))

        if (!color.startsWith("#") && toHex(color)) {
            color = toHex(color)
        }

        if (!color.startsWith("#")) return message.channel.send(message.l10n("colorInvalid", { color }))

        client.guilds.cache
            .get("465795320526274561")
            .roles.cache.get(role)
            .setColor(color)
            .then(() => {
                message.channel.send(message.l10n("colorChanged"))
            })
            .catch((e) => {
                return message.channel.send(e.message)
            })
    },
}
