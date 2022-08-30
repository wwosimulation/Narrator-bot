const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "douse",
    description: "Douse up to 2 players that can be ignited later on.",
    usage: `${process.env.PREFIX}douse <player1> [<player2>]`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to douse players.")
        if (!["Arsonist"].includes(player.role) && !["Arsonist"].includes(player.dreamRole)) return
        if (["Arsonist"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only douse during the night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot douse anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")

        if (args[0] === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${getEmoji("douse", client)} Your actions have been canceled!`)
        }

        let target1 = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])
        let target2 = players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1])

        if (!target1) return await message.channel.send(`I could not find a player with the query: \`${args[0]}\``)
        if (args.length === 2 && !target2) return await message.channel.send(`I could not find a player with the query: \`${args[1]}\``)

        if (db.get(`player_${target1}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to douse!")

        if (db.get(`player_${target1}`)?.role === "President") return await message.channel.send("You cannot douse the President!")

        if (db.get(`player_${target2}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to dous!")

        if (db.get(`player_${target2}`)?.role === "President") return await message.channel.send("You cannot douse the President!")

        if (!player.hypnotized) {
            if ([target1, target2].includes(player.id)) return await message.channel.send("You cannot douse yourself!")

            let cupid = db.get(`player_${player.id}`).cupid

            if ([target1, target2].includes(db.get(`player_${cupid}`)?.target.find((a) => a !== player.id))) return await message.channel.send("You cannot douse your own couple!")
        }

        if (!target2) {
            db.set(`player_${player.id}.target`, [target1])
            await message.channel.send(`${getEmoji("douse", client)} You have decided to douse **${players.indexOf(target1) + 1} ${db.get(`player_${target1}`).username}**!`)
        } else {
            db.set(`player_${player.id}.target`, [target1, target2])
            await message.channel.send(`${getEmoji("douse", client)} You have decided to douse **${players.indexOf(target1) + 1} ${db.get(`player_${target1}`).username}** and **${players.indexOf(target2) + 1} ${db.get(`player_${target2}`).username}**!`)
        }
    },
}
