const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "frenzy",
    description: "Activate frenzy to be berserk.",
    usage: `${process.env.PREFIX}frenzy`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to activate frenzy.")
        if (!["Werewolf Berserk"].includes(player.role) && !["Werewolf Berserk"].includes(player.dreamRole)) return
        if (["Werewolf Berserk"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 == 0) return await message.channel.send("You do know that you can only activate frenzy during the day right? Or are you delusional?")
        if (player.uses === 0) return await message.channel.send("You already used up your ability!")
        if (db.get(`isBerserkActive`) === true) return await message.channel.send("Someone else already activated frenzy for tonight!")

        db.set(`isBerserkActive`, true)
        await message.channel.send(`${getEmoji("frenzy", client)} You have activated frenzy for tonight!`)
        await wwchat.send(`${getEmoji("frenzy", client)} The Werewolf Berserk has activated frenzy for tonight!`)
    },
}
