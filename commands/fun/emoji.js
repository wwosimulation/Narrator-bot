const config = require("../../config")

module.exports = {
    name: "emoji",
    description: "Use emojis from different servers available from `emojilist`",
    usage: `${process.env.PREFIX}emoji <emoji>`,
    aliases: ["e"],
    run: async (message, args, client) => {
        if (!client.guilds.cache.get(config.ids.server.sim).members.cache.get(message.author.id).roles.cache.has("663389088354664477")) return
        message.delete()
        let emoji = client.userEmojis.find((x) => x.name.toLowerCase() == args.join("_").toLowerCase())
        if (!emoji) return message.author.send(message.l10n("emojiNotFound"))
        if (message.channel.permissionsFor(message.guild.me).has("MANAGE_WEBHOOKS")) {
            let allHooks = await message.channel.fetchWebhooks()
            let hook = allHooks.find((x) => x.owner.id == client.user.id)
            if (!hook)
                hook = await message.channel.createWebhook(client.user.username, {
                    avatar: client.user.displayAvatarURL(),
                    reason: `${process.env.PREFIX}emoji command`,
                })
            hook.send({ content: `${emoji}`, username: message.member.nickname ? message.member.nickname : message.author.username, avatarURL: message.author.displayAvatarURL() })
        } else {
            let userEmbed = { description: `<@${message.author.id}>`, color: 0x1fff43 }
            message.channel.send({ content: `${emoji}`, embeds: [userEmbed] })
        }
    },
}
