const players = require("../schemas/players")
const { ids } = require("../config")

module.exports = (client) => {
    client.on("guildMemberAdd", async member => {
        if(!member.guild.id === ids.server.sim) return

        
    })
}