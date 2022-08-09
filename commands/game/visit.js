const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "visit",
    description: "Visit a player.",
    usage: `${process.env.PREFIX}visit <player>`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to visit players.")
        if (!["Red Lady"].includes(player.role) && !["Red Lady"].includes(player.dreamRole)) return;
        if (["Red Lady"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only visit during the night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase/3)+1) return await message.channel.send("This is a peaceful night! You cannot visit anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (args.length !== 1) return await message.channel.send("You need to select a player to visit!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("visit", client)} Your action has been canceled!`)
            return;
        }

        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (!player.hypnotized) {

            if (db.get(`player_${player.id}`).couple === target && ( db.get(`player_${target}`).team !== "Village" && !["Fool", "Headhunter", "Sect Leader", "Zombie"].includes(player.role)))  return await message.channel.send("You cannot visit your own couple if they are known to be evil!")

            if (player.id === target) return await message.channel.send("You do know that you cannot visit yourself right?")

        }

        db.set(`player_${player.id}.target`, target)
        await message.channel.send(`${getEmoji("visit", client)} You have decided to visit **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**!`)
        

    },
}
