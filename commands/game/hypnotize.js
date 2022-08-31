const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "hypnotize",
    description: "Select a player to control at night.",
    usage: `${process.env.PREFIX}hypnotize <player>`,
    aliases: ["control"],
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to hypnotize players.")
        if (!["Dreamcatcher"].includes(player.role) && !["Dreamcatcher"].includes(player.dreamRole)) return
        if (["Dreamcatcher"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 == 0) return await message.channel.send("You do know that you can only select to hypnotize during the day right? Or are you delusional?")
        if (args.length !== 1) return await message.channel.send("You need to select a players to control!")

        if (args[0].toLowerCase() === "cancel") {
            db.delete(`player_${player.id}.target`)
            await message.channel.send(`${getEmoji("hypnotize", client)} Your action has been canceled!`)
            return
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot hypnotize the President!")


        let { cupid, instigator } = db.get(`player_${player.id}`)

        if (cupid?.map(a => db.get(`player_${a}`))?.map(a => a.target)?.join(",").split(",").includes(target)) return await message.channel.send("You cannot hypnotize your own couple!")
        if (instigator?.map(a => db.get(`player_${a}`))?.map(a => a.target)?.join(",").split(",").includes(target)) return await message.channel.send("You cannot hypnotize your fellow recruit!")
        if (instigator?.includes(target)) return await message.channel.send("You cannot hypnotize the Instigator who recruited you!")

        if (player.id === target) return await message.channel.send("Why are you trying to hypnotize yourself?")

        db.set(`player_${player.id}.target`, target)

        await message.channel.send(`${getEmoji("hypnotize", client)} You have decided to hypnotize **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**!`)
    },
}
