const { ids, github } = require("../../config")

module.exports = {
    name: "suggest",
    description: "Suggest something.",
    usage: `${process.env.PREFIX}suggest <description...>`,
    aliases: ["suggestion"],
    run: async (message, args, client) => {
        return client.commands.get("movedtoslash").run(message, args, client)
        if (!args[0]) return message.channel.send(message.l10n("suggestNoArguments"))
        let t = ""
        if (message.attachments.size > 0) {
            if (message.guild.id == ids.server.game) {
                message.channel.send("Images attached to a suggestion from the game server cannot be submitted! Please use the link below to add your attachments.")
            } else {
                message.attachments.forEach((a) => (t += a.url + "\n"))
            }
        }
        let issue = {
            title: `Suggestion ${message.id}`,
            body: `${args.join(" ")}\n\n** **\nThe above suggestion was sent by ${message.author.tag}\nUser ID: ${message.author.id}\nLocation: [#${message.channel.name}](https://discord.com/channels/${message.guildId + "/" + message.channelId}) (${message.channel.id}) in [${message.guild.name}](https://discord.com/channels/${message.guildId})`,
            labels: ["Suggestion"],

            owner: github.org,
            repo: github.repo,
        }

        let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
        message.channel.send(message.l10n("suggestSuccess", { url: done.data.html_url }))
    },
}
