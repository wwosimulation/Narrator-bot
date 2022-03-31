const players = require("../../schemas/players")
const { fn } = require("../../config")

module.exports = {
    name: "badges",
    description: "Displays all your badges.",
    usage: `${process.env.PREFIX}badges [user]`,
    run: async (message, args, client) => {
        let guy = fn.getUser(args[0], message)
        let description = ""
        let playerData = await players.findOne({ user: guy.id })
        for (const badge in playerData.badges) {
            description = description + `[${fn.capitalizeFirstLetter(badge).replace(/_/g, " ")}] `
        }
        description = description === "" ? `${guy.user.tag} does not have any badges.` : "```ini\n" + description + "\n```"
        let embed = { title: guy.user.tag + "'s Badges", description: "", thumbnail: { url: guy.user.avatarURL() }, timestamp: Date.now(), color: guy.displayColor ? guy.displayColor : 0x1fff43, description }

        message.channel.send({ embeds: [embed] })
    },
}