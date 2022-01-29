const config = require("../../config")
const Discord = require("discord.js")
module.exports = {
    name: "write",
    aliases: ["w"],
    description: "Write something with fancy letters and numbers.",
    usage: `${process.env.PREFIX}write <message...>`,
    run: async (message, args, client) => {
        if (!client.guilds.cache.get(config.ids.server.sim).members.cache.get(message.author.id).roles.cache.has("663389088354664477")) return console.log("No perms for emojis")
        message.delete()
        let newz = ""
        args.join(" ")
            .toLowerCase()
            .split("")
            .forEach((letter) => {
                let e = client.guilds.cache.get("850035156445298768").emojis.cache.find((x) => x.name == letter + "_")
                if (e) {
                    newz += `${e}`
                } else newz += `${letter}`
            })
        if (message.channel.permissionsFor(message.guild.me).has("MANAGE_WEBHOOKS") && message.guild.roles.cache.get(message.guild.id).permissions.has("USE_EXTERNAL_EMOJIS")) {
            let allHooks = await message.channel.fetchWebhooks()
            let hook = allHooks.find((x) => x.owner.id == client.user.id)
            if (!hook)
                hook = await message.channel.createWebhook(client.user.username, {
                    avatar: client.user.avatarURL(),
                    reason: `${process.env.PREFIX}emoji command`,
                })
            hook.send({ content: newz, username: message.member.nickname ? message.member.nickname : message.author.username, avatarURL: message.author.avatarURL() })
        } else {
            let userEmbed = new Discord.MessageEmbed({ description: `<@${message.author.id}>`, color: "#1FFF43" })
            message.channel.send(`${newz}`, userEmbed)
        }
    },
}
