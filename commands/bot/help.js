const { MessageEmbed } = require("discord.js")

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = {
    name: "help",
    description: "Get the command list or help for a specific command.",
    usage: `${process.env.PREFIX}help [command | arguments]`,
    run: async (message, args, client) => {
        // help embed
        let embed = new MessageEmbed().setColor(0x7419b4)
        let cmd_target
        // Checking if args[0] is a command
        if (args[0]) {
            cmd_target = client.commands.get(args[0].toLowerCase()) || client.commands.find((a) => a.aliases && a.aliases.includes(args[0].toLowerCase()))
        }
        // If args[0] is a command, send a specific command card.
        if (cmd_target) {
            embed
                .setTitle(capitalizeFirstLetter(cmd_target.name))
                .setDescription(
`Prefix: \`${process.env.PREFIX}\`

Use ${process.env.PREFIX}help to see all commands.
                `
                )
                .addFields({ name: "Description", value: cmd_target.description || "No description given." }, { name: "Usage:", value: `\`${cmd_target.usage || `No usage given or "${process.env.PREFIX + cmd_target.name}"`}\`` })
                .setFooter("\`[]\` = optional argument\n\`<>\` = required argument", message.author.avatarURL())

            // if the command has aliases add those
            if (cmd_target.aliases) {
                embed.addFields({ name: "Aliases:", value: `${cmd_target.aliases.length ? cmd_target.aliases.map((alias) => `\`${alias}\``).join(" ") : "No aliases"}` })
            }
        } else if (["args", "arg", "arguments", "argument"].includes(args[0])) {
            embed
                .setTitle("Argument Help")
                .setDescription(
                    `
**Argument Requirement:**
\`(sub)command\`
\`<required>\`
\`[optional]\`
\`[option1 | option2]\`, \`<option1 | option2>\`
\`[<optional> <but_two_required>]\`
\`<no_limit...>\``
                )
                .setThumbnail("https://cdn.discordapp.com/icons/465795320526274561/a_e9cb116d974c3cdb34ecf1e65e74ea2a.png")
                .setTimestamp()
                .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
                .addField(
                    "Arguments",
                    `
\`amount\` - Positive number.
\`description\`- Text that should explain something detailed.
\`message\` - Some text you want to be sent somewhere else.
\`player\` - A player in the game. Their number always works.
\`user\` - UserID, mention, tag, username or nickname. Some commands don't support all options.

\`command\` - Any command or alias.
\`color\` - Color from \`${process.env.PREFIX}shop color\`, color or hex code.
\`emoji\` - Eomoji name from \`${process.env.PREFIX}emojilist\`.
\`item\` - Item from the shop or your inventory.
\`quest\` - Quest name.
\`role\` - Role from the game.
\`time\` - Duration (\`2 days\`, \`1m\`, etc.)
\`xp\` - Amount of xp.


Note: Some arguments were left out as they are obvious to understand like \`nickname\`.`
                )
        }
        // if args[0] doesn't exist or it is not a command
        else {
            embed
                .setTitle("About Narrator Bot")
                .setDescription(
                    `**__How to join a simulation game?__**
When a game is live, it will be announced in <#606123818305585167>. Click on the join game button to join a game server.
Read more about how to play in <#859001588617445436>. Ranked games will be announced in <#860552178095882240>.


Use following commands with <@744538701522010174>'s prefix (${process.env.PREFIX}).
`
                )
                .addField(message.i10n("economy"), message.i10n("helpEconomy"))
                .addField(message.i10n("fun"), message.i10n("helpFun"))
                .addField(message.i10n("bot"), message.i10n("helpBot"))
        }
        message.channel.send({ embeds: [embed] })
    },
}
