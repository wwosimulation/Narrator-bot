const players = require("../../schemas/players")
const { fn } = require("../../config")
const { badgesFilter, getEmbedIndex, badgesEmbeds, badges } = require("../../config/src/badges")

module.exports = {
    name: "badges",
    description: "Displays all your badges.",
    usage: `${process.env.PREFIX}badges [user]`,
    run: async (message, args, client) => {
        let badge = badgesFilter(args.join(" "))
        if (badge.length == badges.length || badge.length == 0) {
            let guy = fn.getUser(args[0], message)
            let description = ""
            let playerData = await players.findOne({ user: guy.id })
            for (const badge in playerData.badges) {
                description = description + `[${fn.capitalizeFirstLetter(badge).replace(/_/g, " ")}] `
            }
            description = description === "" ? `${guy.user.tag} does not have any badges.` : "```ini\n" + description + "\n```"
            let embed = { title: guy.user.tag + "'s Badges", description: "", thumbnail: { url: guy.user.avatarURL() }, timestamp: Date.now(), color: guy.displayColor ? guy.displayColor : 0x1fff43, description }
            message.channel.send({ embeds: [embed] })
        } else {
            let msg = await message.channel.send({ embeds: [badgesEmbeds[getEmbedIndex(badge[0])]] })
            client.buttonPaginator(message.author.id, msg, badgesEmbeds, getEmbedIndex(badge[0]) + 1)
        }
    },
}
