const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "shadow",
    description: "Activate the shadow ability to hide votes",
    usage: `${process.env.PREFIX}shadow`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const daychat = message.guild.channels.cache.find(c => c.name === "day-chat")
        const votechat = message.guild.channels.cache.find(c => c.name === "vote-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to activate shadow.")
        if (!["Shadow Wolf"].includes(player.role) && !["Shadow Wolf"].includes(player.dreamRole)) return;
        if (["Shadow Wolf"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0) return await message.channel.send("You do know that you can activate shadow during the da right? Or are you delusional?")
        if (player.uses === 0) return await message.channel.send("You already used up your ability!")
        if (db.get(`game.isShadow`)) return await message.channel.send("Someone else already activated their ability! You can use your ability another day.")

        db.subtract(`player_${player.id}.uses`, 1)
        db.set(`game.isShadow`, true)

        await message.channel.send(`${getEmoji("shadowuse", client)} You have succesfully activated your ability! All wolves get an extra vote.`)
        await daychat.send(`${getEmoji("shadow", client)} The Shadow Wolf manipulated today's voting!`)


        // delete all current vote messages
        let allMessages = await votechat.messages.fetch()
        let voteMessages = allMessages.filter(msg => !msg.pinned && !msg.components)
        await votechat.bulkDelete(voteMessages)
        

    },
}
