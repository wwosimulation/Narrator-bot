const { fn } = require("../../config")

module.exports = {
    name: "help",
    description: "Get the command list or help for a specific command.",
    usage: `${process.env.PREFIX}help [command | arguments]`,
    run: async (message, args, client) => {
        // help embed
        let embed = { title: "", description: "", fields: [], footer: {}, color: 0x7419b4, thumbnail: { url: client.user.avatarURL() } }
        let cmd_target
        // Checking if args[0] is a command
        if (args[0]) {
            cmd_target = client.commands.get(args[0].toLowerCase()) || client.commands.find((a) => a.aliases && a.aliases.includes(args[0].toLowerCase()))
        }
        // If args[0] is a command, send a specific command card.
        if (cmd_target) {
            embed.title = fn.capitalizeFirstLetter(cmd_target.name)
            embed.description = `Prefix: \`${process.env.PREFIX}\`\nUse ${process.env.PREFIX}help to see all commands.\n` + embed.fields.push({ name: "Description", value: cmd_target.description || "No description given." }, { name: "Usage:", value: `\`${cmd_target.usage || `No usage given or "${process.env.PREFIX + cmd_target.name}"`}\`` })
            embed.footer = { text: "[] = optional argument\n<> = required argument", icon_url: message.author.avatarURL() }

            // if the command has aliases add those
            if (cmd_target.aliases) {
                embed.fields.push({ name: "Aliases:", value: `${cmd_target.aliases.length ? cmd_target.aliases.map((alias) => `\`${alias}\``).join(" ") : "No aliases"}` })
            }
        } else if (["args", "arg", "arguments", "argument"].includes(args[0])) {
            embed.title = message.l10n("helpHeader")
            embed.timestamp = Date.now()
            embed.footer = { text: `Requested by ${message.author.tag}`, iconURL: message.author.avatarURL() }
            embed.description = `**Argument Requirement:**\n` + `\`(sub)command\`\n` + `\`<required>\`\n` + `\`[optional]\`\n` + `\`[option1 | option2]\`, \`<option1 | option2>\`\n` + `\`[<optional> <but_two_required>]\`\n` + `\`<no_limit...>\``
            embed.fields.push({ name: "Arguments", value: `\`amount\` - Positive number.\n` + `\`description\`- Text that should explain something detailed.\n` + `\`message\` - Some text you want to be sent somewhere else.\n` + `\`player\` - A player in the game. Their number always works.\n` + `\`user\` - UserID, mention, tag, username or nickname. Some commands don't support all options.\n` + `\`command\` - Any command or alias.\n` + `\`color\` - Color from \`${process.env.PREFIX}shop color\`, color or hex code.\n` + `\`emoji\` - Eomoji name from \`${process.env.PREFIX}emojilist\`.\n` + `\`item\` - Item from the shop or your inventory.\n` + `\`quest\` - Quest name.\n` + `\`role\` - Role from the game.\n` + `\`time\` - Duration (\`2 days\`, \`1m\`, etc.)\n` + `\`xp\` - Amount of xp.\n` + `Note: Some arguments were left out as they are obvious to understand like \`nickname\`.` })
        }
        // if args[0] doesn't exist or it is not a command
        else {
            embed.title = message.l10n("helpHeader")
            embed.description = message.l10n("helpMain", { gamewarning: "<#606123818305585167>", howtoplay: "<#859001588617445436>", rankedwarn: "<#860552178095882240>", supportandquestions: "<#606123788257591297>", clientUser: `<@${client.user.id}>`, prefix: process.env.PREFIX })
            embed.fields.push({ name: message.l10n("economy"), value: message.l10n("helpEconomy") })
            embed.fields.push({ name: message.l10n("fun"), value: message.l10n("helpFun") })
            embed.fields.push({ name: message.l10n("bot"), value: message.l10n("helpBot") })
        }

        message.channel.send({ embeds: [embed] })
    },
}
