const config = require("../../config")
const db = require("quick.db")

module.exports = {
    name: "say",
    description: "Let the bot say something for you.",
    usage: `${process.env.PREFIX}say [channel_id] <message...>`,
    run: async (message, args, client) => {
        if (!client.botAdmin(message.author.id) && (!config.fn.isNarrator(message.member) || db.get("settings.disableSay"))) return
        message.delete()
        let idsendreply = args[0]
        let reply = ""
        let channel = await client.channels.cache.get(idsendreply)
        if (!channel) {
            let sf = parseInt(idsendreply)
            replyMsg = sf ? await message.channel.messages.fetch(sf) : null
            if (reply) {
                args.shift()
                return await replyMsg.reply(args.join(" "))
            } else {
                return message.channel.send(args.join(" "))
            }
        } else {
            args.shift()
            channel.send(args.join(" "))
        }
    },
}
