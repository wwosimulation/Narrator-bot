const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "jail",
    description: "Select a player to jail",
    usage: `${process.env.PREFIX}jail <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to jail players.")
        if (!["Jailer"].includes(player.role) && !["Jailer"].includes(player.dreamRole)) return
        if (["Jailer"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 == 0) return await message.channel.send("You do know that you can only jail during the day right? Or are you delusional?")
        if (args.length !== 1) return await message.channel.send("You need to select a player to jail!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("jailerselect", client)} Your action has been canceled!`)
            return
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot jail the President!")

        if (player.id === target) return await message.channel.send("You do know that you cannot jail yourself right?")

        db.set(`player_${player.id}.target`, target)
        await message.channel.send(`${getEmoji("jailerselect", client)} You have decided to jail **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)
    },
}
