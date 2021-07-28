const { players } = require("../../db")

module.exports = {
    name: "namechange",
    run: async (message, args, client) => {
        let data = await players.findOne({ user: message.author.id })
        let role = data.customRole

        if (!role) {
            let specialrolesname = client.guilds.cache.get("465795320526274561").roles.cache.get("606247032553865227")
            let colorsrolename = client.guilds.cache.get("465795320526274561").roles.cache.get("606247387496972292")
            let allsprole = client.guilds.cache.get("465795320526274561").roles.cache.filter((r) => r.position < specialrolesname.position && r.position > colorsrolename.position)

            allsprole.forEach((e) => {
                if (client.guilds.cache.get("465795320526274561").members.cache.get(message.author.id).roles.cache.has(e.id)) {
                    data.role = e.id
                    data.save()
                    role = e.id
                }
            })
        }
        if (!role) return message.channel.send("Special role is missing! If you have one, report this using +bug.")

        if (args.length < 1) return message.channel.send("It is not even a name. 👀")
        if (args.join(" ").length > 99) return message.channel.send("👀 That's too long mate!")
        client.guilds.cache
            .get("465795320526274561")
            .roles.cache.get(role)
            .edit({ name: args.join(" ") })
        message.channel.send("Done! " + args.join(" ") + " is your special role now.")
    },
}
