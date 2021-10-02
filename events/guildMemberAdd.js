const players = require("../schemas/players")
const { ids } = require("../config")
const i10n = require("../i10n")

module.exports = (client) => {
    client.on("guildMemberAdd", async (member) => {
        member.dbUser = await players.findOne({ user: member.id }).exec()
        if (!member.dbUser) member.dbUser = new players({ user: member.id }).save()

        member.i10n = (key, replaceKeys = {}, language = member.dbUser.language) => {
            if (!language) language = "en"
            let string = i10n(key, language, replaceKeys)
            return string
        }

        /*let sim = client.guilds.cache.get(ids.server.sim)
        if (member.guild.id !== sim.id) return
        client.allInvites.every(async (invite) => {
            let inv = await sim.invites.resolve(invite.code)
            if (inv.uses !== invite.uses) {
                await players.updateOne({ "badges.invite.code": invite.code }, { $inc: { "badges.invite.members": 1 } })
                let guy = await players.findOne({ "badges.invite.code": invite.code })
                if (guy.badges.invite.unlocked === true) return
                if ((guy.badges.invite.members = 15)) {
                    await players.updateOne({ "badges.invite.code": invite.code }, { $set: { "badges.invite.unlocked": true } })
                    let guyUser = client.users.resolve(guy.user)
                    guyUser.send({ content: member.i10n("inviteBadgeUnlocked", { code: invite.code }) })
                }
            }
        })*/

        // Mainly copied from Wolvesville Utopium Bot => Stack Overflow
        let guildInvites = await member.guild.invites.fetch()
        const oldinv = client.allInvites
        client.allInvites = guildInvites
        /*guildInvites.each((guildInv) => {
            let coll = oldinv.filter((inv) => guildInv.code === inv.code && guildInv.uses !== inv.uses)
            invite = coll.first()
        })*/
        let invite = guildInvites.find((inv) => (inv.uses ? inv.uses : 0 > oldinv.get(inv.code).uses ? oldinv.get(inv.code).uses : 9999))
        if (!invite) {
            return member.user.send({ content: "Please contact modmail bla bla bla" })
        }
        const inviter = await players.findOne({ "badges.invite.code": invite.code })
        if (!inviter) return
        await players.findOneAndUpdate({ "badges.invite.code": invite.code }, { $inc: { "badges.invite.members": 1 } })
        let guy = await players.findOne({ "badges.invite.code": invite.code })
        if (guy.badges.invite.unlocked === true) return
        if (guy.badges.invite.members >= 1) {
            await players.updateOne({ "badges.invite.code": invite.code }, { $set: { "badges.invite.unlocked": true } })
            let guyUser = client.users.resolve(guy.user)
            guyUser.send({ content: member.i10n("inviteBadgeUnlocked", { code: invite.code }) })
        }
    })
}
