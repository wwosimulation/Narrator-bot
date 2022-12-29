const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "doom",
    description: "Select a player to doom.",
    usage: `${process.env.PREFIX}doom <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to doom players.")
        if (!["Harbinger"].includes(player.role) && !["Harbinger"].includes(player.dreamRole)) return
        if (["Harbinger"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only doom players during the night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot doom anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.target && player.abilityType === "herald") return await message.channel.send("You have selected someone to check! Please cancel that action using `+check cancel` and run this command again!")
        if (args.length !== 1) return await message.channel.send("You need to select a player to doom!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("sect_hunter", client)} Your action has been canceled!`)
            return
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (!player.hypnotized) {
            let { cupid, instigator } = db.get(`player_${player.id}`)

            if (
                cupid
                    ?.map((a) => db.get(`player_${a}`))
                    ?.map((a) => a.target)
                    ?.join(",")
                    .split(",")
                    .includes(target)
            )
                return await message.channel.send("You cannot doom your own couple!")
            if (
                instigator
                    ?.map((a) => db.get(`player_${a}`))
                    ?.map((a) => a.target)
                    ?.join(",")
                    .split(",")
                    .includes(target)
            )
                return await message.channel.send("You cannot doom your fellow recruit!")
            if (instigator?.includes(target)) return await message.channel.send("You cannot doom the Instigator who recruited you!")

            if (player.id === target) return await message.channel.send("You do know that you cannot doom yourself right?")
        }

        db.set(`player_${player.id}.target`, target)
        db.set(`player_${player.id}.abilityType`, "doom")
        await message.channel.send(`${getEmoji("harbinger", client)} You have decided to doom **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)
    },
}
