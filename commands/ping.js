module.exports = {
  name: "ping",
  description: "Replies with bot ping.",
  aliases: ["heartbeat", "response"],
  run: async (message, args) => {
    message.channel.send(`Pong! ${Math.ceil(message.client.ws.ping)} ms.`);
  }
};
