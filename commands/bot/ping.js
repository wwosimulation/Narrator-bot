module.exports = {
    name: "ping",
    description: "Replies with bot ping.",
    usage: `${process.env.PREFIX}ping`,
    aliases: ["heartbeat", "response"],
    run: async (message, args) => {
        message.channel.send(`${message.l10n("ping")}! ${Math.ceil(message.client.ws.ping)} ms.`)
    },
}
