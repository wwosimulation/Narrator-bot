const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "stab",
    description: "Stab your knife into a living player's body.",
    usage: `${process.env.PREFIX}stab <player>`,
    aliases: ["murder"],
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to shoot players.")
        if (!["Bandit", "Accomplice", "Serial Killer"].includes(player.role) && !["Bandit", "Accomplice", "Serial Killer"].includes(player.dreamRole)) return;
        if (["Bandit", "Accomplice", "Serial Killer"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 !== 0 ) return await message.channel.send("You do know that you can only stab during the night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase/3)+1) return await message.channel.send("This is a peaceful night! You cannot stab anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        
        if (player.role === "Bandit" && player.accomplices.filter(p => db.get(`player_${p}`).status === "Alive").length === 0) return await message.channel.send("You do know that you need an accomplice to stab?")

        let emotes = {
            "Serial Killer": `${getEmoji("serial_killer_knife", client)} You have decided to stab`,
            "Bandit": `${getEmoji("thieve", client)} **${players.indexOf(player.id)+1} ${player.username}** voted to stab`,
            "Accomplice": `${getEmoji("votebandit", client)} **${players.indexOf(player.id)+1} ${player.username}** voted to stab`
        }

        if (args[0] === "cancel") {
            db.delete(`player_${player.id}.target`)    
            return await message.channel.send(`${emotes[player.role].split(" ")[0]} Your actions have been canceled!`)
        }

        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player to stab.")

        db.set(`player_${player.id}.target`, target)

        let channel = message.guild.channels.cache.get(player.banditChannel) || message.channel

        await channel.send(`${emotes[player.role]} **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**`)
        
    }
}
