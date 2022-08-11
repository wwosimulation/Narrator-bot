module.exports = {
    name: "nmanual",
    description: "Manual permissions.",
    usage: `${process.env.PREFIX}nmanual <player>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (args.length !== 1) return await message.channel.send("You need to state the player")

        const gamePhase = db.get(`gamePhase`)
        const night = Mathf.floor(gamePhase / 3) + 1
        const alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        const mininarr = message.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        const narrator = message.guild.roles.cache.find((r) => r.name === "Narrator")

        let players = db.get(`players`) || []

        let player = message.guild.members.cache.find((m) => [m.nickname, m.id, m.user.username, m.user.tag].includes(args[0]))

        if (!player) return await message.channel.send("Player not found!")

        if (!player.roles.cache.has(alive.id)) return await message.channel.send("This player does not have the alive role!")

        let role = db.get(`player_${player.id}`).role

        if (!role) return await message.channel.send("That player does not have a role!")

        if (db.get(`started`) === "yes") return await message.channel.send("The game has already started! If you want to reset the roles, do `+reset` and use `/srole` command again!")

        message.react("💋")

        let channel = message.guild.channels.cache.get(db.get(`player_${player.id}`).channel)

        await channel?.delete()

        db.delete(`player_${player.id}`)

        let newPlayers = players.filter((p) => p !== player.id)
        db.set(`players`, newPlayers)
    },
}
