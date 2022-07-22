
const config = require("../../config")

module.exports = {
    name: "resign",
    description: "Resign from using your ability!",
    usage: `${process.env.PREFIX}resign`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to resign.")
        if (!["Wolf Seer"].includes(player.role) && !["Wolf Seer"].includes(player.dreamRole)) return;
        if (["Wolf Seer"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.resign === true) return await message.channel.send("You already resigned from checking, so what actually are you trying to resign from?")
        
        db.set(`player_${player.id}.resign`, true)
        await message.channel.send(`${getEmoji("wolf_seer", client)} You have decided to resign from checking!`)
        await wwchat.send(`${getEmoji("wolf_seer", client)} **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("wolf_seer", client)} ${player.role})** has resigned from checking! They are now able to vote with you.`)
        

    },
}
