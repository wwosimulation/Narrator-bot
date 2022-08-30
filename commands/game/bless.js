const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "bless",
    description: "Bless a player so they can view the role of the player.",
    usage: `${process.env.PREFIX}bless <player>`,
    aliases: ["quiet", "shush"],
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to bless players.")
        if (!["Astral Wolf"].includes(player.role) && !["Astral Wolf"].includes(player.dreamRole)) return
        if (["Astral Wolf"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0) return await message.channel.send("You do know that you can only bless during the day right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.usesB === 0) return await message.channel.send("You have already blessed a player!")

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player!")

        if (!player.hypnotized) {
            if (player.id === target) return await message.channel.send("You do know that you cannot bless yourself right?")

            if (players.filter((p) => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan").includes(target)) return await message.channel.send("You cannot bless your own werewolf teammate!")
        }

        db.subtract(`player_${player.id}.usesB`, 1)
        db.set(`player_${player.id}.usedBAt`, Math.floor(db.get(`gamePhase`) / 3) + 1)

        let channel = message.guild.channels.cache.get(db.get(`player_${target}`)?.channel)

        let dropdown = {
            type: 3,
            custom_id: "astral-bless",
            options: players
                .filter((p) => db.get(`player_${p}`).status === "Alive" && p !== target)
                .map((p, i) => {
                    return { label: `Player ${i + 1}`, value: p, description: `${i + 1} ${db.get(`player_${p}`).username}` }
                }),
        }

        await channel?.send({ content: `${getEmoji("astral_wolf", client)} You have been blessed by the Astral Wolf and have been given a chance to view a player's role.`, components: [{ type: 1, components: [dropdown] }] })
        await channel?.send(`${message.guild.roles.cache.find((r) => r.name === "Alive")}`)
        await message.channel.send(`${getEmoji("astral_wolf", client)} You have given **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}** your blessing! They can now select a player to view their role.`)
    },
}
