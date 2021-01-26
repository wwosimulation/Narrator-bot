const db = require("quick.db")


module.exports = {
    name: "nrg",
    run: async (message, args, client) => {
        if (message.channel.name == "gn-chat") {
            if (!args[0]) return message.channel.send("You need to tell me the id!")
            db.add(`roses_${args[0]}`, 1)
            message.channel.send("done!")
        }
    }
}