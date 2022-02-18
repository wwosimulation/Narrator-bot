const { MessageEmbed } = require("discord.js")
const { ids } = require("../../config")
const gamewarns = require("../../schemas/gamewarns")

module.exports = {
    command: {
        name: "gamewarn",
        description: "List, add and delete gamewarns. Some commands might not work for you.",
        options: [
            {
                type: "SUB_COMMAND",
                name: "add",
                description: "Give a game warning to a user for violating the game rules.",
                options: [
                    {
                        type: "USER",
                        name: "user",
                        description: "The user that should receive a game warning.",
                        required: true,
                    },
                    {
                        type: "STRING",
                        name: "reason",
                        description: "Name the reason for the game warning.",
                    },
                    {
                        type: "STRING",
                        name: "gamecode",
                        description: "The game code if this warning is given during a game.",
                    },
                ],
            },
            {
                type: "SUB_COMMAND",
                name: "remove",
                description: "Delete a game warning of a user.",
                options: [
                    {
                        type: "INTEGER",
                        name: "index",
                        description: "The case/index of the warning to remove.",
                        required: true,
                    },
                    {
                        type: "STRING",
                        name: "reason",
                        description: "Reason for deleting this warning.",
                    },
                ],
            },
            {
                type: "SUB_COMMAND",
                name: "list",
                description: "Show all (active) game warnings of a user or yourself.",
                options: [
                    {
                        type: "USER",
                        name: "user",
                        description: "The user who's game warnings should be listed below.",
                        required: false,
                    },
                ],
            },
            {
                type: "SUB_COMMAND",
                name: "show",
                description: "Show a specific game warning.",
                options: [
                    {
                        type: "INTEGER",
                        name: "index",
                        description: "The case/index of the warning to show.",
                        required: true,
                    },
                    {
                        type: "USER",
                        name: "mention",
                        description: "Mention a user in this message to show them this warning.",
                    },
                ],
            },
        ],
    },
    permissions: {
        sim: [
            { id: ids.staff, type: "ROLE", permission: true }, // @Staff
            { id: ids.afkstaff, type: "ROLE", permission: true }, //@AFK STAFF
            { id: ids.member, type: "ROLE", permission: true }, // @Member
        ],
        game: [
            { id: ids.narrator, type: "ROLE", permission: true }, // @Narrator
            { id: ids.mini, type: "ROLE", permission: true }, // @Narrator Trainee
            { id: ids.player, type: "ROLE", permission: true }, // @Player
        ],
    },
    server: ["sim", "game"],
    run: async (interaction, client) => {
        let sub = interaction.options.getSubcommand()
        switch (sub) {
            case "add": {
                if (!client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.staff) && !client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.afkstaff)) return interaction.reply({ content: "You are missing permissions to do that.", ephemeral: true })
                let guy = interaction.options.getUser("user")
                let warn = { user: guy.id, reason: interaction.options.getString("reason", false) ?? undefined, gamecode: interaction.options.getString("gamecode", false) ?? undefined }
                warn = await gamewarns.create(warn)

                let embed = new MessageEmbed({
                    title: `You have received a gamewarn! Case: ${warn.index}`,
                    description: `You have received a gamewarn in ${interaction.guild.name}!
**Reason:** ${warn.reason}
**Gamecode:** ${warn.gamecode}
**Date:** <t:${(Date.now() / 1000).toFixed()}:f>

If you think this gamewarn was given by accident please [open a ticket](https://discord.com/channels/465795320526274561/606230556832825481/905800163069665280) in [#${client.channels.resolve("606230556832825481").name}](https://discord.com/channels/465795320526274561/606230556832825481).`,
                    color: "DARK_RED",
                })

                let logEmbed = new MessageEmbed({
                    title: `Case: ${warn.index}`,
                    description: `**User:** ${guy} - ${guy.tag + " (" + guy.id})
**Reason:** ${warn.reason}
**Gamecode:** ${warn.gamecode}
**Date:** <t:${(Date.now() / 1000).toFixed()}:f>

**Warned by:** ${interaction.user} (${interaction.user.tag})`,
                    color: "DARK_RED",
                })
                try {
                    await guy.send({ embeds: [embed] })
                } catch (err) {
                    message.channel.send("Unable to send direct message! Please show the warning with `/gamewarn show index:" + warn.index + "` in a channel the user can see.")
                }
                client.channels.resolve(ids.channels.warnLog).send({ embeds: [logEmbed] })

                interaction.reply({ content: "User has been warned!", ephemeral: true })
                client.emit("gamebanned", guy)
                break
            }
            case "remove": {
                if (!client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.staff) && !client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.afkstaff)) return interaction.reply({ content: "You are missing permissions to do that.", ephemeral: true })
                let index = interaction.options.getInteger("index")
                let w = await gamewarns.findOne({ index })
                if (!w) return interaction.reply({ content: "This infraction does not exist." })
                let warn = await gamewarns.findOneAndDelete({ index })
                let logEmbed = new MessageEmbed({
                    title: `Case ${warn.index} deleted`,
                    description: `Warning **${warn.index}** was deleted by ${interaction.user.tag} (${interaction.user.id}) ${interaction.options.getString("reason", false) ? "\n**Reason:** " + interaction.options.getString("reason", false) : ""}

Raw warning:
\`\`\`js
${warn}
\`\`\`
`,
                    color: "DARK_VIVID_PINK",
                })
                interaction.reply({ content: "Successfully deleted the document.", ephemeral: true })
                client.channels.resolve(ids.channels.warnLog).send({ embeds: [logEmbed] })
                client.emit("gamebanned", client.users.cache.get(warn.user))
                break
            }
            case "list": {
                let guy = interaction.options.getUser("user", false)
                if ((client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.staff) || client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.afkstaff)) && guy) {
                    let warns = await gamewarns.find({ user: guy.id })
                    let warnEmbeds = []
                    warns.forEach((warn, i, arr) => {
                        let e = new MessageEmbed({
                            title: `Case: ${warn.index} - ${warn.date > (new Date().getTime() - 7889400000).toFixed() ? "Active" : "Inactive"}`,
                            description: `**User:** <@${warn.user}> - ${client.users.cache.get(warn.user).tag} (${warn.user})
**Reason:** ${warn.reason}
**Gamecode:** ${warn.gamecode}
**Date:** <t:${(warn.date / 1000).toFixed()}:f>`,
                            color: warn.date > (new Date().getTime() - 7889400000).toFixed() ? "GOLD" : "DARK_GOLD",
                            footer: { text: `Warn ${i + 1}/${arr.length}` },
                        })
                        warnEmbeds.push(e)
                    })
                    await interaction.reply({ content: warnEmbeds.length + " warns below." })
                    let msg = await interaction.followUp({ embeds: [warnEmbeds[0] || new MessageEmbed({ title: "No gamewarns found." })] })
                    await client.buttonPaginator(interaction.user.id, msg, warnEmbeds, 1)
                } else {
                    let active = (new Date().getTime() - 7889400000).toFixed() // 3 months
                    let warns = await gamewarns.find({ user: interaction.user.id, date: { $gt: active } })
                    let warnEmbeds = []
                    warns.forEach((warn, i, arr) => {
                        let e = new MessageEmbed({
                            title: `Case: ${warn.index}`,
                            description: `**User:** <@${warn.user}> - ${client.users.cache.get(warn.user).tag} (${warn.user})
**Reason:** ${warn.reason}
**Gamecode:** ${warn.gamecode}
**Date:** <t:${(warn.date / 1000).toFixed()}:f>`,
                            color: "GOLD",
                            footer: { text: `Warn ${i + 1}/${arr.length}` },
                        })
                        warnEmbeds.push(e)
                    })
                    await interaction.reply({ content: warnEmbeds.length + " warns below." })
                    let msg = await interaction.followUp({ embeds: [warnEmbeds[0] || new MessageEmbed({ title: "No active gamewarns found." })] })
                    await client.buttonPaginator(interaction.user.id, msg, warnEmbeds, 1)
                    client.emit("gamebanned", interaction.user)
                }
                break
            }
            case "show": {
                if (!client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.staff) && !client.guilds.cache.get(ids.server.sim).members.cache.get(interaction.user.id).roles.cache.has(ids.afkstaff)) return interaction.reply({ content: "You are missing permissions to do that.", ephemeral: true })
                let guy = interaction.options.getUser("mention", false)
                let index = interaction.options.getInteger("index")
                let warn = await gamewarns.findOne({ index })
                if (!warn) return interaction.reply({ content: "This infraction does not exist." })
                let x = {}
                if (guy) x.content = `${guy}`
                let embed = new MessageEmbed({
                    title: `Case ${warn.index}`,
                    description: `**User:** <@${warn.user}> - ${client.users.cache.get(warn.user).tag} (${warn.user})
**Reason:** ${warn.reason}
**Gamecode:** ${warn.gamecode}
**Date:** <t:${warn.date / 1000}:f>`,
                    color: "GREYPLE",
                })
                x.embeds = [embed]
                interaction.reply(x)
                break
            }
            default: {
                interaction.reply({ content: interaction.l10n("error") })
            }
        }
    },
}
