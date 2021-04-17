module.exports = {
  name: "bug",
  run: async (message, args, client) => {
    if (!args[0]) return message.channel.send("Stop. You're making your life worse")
    let t = ""
    if (message.attachments.size > 0) {
      message.attachments.forEach((a) => (t += a.url + "\n"))
    }
    client.channels.cache.get("608673097058353164").send(`Bug reported by ${message.author.tag}:\n${args.join(" ")}\n${t}`)
    message.channel.send("Bug reported")
  },
}
