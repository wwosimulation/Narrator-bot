const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "activate",
    description: "Activate your ability.",
    usage: `${process.env.PREFIX}activate (cancel)`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to activate peace.")
        if (!["Trapper"].includes(player.role) && !["Trapper"].includes(player.dreamRole)) return
        if (["Trapper"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You can only activate your ability during the night.")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.role === "Trapper" && player.traps.length === 0) return await message.channel.send("Activating your traps is not possible if you don't have any traps.")

        db.set(`player_${player.id}.active`, true)
        await message.channel.send(`${getEmoji("active", client)} You have activated your ability! All traps are now active.`)
    },
}
