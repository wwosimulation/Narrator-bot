const db = require("quick.db")
const { soloKillers, roles, getRole, getEmoji, fn, ids } = require("../../config")
const shuffle = require("shuffle-array")
const emojis = ["🍬", "🍭", "🍫"]

module.exports = {
    name: "bucket",
    description: "Send a bucket to someone to ask for some candy.",
    usage: `${process.env.PREFIX}bucket <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (!["Pumpkin King"].includes(player.role) && !["Pumpkin King"].includes(player.dreamRole)) return
        if (["Pumpkin King"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used up your ability!")
        if (args.length !== 1) return await message.channel.send("Please select a player first.")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status === "Alive") return await message.channel.send("You need to select a dead player to give the bucket!")

        db.set(`player_${player.id}.uses`, 0)

        let droppy = { type: 3, custom_id: "pumpkinking", options: [] }
        droppy.options.push({ label: `Return`, value: `${player.id}-return`, description: `Return the bucket`, emoji: { name: "🎃" } })

        let deadPlayers = players.filter((p) => db.get(`player_${p}`).status === "Dead").map((p) => db.get(`player_${p}`))
        deadPlayers.forEach((p) => {
            shuffle(emojis)
            droppy.options.push({ label: `${players.indexOf(p.id) + 1}`, value: `${player.id}-pass:${p.id}`, description: `Pass the bucket to ${players.indexOf(p.id) + 1} ${p.username}`, emoji: { name: emojis[0] } })
        })

        let row = { type: 1, components: [droppy] }
        let chan = message.guild.channels.cache.get(db.get(`player_${target}`).channel)

        await chan.send(`${message.guild.roles.cache.find((r) => r.name === "Alive")}`)
        await chan.send({ content: `${getEmoji("pumpkinking", client)} You have been passed the candy bucket from the Pumpkin King!\nYou may either choose to pass the bucket to another player or return it to the Pumpkin King!`, components: [row] })

        db.set(`player_${player.id}.pk`, [message.author.id])
    },
}
