const config = require("../../config")

module.exports = {
    name: "reverse",
    description: "Use this command to reverse sentences or words.",
    usage: `${process.env.PREFIX}reverse`,
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send(`Please use the correct command format (${process.env.PREFIX}reverse <sentence>) `)
        const newargs = args.join(" ")
        const msg = newargs.split("").reverse().join("")
        message.delete()
        if (message.channel.permissionsFor(message.guild.me).has("MANAGE_WEBHOOKS")) {
            let allHooks = await message.channel.fetchWebhooks()
            let hook = allHooks.find((x) => x.owner.id == client.user.id)
            if (!hook)
                hook = await message.channel.createWebhook(client.user.username, {
                    avatar: client.user.avatarURL(),
                    reason: `${process.env.PREFIX}reverse command`,
                })
            hook.send(`${msg}`, { username: message.member.nickname ? message.member.nickname : message.author.username, avatarURL: message.author.avatarURL() })
        } else {
            let userEmbed = new Discord.MessageEmbed().setDescription(`<@${message.author.id}>`).setColor("#1FFF43")
            message.channel.send(msg)
        }
    },
}
