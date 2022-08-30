const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "nightmare",
    description: "Nightmare a player and prevent them from doing any actions the following night.",
    usage: `${process.env.PREFIX}nightmare <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to mute players.")
        if (!["Nightmare Werewolf", "Vodoo Werewolf"].includes(player.role) && !["Nightmare Werewolf", "Vodoo Werewolf"].includes(player.dreamRole)) return
        if (["Nightmare Werewolf", "Vodoo Werewolf"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 == 0) return await message.channel.send("You do know that you can only nightmare during the day right? Or are you delusional?")
        if ((player.role === "Voodoo Werewolf" ? player.usesN : player.uses) === 0) return await message.channel.send("You already used up your ability!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("nightmare", client)} Your action has been canceled!`)
            return
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot nightmare the President!")

        if (!player.hypnotized) {
            let cupid = db.get(`player_${player.id}`).cupid

            if (db.get(`player_${cupid}`)?.target.includes(target)) return await message.channel.send("You cannot nightmare your own couple!")

            if (player.id === target) return await message.channel.send("You do know that you cannot nightmare yourself right?")

            if (players.filter((p) => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan").includes(target)) return await message.channel.send("You cannot mute your own werewolf teammate!")
        }

        db.set(`player_${player.id}.target`, target)
        await message.channel.send(`${getEmoji("nightmare", client)} You have decided to nightmare **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)
    },
}
