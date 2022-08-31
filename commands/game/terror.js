const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "terror",
    description: "Terrorize a player so they can no longer vote",
    usage: `${process.env.PREFIX}terror <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to hunt players.")
        if (!["Prognosticator"].includes(player.role) && !["Prognosticator"].includes(player.dreamRole)) return
        if (["Prognosticator"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 == 0) return await message.channel.send("You do know that you can only terrorize players during the day right? Or are you delusional?")
        if (!player.usesT) return await message.channel.send("You already used up your ability!")
        if (args.length !== 1) return await message.channel.send("You need to select a player to terrorize!")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot terrorize the President!")

        if (db.get(`player_${target}`).terror === true) return await message.channel.send("That player is already terrorized! Select another player.")

        if (!player.hypnotized) {

            let { cupid, instigator } = db.get(`player_${player.id}`)

            if (cupid?.map(a => db.get(`player_${a}`))?.map(a => a.target)?.join(",").split(",").includes(target)) return await message.channel.send("You cannot terrorize your own couple!")
            if (instigator?.map(a => db.get(`player_${a}`))?.map(a => a.target)?.join(",").split(",").includes(target)) return await message.channel.send("You cannot terrorize your fellow recruit!")
            if (instigator?.includes(target)) return await message.channel.send("You cannot terrorize the Instigator who recruited you!")

            if (player.id === target) return await message.channel.send("You do know that you cannot terrorize yourself right?")
        }

        db.subtract(`player_${player.id}.usesT`, 1)
        db.set(`player_${target}.terror`, true)
        db.set(`player_${target}.terrorAt`, Math.floor(gamePhase / 3) + 2)
        await message.channel.send(`${getEmoji("terror", client)} You have succesfully activated your ability!`)
        await daychat.send(`${getEmoji("terror", client)} Player **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}** is now terrorized! They can no longer vote starting tomorrow`)
    },
}
