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
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to jail players.")
        if (!["Jailer", "Warden"].includes(player.role) && !["Jailer", "Warden"].includes(player.dreamRole)) return
        if (["Jailer", "Warden"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 == 0) return await message.channel.send("You do know that you can only jail during the day right? Or are you delusional?")
        if (player.role === "Jailer" && args.length !== 1) return await message.channel.send("You need to select a player to jail!")
        if (player.role === "Warden" && args.length !== 2) return await message.channel.send("You need to select 2 players to jail!")

        const emotes = {
            Jailer: getEmoji("jailerselect", client),
            Warden: getEmoji("warden_jail", client),
        }

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${emotes[player.role]} Your action has been canceled!`)
            return
        }

        let target = [players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])]

        if (player.role === "Warden") target.push(players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1]))

        if (!target[0]) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)
        if (player.role === "Warden" && !target[1]) return await message.channel.send(`I could not find the player with the query: \`${args[1]}\`!`)

        if (target.map((p) => db.get(`player_${p}`).status).includes("Dead")) return await message.channel.send("You need to select an ALIVE player!")

        if (target.map((p) => db.get(`player_${p}`).role).includes("President")) return await message.channel.send("You cannot jail the President!")

        if (target.includes(player.id)) return await message.channel.send("You do know that you cannot jail yourself right?")

        if (player.role === "Jailer") {
            db.set(`player_${player.id}.target`, target[0])
            await message.channel.send(`${getEmoji("jailerselect", client)} You have decided to jail **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username}**!`)
        } else {
            db.set(`player_${player.id}.target`, target)
            await message.channel.send(`${getEmoji("warden_jail", client)} You have decided to jail **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username}** and **${players.indexOf(target[1]) + 1} ${db.get(`player_${target[1]}`).username}**!`)
        }
    },
}
