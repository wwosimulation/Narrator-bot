const db = require("quick.db")
const config = require("../../config")

module.exports = {
    name: "mute",
    description: "Mute a player and prevent them from voting the next day.",
    usage: `${process.env.PREFIX}mute <player>`,
    aliases: ["quiet", "shush"],
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to mute players.")
        if (!["Grumpy Grandma", "Vodoo Werewolf", "Hacker"].includes(player.role) && !["Grumpy Grandma", "Vodoo Werewolf", "Hacker"].includes(player.dreamRole)) return;
        if (["Grumpy Grandma", "Vodoo Werewolf", "Hacker"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only mute during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.role !== "Grumpy Grandma" && (player.role === "Voodoo Werewolf" ? player.usesM : player.uses) === 0) return await message.channel.send("You already used up your ability!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("mute", client)} Your action has been canceled!`)
            return;
        }

        let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot mute the President!")

        if (!player.hypnotized) {

            if (db.get(`player_${player.id}`).sected === target)  return await message.channel.send("You cannot mute your own Sect Leader")

            if (db.get(`player_${player.id}`).couple === target)  return await message.channel.send("You cannot mute your own couple!")

            if (player.id === target) return await message.channel.send("You do know that you cannot mute yourself right?")

            if (player.role === "Voodoo Werewolf" && players.filter(p => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan").includes(target)) return await message.channel.send("You cannot mute your own werewolf teammate! ")

            if (player.role === "Hacker" && !player.hackedPlayers.includes(target)) return await message.channel.send("You cannot mute someone you have not hacked!")

        }

        db.set(`player_${player.id}.target`, target)
        await message.channel.send(`${getEmoji("mute", client)} You have decided to mute **${players.indexOf(target)+1} ${db.get(`player_${target}`).username}**!`)

    },
}
