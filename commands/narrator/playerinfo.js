const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "playerinfo",
    description: "Get the playerinfo.",
    usage: `${process.env.PREFIX}playerinfo (raw|block)`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let players = db.get(`players`) || []
        const embed = { title: "Playerinfo", description: "", color: 0x648620 }
        content = ""
        for await (const p of players) {
            let player = db.get(`player_${p}`)
            let member = await message.guild.members.fetch(p)
            if (player.allRoles?.length > 0) content += player.allRoles.map((r) => `${getEmoji(r.toLowerCase().replace(/\s/g, "_"), client)}`).join("")
            else content += `${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)}`

            content += ` ${players.indexOf(p) + 1}. ${member.user.tag}\n`
        }

        embed.description = content

        if (args?.[0]?.toLowerCase() == "raw") {
            message.channel.send(`**Playerinfo**\n${content}`)
        } else if (args?.[0]?.toLowerCase() == "block") {
            message.channel.send(`\`\`\`**Player Info**\n${content}\`\`\``)
        } else {
            message.channel.send({ embeds: [embed] })
        }
        return
    },
}
