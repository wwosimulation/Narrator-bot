const { players } = require("../../db")

module.exports = {
    name: "namechange",
    description: "Change the name of your special role to a new one. This name may have up to 100 characters.",
    usage: `${process.env.PREFIX}namechange <name...>`,
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
<<<<<<< HEAD
        if (!role) return message.channel.send("I cannot find your special role! In case this doesn't make sense, try reporting this using `+bug`.")

        if (args.length < 1) return message.channel.send("Stop. being. stupid. you. dumb. weirdo.")
        if (args.join(" ").length > 100) return message.channel.send("Too many characters!")
=======
        if (!role) return message.channel.send(message.i10n("specialRoleMissing"))

        if (args.length < 1) return message.channel.send(message.i10n("nameInvalid"))
        if (args.join(" ").length > 99) return message.channel.send(message.i10n("nameInvalid"))
>>>>>>> 31694f1203063b079222a5132c68c3e316757018
        client.guilds.cache
            .get("465795320526274561")
            .roles.cache.get(role)
            .edit({ name: args.join(" ") })
        message.channel.send(message.i10n("nameSuccess", { name: args.join(" ") }))
    },
}
