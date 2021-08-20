const { ids, github } = require("../../config")

module.exports = {
    name: "suggest",
    description: "Suggest something.",
    usage: `${process.env.PREFIX}suggest <description...>`,
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send("Invalid suggestion")
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
            body: `${args.join(" ")}\n\n** **\nThe above suggestion was sent by ${message.author.tag}\nUser ID: ${message.author.id}\nLocation: #${message.channel.name} (${message.channel.id}) in ${message.guild.name}`,
            labels: ["Suggestion"],

            owner: github.org,
            repo: github.repo,
        }

        let done = await client.github.request(`POST /repos/${github.org}/${github.repo}/issues`, issue)
        message.channel.send(`Your suggestion has been sent! Please provide any screenshots or more information here:\n<${done.data.html_url}>`)
        console.log(done)
    },
}
