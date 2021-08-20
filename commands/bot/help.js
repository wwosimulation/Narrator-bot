const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "help",
    description: "Get the command list or help for a specific command.",
    usage: `${process.env.PREFIX}help [command | arguments]`,
    run: async (message, args) => {
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
                .setTitle(client.utils.capitalizeFirstLetter(cmd_target.name))
                .setDescription(
                    `Prefix: \`${process.env.PREFIX}\`
                \`[]\` = optional argument
                \`<>\` = required argument

                Use ${process.env.PREFIX}help to see all commands.
                `
                )
                .addFields({ name: "Description", value: cmd_target.description || "No description given." }, { name: "Usage:", value: `\`${cmd_target.usage || `No usage given or "${process.env.PREFIX + cmd_target.name}"`}\`` })

            // if the command has aliases add those
            if (cmd_target.aliases) {
                embed.addField({ name: "Aliases:", value: `${cmd_target.aliases.length ? cmd_target.aliases.map((alias) => `\`${alias}\``).join(" ") : "No aliases"}` })
            }
        }
        else if(["args", "arg", "arguments", "argument"].includes(args[0])) {
            embed
            .setTitle("Argument Help")
            .setDescription(`
**Argument Requirement:**
\`(sub)command\`
\`<required>\`
\`[optional]\`
\`[option1 | option2]\`, \`<option1 | option2>\`
\`[<optional> <but_two_required>]\`
\`<no_limit...>\``)
            .setThumbnail("https://cdn.discordapp.com/icons/465795320526274561/a_e9cb116d974c3cdb34ecf1e65e74ea2a.png")
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
            .addField("Arguments",`
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


Note: Some arguments were left out as they are obvious to understand like \`nickname\`.`)
        }
        // if args[0] doesn't exist or it is not a command
        else {
            embed
                .setTitle("About Narrator Bot")
                .setDescription(
                    `**__How to join a simulation game?__**
When a game is live, it will be announced in <#606123818305585167>. Click on the join game button to join a game server.
Read more about how to play in <#859001588617445436>. Ranked games will be announced in <#860552178095882240>.

For any questions head over to the <#606123788257591297>.

Use following commands with <@744538701522010174>'s prefix (${process.env.PREFIX}).
`
                )
                .addField("Economy", "`shop` Buy different items in the shop.\n" + "`daily` Get coins, roses, items as a daily reward.\n" + "`inventory` Find the roses, coins, items in your inventory.\n" + "`balance` Check how many narrator bot coins you got.\n" + "`namechange` Give your custom role a new name.\n" + "`colorchange` Give your custom role a new color.\n" + "`profile` Checkout your exclusive profile. Available in the shop!\n" + "`use` Use this command with the item name such as lootbox, icon to use them.")
                .addField("Fun", "`emoji` use emojis from different servers available from `emojilist`.\n" + "`write` Write something with fancy letters and numbers.\n")
                .addField("Bot", "`botinfo` Get to know more about the bot.\n" + "`bug` Report a bug to the development team.\n" + "`suggest` Suggest a improvement, enhancement for the simulation.\n" + "`roleinfo` Know more about the in game roles and interactions.\n")
        }

        message.channel.send({ embeds: [embed] })
    },
}
