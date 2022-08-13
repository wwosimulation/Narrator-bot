const db = require("quick.db")
const { getEmoji } = require("../../config")

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

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to tag players.")
        if (!["Marksman", "Beast Hunter", "Astral Wolf"].includes(player.role) && !["Marksman", "Beast Hunter", "Astral Wolf"].includes(player.dreamRole)) return
        if (["Marksman", "Beast Hunter", "Astral Wolf"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 !== 0) return await message.channel.send("You do know you can only place during the night? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (args.length === 0) return await message.channel.send("You do know you need to tell me the player right?")
        if (player.role === "Marksman" && player.uses === 0) return await message.channel.send("You already used up your abilities!")
        if (player.role === "Astral Wolf" && player.usesB !== 0) return await message.channel.send("You need to bless someone before you can mark players!")
        if (player.role === "Astral Wolf" && player.usedBAt === Math.floor(gamePhase / 3) + 1) return await message.channel.send("You need to wait a night before you can mark players! You just blessed someone.")
        if (player.role === "Astral Wolf" && args.length > 3) return await message.channel.send("You can only mark up to 3 players!")

        let obj = {
            Marksman: getEmoji("mark", client),
            "Beast Hunter": getEmoji("trap", client),
            "Astral Wolf": getEmoji("mark", client),
        }

        if (args[0].toLowerCase() === "cancel") {
            if (!player.placed) {
                db.delete(`player_${player.id}.target`)
                db.delete(`player_${player.id}.placed`)
                await message.channel.send(`${object[player.role]} Done! I have canceled your placement on that player!`)
            } else {
                let b = await message.channel.send({
                    content: `Are you sure you want to do this? Your ${player.role === "Marksman" ? "mark" : "trap"} is already active!`,
                    components: [
                        {
                            type: 1,
                            components: [
                                { type: 2, custom_id: "place_no", style: 3, label: "No" },
                                { type: 2, custom_id: "place_yes", style: 4, label: "Yes" },
                            ],
                        },
                    ],
                })
                b.awaitMessageComponent({ filter: (i) => i.user.id === message.author.id })
                    .then(async (i) => {
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
            return
        }

        let target = [players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])]
        if (player.role === "Astral Wolf" && args.length === 2) target.push(players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1]))
        if (player.role === "Astral Wolf" && args.length === 3) target.push(players[Number(args[2]) - 1] || players.find((p) => p === args[2]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[2]))

        if (!target[0]) return await message.channel.send(`The player with the query: \`${args[0]}\` could not be found!`)
        if (player.role === "Astral Wolf" && args.length === 2 && !target[1]) return await message.channel.send(`The player with the query: \`${args[1]}\` could not be found!`)
        if (player.role === "Astral Wolf" && args.length === 3 && !target[2]) return await message.channel.send(`The player with the query: \`${args[2]}\` could not be found!`)

        if (db.get(`player_${target[0]}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")
        if (player.role === "Astral Wolf" && args.length === 2 && db.get(`player_${target[1]}`).status !== "Alive") return await message.channel.send(`You need to select an ALIVE player!`)
        if (player.role === "Astral Wolf" && args.length === 3 && db.get(`player_${target[2]}`).status !== "Alive") return await message.channel.send(`You need to select an ALIVE player!`)

        if (db.get(`player_${target[0]}`).role === "President" && player.role === "Marksman") return await message.channel.send("You cannot mark the President!")
        if (player.role === "Astral Wolf" && target.map((p) => db.get(`player_${p}`).role).includes("President")) return await message.channel.send("You cannot mark the President!")

        if (!player.hypnotized) {
            if (db.get(`player_${player.id}`).sected === target[0] && player.role === "Marksman") return await message.channel.send("You cannot mark your own Sect Leader")

            if (db.get(`player_${player.id}`).couple === target[0] && player.role === "Marksman") return await message.channel.send("You cannot mark your own couple!")

            if (player.role === "Astral Wolf" && target.includes(player.couple)) return await message.channel.send("You cannot mark one of your own couples!")

            if (player.id === target[0] && player.role === "Marksman") return await message.channel.send("You do know that you cannot mark yourself right?")

            if (player.role === "Astral Wolf" && target.includes(player.id)) return await message.channel.send("You cannot mark yourself!")

            if (player.role === "Astral Wolf" && target.filter((p) => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan").length > 0) return await message.channel.send("You cannot mark your own werewolf teammate!")
        }

        db.set(`player_${player.id}.target`, target[0])

        if (player.role === "Astral Wolf") db.set(`player_${player.id}.target`, target)

        db.delete(`player_${player.id}.placed`)

        await message.channel.send(`${obj[player.role]} You have set your ${player.role === "Beast Hunter" ? "trap" : "mark"} on **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username}**!`)
        if (player.role === "Astral Wolf") await message.channel.send(`${obj[player.role]} You have set your mark on **${target.map((p) => `${players.indexOf(p) + 1} ${db.get(`player_${p}`).username}`).join("**, **")}**!`)
    },
}
