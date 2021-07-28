const { ids, github } = require("../../config")

module.exports = {
    name: "suggest",
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send()
        let t = ""
        if (message.attachments.size > 0) {
            if (message.guild.id == ids.server.game) {
                message.channel.send(message.i10n("suggestNoGameServer"))
            } else {
                message.attachments.forEach((a) => (t += a.url + "\n"))
            }
        }
        let issue = {
            title: `Suggestion ${message.id}`,
            body: `${args.join(" ")}\n\n** **\nThe above suggestion was sent by ${message.author.tag}\nUser ID: ${message.author.id}\nLocation: #${message.channel.name} (${message.channel.id}) in ${message.guild.name}`,
            labels: ["Suggestion"],

            owner: github.org,
            repo: github.repo,
        }

        let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
        message.channel.send(message.i10n("suggestSuccess", {url: done.data.html_url}))
    },
}
