const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "hack",
    description: "Hack a player to either see their role, or hack them to death.",
    usage: `${process.env.PREFIX}hack <player> <player2>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to mute players.")
        if (!["Hacker"].includes(player.role) && !["Hacker"].includes(player.dreamRole)) return
        if (["Hacker"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only hack during the night right? Or are you delusional?")
        if (player.uses === 0) return await message.channel.send("You have already used your ability for tonight!")
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot hack anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (args.length !== 2) return await message.channel.send("You need to select 2 players to hack!")

        let target1 = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])
        let target2 = players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1])

        if (!target1) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)
        if (!target2) return await message.channel.send(`I could not find the player with the query: \`${args[1]}\`!`)

        if (db.get(`player_${target1}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")
        if (db.get(`player_${target2}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target1}`).role === "President") return await message.channel.send("You cannot mute the President!")
        if (db.get(`player_${target2}`).role === "President") return await message.channel.send("You cannot mute the President!")

        if (target1 === target2) return await message.channel.send("Why are you hacking the same player?")

        if (!player.hypnotized) {
            if ([target1, target2].includes(db.get(`player_${player.id}`).couple)) return await message.channel.send("You cannot mute your own couple!")

            if ([target1, target2].includes(player.id)) return await message.channel.send("You do know that you cannot mute yourself right?")
        }

        let { role: role1, username: username1 } = db.get(`player_${target1}`)
        let { role: role2, username: username2 } = db.get(`player_${target2}`)

        db.set(`player_${player.id}.target`, [target1, target2])

        if (!player.hackedPlayers?.includes(target1)) {
            await message.channel.send(`${getEmoji("hack", client)} You have hacked player **${players.indexOf(target1) + 1} ${username1} (${getEmoji(role1.toLowerCase().replace(/\s/g, "_"), client)} ${role1})**`)
        } else {
            await message.channel.send(`${getEmoji("hack", client)} Player **${players.indexOf(target1) + 1} ${username1} (${getEmoji(role1.toLowerCase().replace(/\s/g, "_"), client)} ${role1})** has been hacked before, and will die today!`)
        }

        if (!player.hackedPlayers?.includes(target2)) {
            await message.channel.send(`${getEmoji("hack", client)} You have hacked player **${players.indexOf(target2) + 1} ${username2} (${getEmoji(role2.toLowerCase().replace(/\s/g, "_"), client)} ${role2})**`)
        } else {
            await message.channel.send(`${getEmoji("hack", client)} Player **${players.indexOf(target2) + 1} ${username2} (${getEmoji(role2.toLowerCase().replace(/\s/g, "_"), client)} ${role2})** has been hacked before, and will die today!`)
        }

        db.subtract(`player_${player.id}.uses`, 1)
    },
}
