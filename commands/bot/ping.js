module.exports = {
    name: "ping",
    description: "Replies with bot ping.",
    aliases: ["heartbeat", "response"],
    run: async (message, args) => {
        message.channel.send(`${message.i10n("ping")}! ${Math.ceil(message.client.ws.ping)} ms.`)
    },
}
