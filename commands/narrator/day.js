const db = require("quick.db")
const shuffle = require("shuffle-array")
const { getRole, getEmoji } = require("../../config")

module.exports = {
    name: "day",
    description: "Day! :D",
    usage: `${process.env.PREFIX}day [wolf_kill]`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let gamephase = db.get(`gamePhase`)
        if (gamephase % 3 != 0) return message.channel.send("Please first use `+night`")
        require("./day/day.js").run(message, args, client)
    },
}
