const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "couple",
    description: "Couple two players to be in love.",
    usage: `${process.env.PREFIX}couple <player1> [<player2>]`,
    aliases: ["love"],
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to couple players.")
        if (!["Cupid"].includes(player.role) && !["Cupid"].includes(player.dreamRole)) return;
        if (["Cupid"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0 || Math.floor(gamePhase / 3) + 1 !== 1) return await message.channel.send("You do know that you can only couple during the first night right? Or are you delusional?")

        if (args[0] === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${getEmoji("couple", client)} Your actions have been canceled!`)
        }
        
        let target1 = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])
        let target2 = players[Number(args[1])-1] || players.find(p => p === args[1]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[1])

        if (!target1) return await message.channel.send(`I could not find a player with the query: \`${args[0]}\``)
        if (args.length === 2 && !target2) return await message.channel.send(`I could not find a player with the query: \`${args[1]}\``)


        if (db.get(`player_${target1}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to couple!")

        if (db.get(`player_${target1}`)?.role === "President") return await message.channel.send("You cannot couple the President!")

        if (db.get(`player_${target2}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to couple!")

        if (db.get(`player_${target2}`)?.role === "President") return await message.channel.send("You cannot couple the President!")

        if ([target1, target2].includes(player.id)) return await message.channel.send("You cannot couple yourself!")


        if (!target2) {
            db.set(`player_${player.id}.target`, [target1])
            await message.channel.send(`${getEmoji("couple", client)} You have decided to couple **${players.indexOf(target1)+1} ${db.get(`player_${target1}`).username}**!`)
        } else {

	    if (target1 === target2) return await message.channel.send("Seems a little weird that you want to couple the same player don't you think?")

            db.set(`player_${player.id}.target`, [target1, target2])
            await message.channel.send(`${getEmoji("couple", client)} You have decided to couple **${players.indexOf(target1)+1} ${db.get(`player_${target1}`).username}** with **${players.indexOf(target2)+1} ${db.get(`player_${target2}`).username}**!`)
        }
        

    }
}
