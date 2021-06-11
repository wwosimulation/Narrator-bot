const { ids } = require("../../config.js")

module.exports = {
    name: "bug",
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send("Invalid bug")
        let t = ""
        if (message.attachments.size > 0) {
            if (message.guild.id == ids.server.game) {
                message.channel.send("Images attached to a bug from the game server cannot be submitted! Please use the link below to add your attachments.")
            } else {
                message.attachments.forEach((a) => (t += a.url + "\n"))
            }
        }
        //client.channels.cache.get("608673097058353164").send(`Bug reported by ${message.author.tag}:\n${args.join(" ")}\n${t}`)
        let issue = {
            title: `Bug report ${message.id}`,
            body: `${args.join(" ")}\n\n** **\nThe above bug was reported by ${message.author.tag}\nUser ID: ${message.author.id}\nLocation: #${message.channel.name} (${message.channel.id}) in ${message.guild.name}`,
            labels: ["Bug", "Unverified"],
        }
        let done = await client.github.post("/issues", issue)
        message.channel.send(`The bug has successfully been reported! Please provide any screenshots or more information here:\n<${done.data.html_url}>`)
        console.log(done)
    },
}
