const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "protect",
    description: "Protect a player from being attacked. This command applies for doctor, bodyguard, witch, tough guy and ghost lady",
    usage: `${process.env.PREFIX}protect <player>`,
    aliases: ["heal", "save"],
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || [{ status: "Dead" }]

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await send("Listen to me, you need to be ALIVE to protect players.")
        if (!["Doctor", "Bodyguard", "Tough Guy", "Witch", "Ghost Lady"].includes(player.role) && !["Doctor", "Bodyguard", "Tough Guy", "Witch", "Ghost Lady"].includes(player.dreamRole)) return;
        if (["Doctor", "Bodyguard", "Tough Guy", "Witch", "Ghost Lady"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only protect during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")

        let object = {
            "Doctor": getEmoji("heal", client),
            "Tough Guy": getEmoji("guard", client),
            "Bodyguard": getEmoji("guard", client),
            "Witch": getEmoji("potion", client),
            "Ghost Lady": getEmoji("gl_protection", client)
        }

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${object[player.role]} Done! That player is no longer protected!`)
        }
        
        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to convert!")

        if (!player.hypnotized && target === player.id) return await message.channel.send("You can't protect yourself. Why are you being selfish?")

        db.set(`player_${player.id}.target`, target)

        message.channel.send(`${object[player.role]} You have decided to protect **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**`)

    }
}
