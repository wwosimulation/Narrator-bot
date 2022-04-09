const { getLangNameFromCode } = require("language-name-map")

module.exports = {
    name: "settings",
    description: "Select your preferred language for Narrator Bot.",
    usage: `${process.env.PREFIX}settings`,
    aliases: ["config", "lang", "language"],
    run: async (message, args) => {
        let languageDropdown = { type: 3, custom_id: `configLanguage-${message.author.id}`, max_values: 1, placeholder: "Language", options: [] }
        let allLanguages = require("../../l10n/allLanguages.js")
        allLanguages.forEach((x) => {
            let langName = getLangNameFromCode(x)?.native || x
            languageDropdown.options.push({ label: langName, value: x })
        })
        message.channel.send({ content: message.l10n("customizeSettings"), components: [{ type: 1, components: [languageDropdown] }] })
    },
}
