const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "trickortreat",
    description: "Select 2 people that will have to choose between trick or treat during the night and select which option will kill them",
    usage: `${process.env.PREFIX}trickortreat <player1> <player2>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to trick or treat players.")
        if (!["Jack"].includes(player.role) && !["Jack"].includes(player.dreamRole)) return
        if (["Jack"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0) return await message.channel.send("You do know that you can only trick or treat during the day right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")

        if (args[0]?.toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            db.delete(`player_${player.id}.killOption`)
            await message.channel.send(`${getEmoji("jack", client)} Your action has been canceled!`)
            return
        }

        if (args.length !== 3) return await message.channel.send("You need to select two players to trick or treat with, and an option that will kill them!")

        let target1 = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])
        let target2 = players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1])

        if (!target1) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)
        if (!target2) return await message.channel.send(`I could not find the player with the query: \`${args[1]}\`!`)

        if (db.get(`player_${target1}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")
        if (db.get(`player_${target2}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target1}`).role === "President") return await message.channel.send("You cannot trick or treat the President!")
        if (db.get(`player_${target2}`).role === "President") return await message.channel.send("You cannot trick or treat the President!")

        if (target1 === target2) return await message.channel.send("Why are you selecting the same player? Please select different players!")

        if (!player.hypnotized) {
            let cupid = db.get(`player_${player.id}`).cupid
            if ([target1, target2].includes(db.get(`player_${cupid}`)?.target.find((a) => a !== player.id))) return await message.channel.send("You cannot trick or treat your own couple!")

            if ([target1, target2].includes(player.id)) return await message.channel.send("You do know that you cannot trick or treat yourself right?")
        }

        if (!["trick", "treat"].includes(args[2].toLowerCase())) return await message.channel.send(`Excuse me, \`${args[2]}\` is not a valid option! Please either choose \`trick\` or \`treat\`!`)

        db.set(`player_${player.id}.target`, [target1, target2])
        db.set(`player_${player.id}.killOption`, args[2].toLowerCase())
        await message.channel.send(`${getEmoji(`${args[2].toLowerCase()}_kill`, client)} You have decided to trick or treat **${players.indexOf(target1) + 1} ${db.get(`player_${target1}`).username}** and **${players.indexOf(target2) + 1} ${db.get(`player_${target2}`).username}**! They will be punished if they choose \`${args[2]}\`!`)
    },
}
