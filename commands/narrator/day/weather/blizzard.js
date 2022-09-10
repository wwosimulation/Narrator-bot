const db = require("quick.db")
const shuffle = require("shuffle-array")
const { getEmoji } = require("../../../../config")

module.exports = async (message, client) => {
    const players = db.get(`players`)
    const dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")

    setTimeout(async () => {
        const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive")
        if (alivePlayers.length <= 1) return

        shuffle(alivePlayers)

        let randomPlayer1 = db.get(`player_${alivePlayers[0]}`)
        let randomPlayer2 = db.get(`player_${alivePlayers[1]}`)
        db.set(`player_${randomPlayer1.id}.muted`, true)
        db.set(`player_${randomPlayer2.id}.muted`, true)
        await dayChat.send(`❄️ The blizzard froze player **${players.indexOf(randomPlayer1.id) + 1} ${randomPlayer1.username}** and **${players.indexOf(randomPlayer2.id) + 1} ${randomPlayer2.username}**!`)
    }, 25000)
}
