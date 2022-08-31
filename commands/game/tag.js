const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "tag",
    description: "Select a target to be revealed or killed when you die.",
    usage: `${process.env.PREFIX}tag <player>`,
    aliases: ["revenge", "avenge", "target", "bind"],
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        const wwChat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to tag players.")
        if (!["Avenger", "Loudmouth", "Junior Werewolf", "Split Wolf"].includes(player.role) && !["Avenger", "Loudmouth", "Junior Werewolf", "Split Wolf"].includes(player.dreamRole)) return
        if (["Avenger", "Loudmouth", "Junior Werewolf", "Split Wolf"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0 && Math.floor(gamePhase / 3) === 0 && ["Avenger", "Loudmouth"].includes(player.role)) return await message.channel.send("You can only tag players after night 1!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.role === "Split Wolf" && gamePhase % 3 !== 0) return await message.channel.send("You cannot bind players during the day!")
        if (player.role === "Split Wolf" && player.uses === 0) return await message.channel.send("You already selected a player to be binded with!")
        if (player.role === "Split Wolf" && Math.floor(gamePhase / 3) + 1 > 3) return await message.channel.send("You can no longer use this ability as it has been more than 3 nights!")
        if (player.team === "Village" && gamePhase === 1) return await message.channel.send("You can only start selecting players after the discussion phase on day 1!")

        let emotes = {
            Avenger: getEmoji("avenge", client),
            Loudmouth: getEmoji("loudmouthing", client),
            "Junior Werewolf": getEmoji("revenge", client),
            "Split Wolf": getEmoji("bind", client),
        }

        if (args[0].toLowerCase() === "cancel") {
            if (player.role === "Split Wolf") return await message.channel.send("You cannot cancel your ability as Split Wolf")
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${emotes[player.role]} Done! That player is no longer tagged!`)
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send(`You must select an ALIVE player to ${player.role === "Split Wolf" ? "bind with" : "tag"}!`)

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot select the President!")

        if (!player.hypnotized) {
            if (player.role !== "Loudmouth") {
                let { cupid, instigator } = db.get(`player_${player.id}`)

                if (
                    cupid
                        ?.map((a) => db.get(`player_${a}`))
                        ?.map((a) => a.target)
                        ?.join(",")
                        .split(",")
                        .includes(target)
                )
                    return await message.channel.send("You cannot select your own couple!")
                if (
                    instigator
                        ?.map((a) => db.get(`player_${a}`))
                        ?.map((a) => a.target)
                        ?.join(",")
                        .split(",")
                        .includes(target)
                )
                    return await message.channel.send("You cannot select your fellow recruit!")
                if (instigator?.includes(target)) return await message.channel.send("You cannot select the Instigator who recruited you!")

                if (player.sected === target) return await message.channel.send("You cannot select your own Sect Leader!")

                if (target === player.id) return await message.channel.send("Why do you want to select yourself?")
            }
        }

        if (!player.hypnotized && db.get(`player_${player.id}`).sected === target) return await message.channel.send("You cannot select your own Sect Leader!")

        if (!player.hypnotized && target === player.id) return await message.channel.send("Why do you want to select yourself?")

        if (player.role === "Split Wolf" && player.target) return await message.channel.send("You have already selected your target! This is permanent and you cannot cancel or change your target.")

        db.set(`player_${player.id}.target`, target)

        await message.channel.send(`${emotes[player.role]} You have decided to ${player.role === "Split Wolf" ? "bind with" : "tag"} **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)

        if (player.role === "Split Wolf") await wwChat.send(`${emotes[player.role]} **${players.indexOf(player.id) + 1} ${player.username} (${(getEmoji("split_wolf"), client)} Split Wolf)** has chosen to bind with player **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)
    },
}
