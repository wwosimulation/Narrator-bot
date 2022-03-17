const shuffle = require("shuffle-array")
const Discord = require("discord.js")
const db = require("quick.db")
const pull = require("array-pull")
const { getRole, fn } = require("../../config")
const { join } = require("../../config/src/cmi")

module.exports = {
    name: "movedtoslash",
    description: "Commands with aliases here have been moved to slash commands.",
    usage: `${process.env.PREFIX}movedtoslash`,
    aliases: ["srole", "player"],
    run: async (message, args, client) => {
        return message.channel.send("This command has moved to slash commands!")
    },
}
