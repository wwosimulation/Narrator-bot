const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "protect",
    description: "Protect a player from being attacked.",
    usage: `${process.env.PREFIX}protect <player>`,
    aliases: ["heal", "save", "antidote"],
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to protect players.")
        if (!["Doctor", "Bodyguard", "Tough Guy", "Witch", "Ghost Lady", "Night Watchman", "Lethal Seer", "Surrogate"].includes(player.role) && !["Doctor", "Bodyguard", "Tough Guy", "Witch", "Ghost Lady", "Night Watchman", "Lethal Seer", "Surrogate"].includes(player.dreamRole)) return
        if (["Doctor", "Bodyguard", "Tough Guy", "Witch", "Ghost Lady", "Night Watchman", "Lethal Seer", "Surrogate"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (player.role !== "Lethal Seer" && gamePhase % 3 != 0) return await message.channel.send("You do know that you can only protect during the night right? Or are you delusional?")
        if (player.role === "Lethal Seer" && gamePhase % 3 === 0) return await message.channel.send("You do know that you can only use your antidote during the day right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.role !== "Lethal Seer" && args.length !== 1) return await message.channel.send("Please select a player to protect!")
        if (player.role === "Lethal Seer" && player.usesA === 0) return await message.channel.send("You already used up your ability!")
        if (player.role === "Lethal Seer" && !player.target) return await message.channel.send("You need to check someone before you can use the antidote")
        if (["Night Watchman", "Ghost Lady", "Witch", "Surrogate"].includes(player.role) && player.uses === 0) return await message.channel.send("You have already used up your abilities!")

        let object = {
            Doctor: getEmoji("heal", client),
            "Tough Guy": getEmoji("guard", client),
            Bodyguard: getEmoji("guard", client),
            Witch: getEmoji("potion", client),
            "Ghost Lady": getEmoji("gl_protection", client),
            "Night Watchman": getEmoji("nwm_select", client),
            "Lethal Seer": getEmoji("lethal_seer", client),
            Surrogate: getEmoji("surrogate", client),
        }

        if (args[0]?.toLowerCase() === "cancel" && player.role !== "Lethal Seer") {
            if (!db.get(`player_${player.id}`).target && player.role === "Surrogate") return await message.channel.send("What are you trying to cancel if there is nothing to cancel?")
            db.delete(`player_${player.id}.target`)
            if (player.role === "Surrogate") db.set(`player_${player.id}.cancelAt`, db.get(`gamePhase`))
            return await message.channel.send(`${object[player.role]} Done! That player is no longer protected!`)
        }

        if (player.role === "Lethal Seer") {
            db.delete(`player_${player.id}.target`)
            db.subtract(`player_${player.id}.usesA`, 1)
            return await message.channel.send(`${object[player.role]} You have used your antidote so the player you checked will not be killed tonight!`)
        }

        if (player.role === "Surrogate" && player.target) return await message.channel.send("You cannot protect anyone else until you cancel your ability!")

        if (player.role === "Surrogate" && player.cancelAt < db.get(`gamePhase`) + 3) return await message.channel.send("You must wait a full day and night before you can use this command again!")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send("You need to select an alive player to protect!")

        if (!player.hypnotized && target === player.id) return await message.channel.send("You can't protect yourself. Why are you being selfish?")

        db.set(`player_${player.id}.target`, target)

        if (player.role === "Surrogate") {
            db.set(`player_${player.id}.protectAt`, db.get(`gamePhase`))
            db.delete(`player_${player.id}.cancelAt`)
        }

        message.channel.send(`${object[player.role]} You have decided to protect **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**`)
    },
}
