const db = require("quick.db")
const { getEmoji, fn, ids } = require("../../config")

module.exports = {
    name: "shoot",
    description: "Kill a player with your weapons!",
    usage: `${process.env.PREFIX}shoot [player]`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to shoot players.")
        if (!["Gunner", "Jailer", "Marksman", "Vigilante"].includes(player.role) && !["Gunner", "Jailer", "Marksman", "Vigilante"].includes(player.dreamRole)) return
        if (["Gunner", "Jailer", "Marksman", "Vigilante"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0 && ["Gunner", "Vigilante"].includes(player.role)) return await message.channel.send("You do know that you can only shoot during the day right? Or are you delusional?")
        if (gamePhase % 3 !== 0 && player.role === "Jailer") return await message.channel.send("I know you're eager to shoot but come on man, you haven't even jailed anyone!")
        if (gamePhase % 3 === 0 && db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot shoot anyone!")
        if (gamePhase === 1) return await message.channel.send("Unfortunately, you can only shoot after the discussion phase on day 1!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used up all your abilities!")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (["Marksman", "Jailer"].includes(player.role)) target = player.target

        if (!target) return await message.channel.send("You need to select a player to shoot!")

        if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send("That player is no longer alive!")

        if (player.role === "Marksman" && !player.placed) return await message.channel.send("Chill dude, your mark hasn't been properly placed yet!")

        if (!player.hypnotized && target === player.id) return await message.channel.send("You can't shoot yourself. Why are you being selfish?")

        if (db.get(`player_${target}`) == "President") return await message.channel.send("You cannot shoot the President!")

        if (!player.hypnotized) {
            let cupid = db.get(`player_${player.id}`).cupid

            if (db.get(`player_${cupid}`)?.target.includes(target)) return await message.channel.send("You cannot shoot your lover!")

            if (target === player.sected) return await message.channel.send("You cannot shoot your own Sect Leader!")
        }

        let result = true

        if (player.role === "Marksman" && db.get(`player_${target}`).team === "Village") result = false

        let guy = db.get(`player_${target}`)
        let role = guy.role
        if (guy.tricked || player.tricked) role = "Wolf Trickster"

        let messages = {
            Gunner: `${getEmoji("bullet", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("gunner", client)} Gunner)** shot **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username} (${getEmoji(`${role.toLowerCase().replace(/\s/g, "_")}`, client)} ${role})**!`,
            Jailer: `${getEmoji("bullet", client)} The Jailer executed their prisoner last night! **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** is dead!`,
            Vigilante: `${getEmoji("bullet", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("vigilante", client)} Vigilante)** shot **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username} (${getEmoji(`${role.toLowerCase().replace(/\s/g, "_")}`, client)} ${role})**!`,
            Marksman: `${getEmoji("arrow", client)} ${result === true ? `The Marksman shot **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**` : `**${players.indexOf(player.id) + 1} ${player.username} (${getEmoji(role, client)} ${role})** tried shooting **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}** but their shot backfired! **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}** is a villager!`}`,
        }

        let member = await message.guild.members.fetch(result === true ? target : player.id)
        let roles = member.roles.cache.map((r) => (r.name === "Alive" ? message.guild.roles.cache.find((r) => r.name === "Dead").id : r.id))
        await member.roles.set(roles)
        await message.guild.channels.cache.find((c) => c.name === "day-chat")?.send(messages[player.role])

        db.subtract(`player_${player.id}.uses`, 1)
        db.set(`player_${member.id}.status`, "Dead")
        client.emit("playerKilled", db.get(`player_${member.id}`), player.id)
    },
}
