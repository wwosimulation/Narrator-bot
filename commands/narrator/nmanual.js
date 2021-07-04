module.exports = {
    name: "nmanual",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let chann = message.guild.channels.cache.filter((c) => c.name === `priv-${args[1]}`).keyArray("id")

        let guy = message.guild.members.cache.find((m) => m.nickname === args[0])

        for (let i = 0; i < chann.length; i++) {
            let channe = message.guild.channels.cache.get(chann[i])
            if (channe.permissionsFor(guy.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                channe.updateOverwrite(guy.id, {
                    VIEW_CHANNEL: false,
                    READ_MESSAGE_HISTORY: false,
                    SEND_MESSAGES: false,
                })
            }
            if (channe.name.includes("wolf")) {
                let wolfchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
                wolfchat.updateOverwrite(guy.id, {
                    READ_MESSAGE_HISTORY: null,
                    SEND_MESSAGES: null,
                    VIEW_CHANNEL: null,
                })
            }
            if (channe.name.includes("wolf")) {
                let wwvote = message.guild.channels.cache.find((c) => c.name === "ww-vote")
                wwvote.updateOverwrite(guy.id, {
                    READ_MESSAGE_HISTORY: null,
                    SEND_MESSAGES: null,
                    VIEW_CHANNEL: null,
                })
            }

            if (channe.name.includes("sibling")) {
                let wolfchat = message.guild.channels.cache.find((c) => c.name === "sibling-chat")
                wolfchat.updateOverwrite(guy.id, {
                    READ_MESSAGE_HISTORY: null,
                    SEND_MESSAGES: null,
                    VIEW_CHANNEL: null,
                })
            }
        }
    },
}
