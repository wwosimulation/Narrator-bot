const { MessageEmbed } = require("discord.js")
const players = require("../../schemas/players")
const { ids } = require("../../config")

module.exports = {
    name: "register",
    description: "Register your invite link to be able to get the Invite badge.",
    usage: `${process.env.PREFIX}register`,
    run: async (message, args, client) => {
        // let sim = client.guilds.cache.get(ids.server.sim)
        let response = new MessageEmbed().setThumbnail(message.author.avatarURL()).setTimestamp().setFooter(`Want to check which invite you registered? Use ${process.env.PREFIX}register`)

        let guy = await players.findOne({ user: message.author.id })
        if (guy.badges.invite.code && guy.badges.invite.code !== "none") {
            response.setColor("GREEN").setDescription(message.i10n("registeredInvite", { code: guy.badges.invite.code, uses: guy.badges.invite.members }))
        } else {
            response.setColor("RED").setDescription(message.i10n("noInviteRegistered", { usage: this.usage }))
        }

        let sim = client.guilds.resolve(ids.server.sim)
        sim.invites.create("606123774978293772", { maxAge: 0, unique: true, reson: `Invite registered by ${message.author.tag}` }).then(async (invite) => {
            await players.findOneAndUpdate({ user: message.author.id }, { $set: { "badges.invite.code": invite.code } }, { upsert: true })
            client.allinvites.set(invite.code, sim.invites.resolve(invite.code))
            response
                .setColor("GREEN")
                .setDescription(message.i10n("inviteRegistered", { code: invite.code }))
                .setTitle(message.i10n("inviteAdded"))
        })

        /*switch (status) {
            case "valid":
                response
                    .setColor("GREEN")
                    .setDescription(message.i10n("inviteRegistered", { code: invite.code }))
                    .setTitle(message.i10n("inviteAdded"))
            case "not own":
                response.setColor("RED").setDescription(message.i10n("notOwnInvite")).setTitle(message.i10n("inviteAddFailed"))
            case "not sim":
                response
                    .setColor("RED")
                    .setDescription(message.i10n("notSimInvite", { code: code }))
                    .setTitle(message.i10n("inviteAddFailed"))
            default:
                response.setColor("RED").setDescription(message.i10n("inviteNotResolveable")).setTitle(message.i10n("inviteAddFailed"))
        }*/
        return message.channel.send({ embeds: [response] })
    },
}
