const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "convert",
    description: "Convert a player to your team.",
    usage: `${process.env.PREFIX}convert <player>`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to convert players.")
        if (!["Zombie", "Sect Leader", "Bandit"].includes(player.role) && !["Zombie", "Sect Leader", "Bandit"].includes(player.dreamRole)) return;
        if (["Zombie", "Sect Leader", "Bandit"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only convert during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.role === "Bandit" && player.accomplices?.map(a => db.get(`player_${a}`).status).includes("Alive")) return await message.channel.send("As a Bandit, you cannot convert players to become your accomplice if you already have one.")
        if (player.role === "Sect Leader" && player.sectMembers?.map(c => db.get(`player_${c}`).status).filter(c => c === "Alive").length === 4) return await message.channel.send("As a Sect Leader, you may not have more than 4 sect members at a time!")

        if (args[0] === "cancel") {
            player.role === "Bandit" ? db.delete(`player_${player.id}.accomplice`) : db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${getEmoji(player.role === "Bandit" ? "kidnap" : "sect_member", client)} Your actions have been canceled!`)
        }
        
        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to convert!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot convert the President!")

        if (player.role === "Zombie") {
            if (db.get(`player_${target}`).bitten === true && !player.hypnotized) return await message.channel.send("Hallo sis, you cannot just bite your bitten zombies like dat.")
            message.guild.channels.cache.find(c => c.name === "zombies")?.send(`${getEmoji("zombvote", client)} **${players.indexOf(player.id)+1} ${player.username}** selected to bite **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**.`)
        } else {
            message.channel.send(`${getEmoji(player.role === "Bandit" ? "kidnap" : "sect_member", client)} You have decided to convert **${players.indexOf(target)+1} ${db.get(`players_${target}`).username}** into your ${player.role === "Bandit" ? "accomplice" : "sect"}.`)
        }

        player.role === "Bandit" ? db.set(`player_${player.id}.accomplice`, target) : db.set(`player_${player.id}.target`, target)

    }
}
