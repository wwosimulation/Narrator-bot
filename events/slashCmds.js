const db = require("quick.db")
const config = require("../config")
const { Collection, Util } = require("discord.js")
const cooldowns = new Collection()
const players = require("../schemas/players")
const l10n = require("../l10n")

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return
        let commandFile = client.slashCommands.get(interaction.commandName)

        let maint = db.get("maintenance")
        let blacklists = db.get(`blacklistss`) || []

        interaction.dbUser = await players.findOne({ user: interaction.user.id }).exec()
        if (!interaction.dbUser) interaction.dbUser = await players.create({ user: interaction.author.id })

        interaction.l10n = (key, replaceKeys = {}, language = interaction.dbUser.language) => {
            if (!language) language = "en"
            let string = l10n(key, language, replaceKeys)
            return string
        }

        if (maint && !client.botAdmin(interaction.user.id)) return interaction.reply({ content: interaction.l10n("maintenance"), ephemeral: true })
        if (blacklists.includes(`/${interaction.user.id}/`)) return interaction.reply({ content: interaction.l10n("blacklisted"), ephemeral: true })

        if ((commandFile.narratorOnly && !config.fn.isNarrator(interaction.member)) || (commandFile.staffOnly && !config.fn.isStaff(interaction.member))) return interaction.reply({ content: "You are missing permissions to do that!", ephemeral: true })

        if (!cooldowns.has(commandFile.name)) {
            cooldowns.set(commandFile.name, new Collection())
        }
        const now = Date.now()
        const timestamps = cooldowns.get(commandFile.name)
        const cooldownAmount = (commandFile.cooldown || 0) * 1000
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return interaction.reply({ content: `Please wait ${Math.ceil(timeLeft.toFixed(1))} more seconds before reusing the \`${commandFile.command.name}\` command.`, ephemeral: true })
            }
        }
        timestamps.set(interaction.user.id, now)
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

        let args = []
        if (interaction.options.data.lenght !== 0) {
            interaction.options.data.forEach((arg) => {
                let option = interaction.options.get(arg.name)
                args.push(option.value)
            })
        }
        if (!args[0]) args = ["None"]
        client.channels.cache.get("832884582315458570").send({ content: Util.removeMentions(`Slash command used: **${interaction.commandName}**\nArguments: **${args.join(" ")}**\nUser: ${interaction.user.tag} (${interaction.user.id})`) })
        await commandFile.run(interaction, client).catch((error) => {
            console.error(error)
            interaction.reply({ content: interaction.l10n("error"), ephemeral: true })
        })
    })
}
