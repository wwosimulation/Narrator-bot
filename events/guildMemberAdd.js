const players = require("../schemas/players")
const { ids } = require("../config")
const l10n = require("../l10n")

module.exports = (client) => {
    client.on("guildMemberAdd", async (member) => {
        /*member.dbUser = await players.findOne({ user: member.id }).exec()
        if (!member.dbUser) member.dbUser = new players({ user: member.id }).save()

        member.l10n = (key, replaceKeys = {}, language = member.dbUser.language) => {
            if (!language) language = "en"
            let string = l10n(key, language, replaceKeys)
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
                    guyUser.send({ content: member.l10n("inviteBadgeUnlocked", { code: invite.code }) })
                }
            }
        })// normally here would also be a comment

        // Mainly copied from Wolvesville Utopium Bot => Stack Overflow
        let guildInvites = await member.guild.invites.fetch()
        const oldinv = client.allInvites.clone()
        client.allInvites = guildInvites.clone()

        let invite = guildInvites.find((inv) => {
            if(inv.uses && oldinv.get(inv.code).uses && inv.uses > oldinv.get(inv.code).uses) return true
            else return false
        })
        console.log(invite)
        if (!invite) {
            return member.send({ content: `Hey ${member.user}!\nWe were not able to track the invite you used. If you want to, you can tell us by DMing <@831722996149518366> (Modmail#7955). The inviter might get rewarded if they invited a specific amount of new members.` })
        }

        const inviter = await players.findOne({ "badges.invite.code": invite.code })
        if (!inviter) return

        await players.findOneAndUpdate({ "badges.invite.code": invite.code }, { $inc: { "badges.invite.members": 1 } })
        let guy = await players.findOne({ "badges.invite.code": invite.code })
        if (guy.badges.invite.unlocked === true) return
        if (guy.badges.invite.members >= 1) {
            await players.updateOne({ "badges.invite.code": invite.code }, { $set: { "badges.invite.unlocked": true } })
            let guyUser = client.users.resolve(guy.user)
            guyUser.send({ content: member.l10n("inviteBadgeUnlocked", { code: invite.code }) })
        }*/
    })
}
