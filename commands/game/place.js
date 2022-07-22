const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "place",
    aliases: ["trap", "mark"],
    description: "Place your trap or mark on a player.",
    usage: `${process.env.PREFIX}place <player>`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to tag players.")
        if (!["Marksman", "Beast Hunter"].includes(player.role) && !["Marksman", "Beast Hunter"].includes(player.dreamRole)) return;
        if (["Marksman", "Beast Hunter"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 !== 0) return await message.channel.send("You do know you can only place during the night? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")

        let obj = {
            "Marksman": getEmoji("mark", client),
            "Beast Hunter": getEmoji("trap", client)
        }

        if (args[0].toLowerCase() === "cancel") {
            if (!player.placed) {
                db.delete(`player_${player.id}.target`)
                db.delete(`player_${player.id}.placed`)
                await message.channel.send(`${object[player.role]} Done! I have canceled your placement on that player!`)
            } else {
                let b = await message.channel.send({ content: `Are you sure you want to do this? Your ${player.role === "Marksman" ? "mark" : "trap"} is already active!`, components: [{ type: 1, components: [{ type: 2, custom_id: "place_no", style: 3, label: "No" }, { type: 2, custom_id: "place_yes", style: 4, label: "Yes" }] }] })
                b.awaitMessageComponent({ filter: (i) => i.user.id === message.author.id })
                .then(async i => {
                    if (i.customId === "place_no") {
                        await i.update({ content: "Action canceled.", components: [] })
                    } else {
                        db.delete(`player_${player.id}.target`)
                        db.delete(`player_${player.id}.placed`)
                        await i.reply(`${object[player.role]} Done! I have canceled your placement on that player!`)
                    }
                })
                .catch(async () => {                     
                    await b.edit({ content: "Action canceled.", components: [] })
                })
            } 
            return;
        }
        
        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President" && player.role === "Marksman") return await message.channel.send("You cannot mark the President!")

        if (!player.hypnotized) {

            if (db.get(`player_${player.id}`).sected === target && player.role === "Marksman")  return await message.channel.send("You cannot mark your own Sect Leader")

            if (db.get(`player_${player.id}`).couple === target && player.role === "Marksman")  return await message.channel.send("You cannot mark your own couple!")

            if (player.id === target && player.role === "Marksman") return await message.channel.send("You do know that you cannot mark yourself right?")

        }

        db.set(`player_${player.id}.target`, target)

        await message.channel.send(`${obj[player.role]} You have set your ${player.role === "Marksman" ? "mark" : "trap"} on **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**!`)

    },
}
