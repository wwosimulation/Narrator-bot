const db = require("quick.db")
const { getRole, ids, getEmoji } = require("../config")
const shuffle = require("shuffle-array")
module.exports = (client) => {
    //Bot updating roles
    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        let maint = db.get("maintenance")
        if (maint) return
        if (newMember.guild.id != ids.server.game) return
        if (newMember.roles.cache.has(ids.dead) && oldMember.roles.cache.has(ids.dead)) return
        if (!newMember.roles.cache.has(ids.dead)) return
        newMember.roles.remove(ids.revealed)
        
    })
}
