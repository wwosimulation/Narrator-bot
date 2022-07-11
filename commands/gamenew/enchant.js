const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "enchant",
    description: "Enchant or disguise a player.",
    usage: `${process.env.PREFIX}enchant <player>`,
    aliases: ["disguise"],
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to enchant players.")
        if (!["Wolf Shaman", "Illusionist"].includes(player.role) && !["Wolf Shaman", "Illusionist"].includes(player.dreamRole)) return;
        if (["Wolf Shaman", "Illusionist"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (player.role === "Wolf Shaman" && gamePhase % 3 == 0) return await message.channel.send("You do know that you can only enchant during the day right? Or are you delusional?")
        if (player.role === "Illusionist" && gamePhase % 3 != 0) return await message.channel.send("You do know that you can only disguise during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        
        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            return await message.channel.send(`${getEmoji(`${player.role === "Illusionist" ? "delude" : "shaman"}`, client)} Done! That player is no longer under your ${player.role === "Wolf Shaman" ? "enchantment" : "disguise"}!`)
        }

        if (player.role === "Wolf Shaman" && players.map(p => db.get(`player_${p}`)).filter(p => p.team === "Werewolf" && p.status === "Alive").length === 1) {
            return await message.channel.send(`You cannot enchant if you are the last wolf alive!`)
        }
        
        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send(`You need to select an alive player to ${player.role === "Wolf Shaman" ? "enchant" : "disguise"}!`)

        if (player.role === "Wolf Shaman" && db.get(`player_${target}`).team === "Werewolf" && db.get(`player_${target}`).role !== "Werewolf Fan") {
            return await message.channel.send("You cannot enchant your fellow teammate!")
        }

        if (!player.hypnotized) {

            if (db.get(`player_${player.id}`).couple === target && player.role === "Illusionist") return await message.channel.send("You cannot disguise your own couple!")

            if (player.id === target) return await message.channel.send(`You do know that you cannot ${player.role === "Wolf Shaman" ? "enchant" : "disguise"} yourself right?`)

        }

        db.set(`player_${player.id}.target`, target)

        message.channel.send(`${getEmoji(`${player.role === "Illusionist" ? "delude" : "shaman"}`, client)} You have decided to ${player.role === "Illusionist" ? "delude" : "enchant"} **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**`)

    }
}
