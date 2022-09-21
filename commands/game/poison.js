const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "poison",
    description: "Poison a player.",
    usage: `${process.env.PREFIX}poison <player>`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to poison players.")
        if (!["Witch"].includes(player.role) && !["Witch"].includes(player.dreamRole)) return
        if (["Witch"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0 || gamePhase === 0) return await message.channel.send("You do know that you can only poison after the first night right? Or are you delusional?")
        if (db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot poison anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.usesK === 0) return await message.channel.send("You already used up your ability!")
        if (args.length !== 1) return await message.channel.send("You need to select a player to poison!")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send(`I could not find the player with the query: \`${args[0]}\`!`)

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot poison the President!")

        if (!player.hypnotized) {
            let { cupid, instigator } = db.get(`player_${player.id}`)

            if (
                cupid
                    ?.map((a) => db.get(`player_${a}`))
                    ?.map((a) => a.target)
                    ?.join(",")
                    .split(",")
                    .includes(target)
            )
                return await message.channel.send("You cannot poison your own couple!")
            if (
                instigator
                    ?.map((a) => db.get(`player_${a}`))
                    ?.map((a) => a.target)
                    ?.join(",")
                    .split(",")
                    .includes(target)
            )
                return await message.channel.send("You cannot poison your fellow recruit!")
            if (instigator?.includes(target)) return await message.channel.send("You cannot poison the Instigator who recruited you!")

            if (player.id === target) return await message.channel.send("You do know that you cannot poison yourself right?")
        }

        db.subtract(`player_${player.id}.usesK`, 1)

        let guy = db.get(`player_${target}`)

        const stubbornWerewolves = require("../narrator/day/killingActions/protection/stubbornWerewolves.js") // stubborn www
        const surrogate = require("../narrator/day/killingActions/protection/surrogate.js") // surrogate

        // check if the player is stubborn wolf that has 2 lives
        let getResult = await stubbornWerewolves(client, guy) // checks if the player is stubborn wolf and has 2 lives
        if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
        // check if the player they are attacking is protected by their surrogate
        getResult = await surrogate(client, guy, player) // checks if a surrogate is prorecting them
        if (typeof getResult === "object") guy = db.get(`player_${getResult.id}`) // exits early if a surrogate IS protecting them

        let role = guy.role

        if (guy.tricked) role = "Wolf Trickster"

        let member = await message.guild.members.fetch(target)
        let roles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id))
        await message.channel.send(`${getEmoji("poison", client)} You have succesfully used your ability!`)
        await daychat.send(`${getEmoji("poison", client)} The Witch poisoned **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`)
        await member.roles.set(roles)
        db.set(`player_${target}.status`, "Dead")
        client.emit("playerKilled", db.get(`player_${target}`), player)
    },
}
