const db = require("quick.db")
const { getRole, ids, getEmoji } = require("../config")

module.exports = (client) => {

    client.on("wardenChat", async ({guildId, guy, content}) => {
        const players = db.get(`players`)
        const guild = client.guilds.cache.get(guildId)
        if (!players.includes(guy)) return;
        
        let player = db.get(`player_${guy}`)
        if (player?.status !== "Alive") return;

        if (!player?.jailed) return;

        let warden = players.find(p => db.get(`player_${p}`)?.role === "Warden")
        if (warden) {
            let channel = guild.channels.cache.get(db.get(`player_${warden}`).channel)
            let wardChannel = guild.channels.cache.find(c => c.name === "warden-jail")
            let message = content
                .replace(/@everyone/g, "everyone")
                .replace(/@here/g, "here")
                .replace(/<([@#])+[&]?[\d]{10,20}>/g, "[ping]")
            if (content.length > 1850) return await wardChannel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")

            channel.send(`${getEmoji("warden_jail", client)} **${players.indexOf(player.id)+1} ${player.username}**: ${message}`)
        }
    })
}
