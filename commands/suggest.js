module.exports = {
  name: "suggest",
  run: async (message, args, client) => {
    if (!args[0]) return message.channel.send("Stop. You're making your life worse")
    let t = ""
    if (message.attachments.size > 0) {
      message.attachments.forEach((a) => (t += a.url + "\n"))
    }
    client.channels.cache
      .get("810682397150543892")
      .send(`Suggestion by ${message.author.tag}:\n${args.join(" ")}\n${t}`)
      .send(args.join(" ") + `\n${t}`)
    message.channel.send("Your suggestion has been sent")
  },
}
