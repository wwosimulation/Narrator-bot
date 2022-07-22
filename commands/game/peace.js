const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "peace",
    description: "Activate a peaceful night where no kills can happen.",
    usage: `${process.env.PREFIX}peace`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const daychat = message.guild.channels.cache.find(c => c.name === "day-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to activate peace.")
        if (!["Prognosticator"].includes(player.role) && !["Prognosticator"].includes(player.dreamRole)) return;
        if (["Prognosticator"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0 || Math.floor(gamePhase/3) + 1 === 1) return await message.channel.send("You do know that you can only activate peace after the first night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You have already used up your ability!")

        db.subtract(`player_${player.id}.uses`, 1)
        db.set(`game.peace`, Math.floor(gamePhase/3)+2)
        await message.channel.send(`${getEmoji("peace", client)} You have activated your ability! The effect of this ability will take place the next night.`)
        await daychat.send(`${getEmoji("peace", client)} Peace be upon you dear villagers. No one can die next night!\n\n${message.guild.roles.cache.find(r => r.name === "Alive")}`)
        

    },
}
