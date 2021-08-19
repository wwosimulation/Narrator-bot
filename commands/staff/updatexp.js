const { fn } = require("../../config")

module.exports = {
    name: "updatexp",
    narratorOnly: true,
    run: async (message, args, client) => {
        let guy = client.users.cache.get(args[0])
        if (!guy) return message.channel.send(`${message.i10n("userInvalid", {user: args[0]})}\n${message.i10n("needUserId")}`)
        fn.updateXP(args[0], client)
        message.channel.send(message.i10n("done"))
    },
}
