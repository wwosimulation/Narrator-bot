module.exports = {
    name: "emergencystop",
    description: "Reboot the bot.",
    usage: `${process.env.PREFIX}emergencystop`,
    aliases: ["es", "yesstop", "reboot"],
    staffOnly: true,
    run: async (message, args, client) => {
        message.channel.send(message.l10n("emergencyStop"))
        client.user.setStatus("offline")
        require("node-cmd").run(`pm2 restart ${process.env.pm_id}`)
    },
}
