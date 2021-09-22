const players = require("../schemas/players")
const { ids } = require("../config")

module.exports = (client) => {
    client.on("guildMemberAdd", async (member) => {
        let sim = client.servers.cache.get(ids.server.sim)
        if (member.guild.id !== sim.id) return
        client.invites.every(async (invite) => {
            let inv = await sim.invites.resolve(invite.code)
            if(inv.uses !== invite.uses) {
                await players.updateOne({"badges.invite.code": invite.code}, {$inc:{"badges.invite.members": 1}})
                let guy = await players.findOne({"badges.invite.code": invite.code})
                if(guy.badges.invite.unlocked === true) return
                if(guy.badges.invite.members = 15) {
                    await players.updateOne({"badges.invite.code": invite.code}, {$set:{"badges.invite.unlocked": true}})
                    let guyUser = client.users.resolve(guy.user)
                    guyUser.send({content:`Congratulations! You just unlocked the invite badge with the code \`${invite.code}\``})
                }
            }
        })
    })
}
