module.exports = {
    name: "emergencystop",
    aliases: ["es", "yesstop", "reboot"],
    staffOnly: true,
    run: async (message, args, client) => {
        message.channel.send(message.i10n("emergencyStop"))
        client.user.setStatus("offline")
        require("node-cmd").run(`pm2 restart ${process.env.pm_id}`)
    },
}
