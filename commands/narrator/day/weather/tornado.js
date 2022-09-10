const db = require("quick.db")
const shuffle = require("shuffle-array")

module.exports = async (message, client) => {
    const players = db.get(`players`)
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive")

    if (alivePlayers.length <= 1) return

    let coppiedPlayers = []

    shuffle(alivePlayers)
    let playerCount = 0
    for (const x of players) {
        if (!alivePlayers.includes(x)) {
            coppiedPlayers.push(x)
            continue
        }
        coppiedPlayers.push(alivePlayers[playerCount])
        playerCount++
    }

    db.set(`players`, coppiedPlayers)

    alivePlayers.forEach(async (p, i) => {
        let member = await message.guild.members.fetch(p).catch((e) => {
            return {}
        })
        if (!member.nickname) return
        if (member.nickname.split(" | ")[0] == i + 1) return
        await member.setNickname(`${i + 1}${member.nickname.includes(" | ") ? ` | ${member.nickname.split(" | ")[1]}` : ""}`)
    })
}
