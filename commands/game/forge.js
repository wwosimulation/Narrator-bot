const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "forge",
    description: "Forge a sheild or a sword.",
    usage: `${process.env.PREFIX}forge`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to forge players.")
        if (!["Forger"].includes(player.role) && !["Forger"].includes(player.dreamRole)) return;
        if (["Forger"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only forge during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used up your abilities!")
        if (player.lastForged >= Math.floor(gamePhase/3) + 2) return await message.channel.send("You just forged an item! You need to give the item before you can forge another item!")
        if (player.uses !== (3 - (player.givenItems || 0))) return await message.channel.send("You need to give an item before you can forge the item!")

        const itemType = player.uses === 1 ? "sword" : "shield"

        const emojis = {
            sword: getEmoji(`forgesword`, client),
            shield: getEmoji(`forgeshield`, client)
        }

        db.set(`player_${player.id}.itemType`, itemType)
        db.set(`player_${player.id}.forgedAt`, Math.floor(gamePhase/3)+1)
        
        await message.channel.send(`${getEmoji(emojis[itemType], client)} You have decided to forge a **${itemType}**!`)
        

    },
}
