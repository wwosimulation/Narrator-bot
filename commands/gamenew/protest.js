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
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to protect players.")
        if (!["Flower Child", "Guardian Wolf"].includes(player.role) && !["Flower Child", "Guardian Wolf"].includes(player.dreamRole)) return;
        if (["Flower Child", "Guardian Wolf"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 == 0) return await message.channel.send("You do know that you can only protest during the day right? Or are you delusional?")
        
        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${object[player.role]} Done! That player is no longer under your protest!`)
        }
        
        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to protest for!")

        db.set(`player_${player.id}.target`, target)

        message.channel.send(`${getEmoji(`${player.role === "Flower Child" ? "fc" : "gww"}protest`, client)} You have decided to protest for **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**`)

    }
}
