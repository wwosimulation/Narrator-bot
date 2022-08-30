const db = require("quick.db")
const { MessageButton, MessageActionRow } = require("discord.js")

const { getEmoji, getRole, fn, ids } = require("../../config")

module.exports = {
    name: "night",
    description: "Night 👀.",
    usage: `${process.env.PREFIX}night <player | 0>`,
    gameOnly: true,
    run: async (message, args, client) => {
        let gamephase = db.get(`gamePhase`)
        if (gamephase % 3 != 2) return message.channel.send("Please first use `+vt`")
        require("./night/night.js").run(message, args, client)
    },
}
