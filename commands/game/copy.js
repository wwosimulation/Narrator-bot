const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "copy",
    description: "As a doppelganger, you can select a player to be converted as when they die.",
    usage: `${process.env.PREFIX}copy <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to copy players.")
        if (!["Doppelganger"].includes(player.role) && !["Doppelganger"].includes(player.dreamRole)) return
        if (["Doppelganger"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0 || Math.floor(gamePhase / 3) + 1 !== 1) return await message.channel.send("You do know that you can only copy during the first night right? Or are you delusional?")

        if (args[0] === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${getEmoji("copy", client)} Your actions have been canceled!`)
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to copy!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot select to be the President!")

        if (player.id === target) return await message.channel.send("You cannot copy yourself!")

        db.set(`player_${player.id}.target`, target)
    },
}
