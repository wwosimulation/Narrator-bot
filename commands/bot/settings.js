module.exports = {
    name: "settings",
    description: "Change your personal bot settings.",
    aliases: ["config"],
    run: async (message, args) => {
        let languageDropdown = new MessageSelectMenu().setCustomId(`configLanguage-${message.author.id}`).setMaxValues(1)
        let allLanguages = require("../../i10n/allLanguages.js")
        allLanguages.forEach(x => languageDropdown.addOptions({label: x, value: x}))
        message.channel.send({content: "Customize your settings below!", components: [new MessageActionRow().addComponents(languageDropdown)]})
    },
}
