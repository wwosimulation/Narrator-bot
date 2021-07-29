const { ids, github } = require("../../config")

module.exports = {
    name: "bug",
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send(message.i10n("bugNoArguments"))
        let t = ""
        if (message.attachments.size > 0) {
            if (message.guild.id == ids.server.game) {
                message.channel.send(message.i10n("bugNoGameServer"))
            } else {
                message.attachments.forEach((a) => (t += a.url + "\n"))
            }
        }
        //client.channels.cache.get("608673097058353164").send(`Bug reported by ${message.author.tag}:\n${args.join(" ")}\n${t}`)
        let issue = {
            title: `Bug report ${message.id}`,
            body: `${args.join(" ")}\n\n** **\nThe above bug was reported by ${message.author.tag}\nUser ID: ${message.author.id}\nLocation: #${message.channel.name} (${message.channel.id}) in ${message.guild.name}`,
            labels: ["Bug", "Unverified"],
            owner: github.org,
            repo: github.repo,
        }

        let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
        message.channel.send(message.i10n("bugSuccess", { url: done.data.html_url }))
    },
}
