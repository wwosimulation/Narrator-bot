const db = require("quick.db")
const { fn } = require("../../config")

module.exports = {
    name: "updatexp",
    narratorOnly: true,
    run: async (message, args, client) => {
        let guy = client.users.cache.get(args[0])
        if (!guy) return message.channel.send("Invalid user. Please specify a **user ID**")
        fn.updateXP(args[0], client)
        message.channel.send("Done")
    },
}
