const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "switch",
    description: "Switch two players so that their roles are changed!",
    usage: `${process.env.PREFIX}switch <player> <player2>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to switch players.")
        if (!["Naughty Boy"].includes(player.role) && !["Naughty Boy"].includes(player.dreamRole)) return
        if (["Naughty Boy"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only switch during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used your ability!")
        if (args.length !== 2) return await message.channel.send("You need to select two player to switch!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("switch", client)} Your action has been canceled!`)
            return
        }

        let target1 = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])
        let target2 = players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1])

        if (!target1) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)
        if (!target2) return await message.channel.send(`I could not find the player with the query: \`${args[1]}\`!`)

        if (db.get(`player_${target1}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")
        if (db.get(`player_${target2}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target1}`).role === "President") return await message.channel.send("You cannot switch the President!")
        if (db.get(`player_${target2}`).role === "President") return await message.channel.send("You cannot switch the President!")

        if (!player.hypnotized) {
            if ([target1, target2].includes(player.id)) return await message.channel.send("You do know that you cannot switch yourself right?")
        }

        db.set(`player_${player.id}.target`, [target1, target2])
        await message.channel.send(`${getEmoji("switch", client)} You have decided to switch **${players.indexOf(target1) + 1} ${db.get(`player_${target1}`).username}** with **${players.indexOf(target2) + 1} ${db.get(`player_${target2}`).username}**!`)
    },
}
