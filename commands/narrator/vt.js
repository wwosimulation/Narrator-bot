const db = require("quick.db")
const ms = require("ms")
const { fn, getEmoji } = require("../../config")

module.exports = {
    name: "vt",
    description: "Start the voting time.",
    usage: `${process.env.PREFIX}vt [time...]`,
    narratorOnly: true,
    gameOnly: true,
    run: async (message, args, client) => {
        let gamephase = db.get(`gamePhase`)
        if (gamephase % 3 != 1) return message.channel.send("Please first use `+vt`")
        require("./voting/vote.js").run(message, args, client)
    },
}
