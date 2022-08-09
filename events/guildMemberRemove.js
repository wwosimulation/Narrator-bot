const db = require("quick.db")
const { getRole, ids, getEmoji } = require("../config")
const shuffle = require("shuffle-array")

module.exports = (client) => {
    client.on("guildMemberRemove", async (member) => {
        let maint = db.get("maintenance")
        if (maint) return
        if (member.guild.id != ids.server.game) return

        const players = db.get(`players`) || []

        if (!players.includes(member.id)) return

        db.set(`player_${member.id}.status`, "Zombie") // set to Zombie status which is neither dead, nor alive
        db.set(`player_${member.id}.fled`, true)

        let dayChat = member.guild.channels.cache.find((c) => c.name === "day-chat")
        dayChat.send(`${getEmoji("died", client)} **${players.indexOf(member.id) + 1} ${db.get(`player_${member.id}`).username}** has fled the village! Their role will not be revealed.`)
    })
}
