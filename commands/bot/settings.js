const { MessageSelectMenu, MessageActionRow } = require("discord.js")
const { getLangNameFromCode } = require("language-name-map")

module.exports = {
    name: "settings",
    description: "Select your preferred language for Narrator Bot.",
    usage: `${process.env.PREFIX}settings`,
    aliases: ["config", "lang", "language"],
    run: async (message, args) => {
        let languageDropdown = new MessageSelectMenu().setCustomId(`configLanguage-${message.author.id}`).setMaxValues(1).setPlaceholder("Language")
        let allLanguages = require("../../l10n/allLanguages.js")
        allLanguages.forEach((x) => {
            let langName = getLangNameFromCode(x)?.native || x
            languageDropdown.addOptions({ label: langName, value: x })
        })
        message.channel.send({ content: message.l10n("customizeSettings"), components: [new MessageActionRow().addComponents(languageDropdown)] })
    },
}
