const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "hunt",
    description: "Hunt a player if they belong to the sect.",
    usage: `${process.env.PREFIX}hunt <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to hunt players.")
        if (!["Sect Hunter"].includes(player.role) && !["Sect Hunter"].includes(player.dreamRole)) return
        if (["Sect Hunter"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only hunt during the night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot hunt anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (args.length !== 1) return await message.channel.send("You need to select a player to hunt!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("sect_hunter", client)} Your action has been canceled!`)
            return
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot hunt the President!")

        if (!player.hypnotized) {
            let cupid = db.get(`player_${player.id}`).cupid
            if (db.get(`player_${cupid}`)?.target.includes(target)) return await message.channel.send("You cannot hunt your own couple!")

            if (player.id === target) return await message.channel.send("You do know that you cannot hunt yourself right?")
        }

        db.set(`player_${player.id}.target`, target)
        await message.channel.send(`${getEmoji("sect_hunter", client)} You have decided to hunt **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)
    },
}
