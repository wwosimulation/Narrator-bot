const { MessageEmbed } = require("discord.js")
const players = require("../../schemas/players")
const { ids } = require("../../config")

module.exports = {
    name: "register",
    description: "Request an invite to earn the invite badge.",
    usage: `${process.env.PREFIX}register`,
    run: async (message, args, client) => {
        return message.channel.send({ content: "This command is currently not available! We hope it will be released soon!" })

        let response = new MessageEmbed().setThumbnail(message.author.avatarURL()).setTimestamp().setFooter(`Want to check which invite you registered? Use ${process.env.PREFIX}register`)

        let guy = await players.findOne({ user: message.author.id })
        if (guy.badges.invite.code && guy.badges.invite.code !== "none") {
            response.setColor("GREEN").setDescription(message.l10n("registeredInvite", { code: guy.badges.invite.code, uses: guy.badges.invite.members }))
            return message.channel.send({ embeds: [response] })
        } else {
            let sim = client.guilds.resolve(ids.server.sim)
            sim.invites.create("606123774978293772", { maxAge: 0, unique: true, reson: `Invite registered by ${message.author.tag}` }).then(async (invite) => {
                await players.findOneAndUpdate({ user: message.author.id }, { $set: { "badges.invite.code": invite.code } }, { upsert: true })
                client.allInvites.set(invite.code, sim.invites.resolve(invite.code))
                response
                    .setColor("GREEN")
                    .setDescription(message.l10n("inviteRegistered", { code: invite.code }))
                    .setTitle(message.l10n("inviteAdded"))

                return message.channel.send({ embeds: [response] })
            })
        }
    },
}
