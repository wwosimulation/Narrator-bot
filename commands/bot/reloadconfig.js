const cmd = require("node-cmd")
const db = require("quick.db")
module.exports = {
    name: "reloadconfig",
    run: async (message, args, client) => {
        if (!client.botAdmin(message.author.id)) return
        db.set("maintenance", "config-" + message.channel.id)
        message.channel.send("Updating config... please stand by...")
        await cmd.run("cd ~/wwosim/config && git pull")
        await cmd.run(`pm2 restart ${process.env.pm_id}`)
    },
}
