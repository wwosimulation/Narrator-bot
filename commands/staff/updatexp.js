const { fn } = require("../../config")

module.exports = {
    name: "updatexp",
    description: "Update a user's xp.",
    usage: `${process.env.PREFIX}updatexp <userID>`,
    narratorOnly: true,
    run: async (message, args, client) => {
        let guy = client.users.cache.get(args[0])
        if (!guy) return message.channel.send(`${message.l10n("userInvalid", { user: args[0] })}\n${message.l10n("needUserId")}`)
        fn.updateXP(args[0], client)
        message.channel.send(message.l10n("done"))
    },
}
