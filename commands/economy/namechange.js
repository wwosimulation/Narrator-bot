const { players } = require("../../db")

module.exports = {
    name: "namechange",
    description: "Change the name of your special role to a new one. This name may have up to 99 characters.",
    usage: `${process.env.PREFIX}namechange <name>`,
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
        if (!role) return message.channel.send("I cannot find your special role! In case this doesn't make sense, try reporting this using `+bug`.")

        if (args.length < 1) return message.channel.send("Stop. being. stupid. you. dumb. weirdo.")
        if (args.join(" ").length > 99) return message.channel.send("Too many characters!")
        client.guilds.cache
            .get("465795320526274561")
            .roles.cache.get(role)
            .edit({ name: args.join(" ") })
        message.channel.send("Done! Your special role name is: " + args.join(" "))
    },
}
