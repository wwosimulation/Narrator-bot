const { messageEmbed } = require("discord.js")
const players = require("../../schemas/players")
const { ids } = require("../../config")

module.exports = {
    name: "register",
    description: "Register your invite link to be able to get the Invite badge.",
    usage: `${process.env.PREFIX}register [invite]`,
    run: async (message, args, client) => {
        let code = ""
        let sim = client.guilds.cache.get(ids.server.sim)
        let status = ""
        let response = new messageEmbed().setThumbnail(message.author.avatarURL()).setTimestamp().setFooter(`Want to check which invite you registered? Use ${process.env.PREFIX}register`)

        if (!args[0]) {
            let guy = await players.findOne({ user: message.author.id })
            if (guy.badges.invite.code && guy.badges.invite.code !== "none") {
                response.setColor("GREEN").setDescription(message.i10n("registeredInvite", { code: guy.badges.invite.code, uses:guy.badges.invite.members}))
            } else {
                response.setColor("RED").setDescription(message.i10n("noInviteRegistered", {usage: this.usage}))
            }
            return message.channel.send({ embeds: [response] })
        }

        if (args[0].startsWith("https://discord.gg/" || arsg[0].startsWith("discord.gg/"))) code = args[0].split("discord.gg/")[1]
        else code = args[0]

        sim.invites.fetch().then((coll) => {
            if (coll.has(code)) {
                let inv = coll.get(code)
                if (inv.inviter.id !== message.author.id) status = "not own"
                else status = "valid"
            } else status = "not sim"
        })

        /* IMPORTANT STUFF! (for me lol)
        if(x.invites.fetch().then(coll => { if() {} })) {}
        */

        switch (status) {
            case "valid":
                await players.findOneAndUpdate({ user: message.author.id }, { $set: { "badges.invite.code": code } }, { upsert: true })
                client.invites.set(code, sim.invites.resolve(code))
                response.setColor("GREEN").setDescription(message.i10n("inviteRegistered", {code: code})).setTitle(message.i10n("inviteAdded"))
            case "not own":
                response.setColor("RED").setDescription(message.i10n("notOwnInvite")).setTitle(message.i10n("inviteAddFailed"))
            case "not sim":
                response.setColor("RED").setDescription(message.i10n("notSimInvite", {code: code})).setTitle(message.i10n("inviteAddFailed"))
            default:
                response.setColor("RED").setDescription(message.i10n("inviteNotResolveable")).setTitle(message.i10n("inviteAddFailed"))
        }
        return message.channel.send({ embeds: [response] })
    },
}
