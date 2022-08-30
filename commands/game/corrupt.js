const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "corrupt",
    description: "Corrupt players as the Corruptor.",
    usage: `${process.env.PREFIX}corrupt <player>`,
    aliases: ["glitch"],
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to corrupt players.")
        if (!["Corruptor"].includes(player.role) && !["Corruptor"].includes(player.dreamRole)) return
        if (["Corruptor"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only corrupt during the night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot corrupt anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")

        if (args[0] === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${getEmoji("corrupt", client)} Your actions have been canceled!`)
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to corrupt!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot corrupt the President!")

        if (!player.hypnotized) {
            if (player.id === target) return await message.channel.send("You cannot corrupt yourself!")

            let cupid = db.get(`player_${player.id}`).cupid

            if (db.get(`player_${cupid}`)?.target.includes(target)) return await message.channel.send("You cannot corrupt your own couple!")
        }

        await message.channel.send(`${getEmoji("corrupt", client)} You have decided to corrupt **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)

        db.set(`player_${player.id}.target`, target)
    },
}
