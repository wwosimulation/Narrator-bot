const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "water",
    description: "Spray someone with your water. If they're a wolf, they die, otherwise you die.",
    usage: `${process.env.PREFIX}water <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to water players.")
        if (!["Priest"].includes(player.role) && !["Priest"].includes(player.dreamRole)) return
        if (["Priest"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0) return await message.channel.send("You do know that you can only water during the day right? Or are you delusional?")
        if (gamePhase === 1) return await message.channel.send("Unfortunately, you can only water after the discussion phase on day 1!")
        if (player.uses === 0) return await message.channel.send("You already used up your ability!")
        if (args.length !== 1) return await message.channel.send("You need to select a player to water!")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot water the President!")

        if (db.get(`player_${player.id}`).couple === target) return await message.channel.send("You cannot water your own couple!")

        if (player.id === target) return await message.channel.send("You do know that you cannot water yourself right?")

        db.subtract(`player_${player.id}.uses`, 1)

        let gameMsg = {
            wolf: `${getEmoji("water", client)} **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("priest", client)} Priest)** has thrown holy water at and killed **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username} (${getEmoji(db.get(`player_${target}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${target}`).role})**`,
            notWolf: `${getEmoji("water", client)} **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("priest", client)} Priest)** tried to throw holy water on **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}** and killed themselves! **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}** is not a werewolf!`,
        }

        let member = db.get(`player_${target}`).team === "Werewolf" && !["Werewolf Fan", "Sorcerer"].includes(db.get(`player_${target}`).role) ? target : player.id
        let guy = await message.guild.members.fetch(member)
        let roles = guy.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id))

        await guy.roles.set(roles)
        await message.channel.send(`${getEmoji("water", client)} You have succesfully used your ability!`)
        await daychat.send(`${guy.id === target ? gameMsg.wolf : gameMsg.notWolf}`)

        if (guy.id === target) await message.member.roles.add("892046205780131891")
    },
}
