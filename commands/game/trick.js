const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "trick",
    description: "Select a player to trick to make them be seen as wolf trickster when you die.",
    usage: `${process.env.PREFIX}trick <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to trick players.")
        if (!["Wolf Trickster"].includes(player.role) && !["Wolf Trickster"].includes(player.dreamRole)) return
        if (["Wolf Trickster"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0) return await message.channel.send("You do know that you can only trick during the day right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used your ability!")
        if (args.length !== 1) return await message.channel.send("You need to select a player to trick!")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot trick the President!")

        if (player.id === target) return await message.channel.send("You do know that you cannot trick yourself right?")

        if (db.get(`player_${target}`).team === "Werewolf" && db.get(`player_${target}`).role !== "Werewolf Fan") return await message.channel.send("You can't trick your own werewolf teammate!")

        db.set(`player_${player.id}.target`, target)
        db.set(`player_${target}.tricked`, true)

        await message.channel.send(`${getEmoji("wolf_trickster_swap", client)} You have decided to trick **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)
    },
}
