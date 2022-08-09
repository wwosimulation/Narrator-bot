const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "revive",
    description: "Revive a player from the dead",
    usage: `${process.env.PREFIX}revive <player>`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to revive players.")
        if (!["Medium"].includes(player.role) && !["Medium"].includes(player.dreamRole)) return;
        if (["Medium"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only revive during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used your ability!")
        if (args.length !== 1) return await message.channel.send("You need to select a player to revive!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("revive", client)} Your action has been canceled!`)
            return;
        }

        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status === "Alive") return await message.channel.send("You need to select a DEAD player!")

        if (db.get(`player_${target}`).team !== "Village") return await message.channel.send("You can only revive players that belong to the Village team!")

        if (db.get(`player_${target}`).corrupted) return await message.channel.send("You cannot revive corrupted players!")

        db.set(`player_${player.id}.target`, target)
        await message.channel.send(`${getEmoji("revive", client)} You have decided to revive **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**!`)
        

    },
}
