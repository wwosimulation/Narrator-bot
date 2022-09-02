const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "snap",
    description: "Kill all disguised players",
    usage: `${process.env.PREFIX}snap`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const daychat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to snap players.")
        if (!["Illusionist"].includes(player.role) && !["Illusionist"].includes(player.dreamRole)) return
        if (["Illusionist"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 !== 1) return await message.channel.send("You do know that you can only snap during the day right? Or are you delusional?")
        if (player.disguisedPlayers?.filter((p) => db.get(`player_${p}`)?.status === "Alive").length === 0 || !player.disguisedPlayers) return await message.channel.send("You have to have at least 1 alive disguised player to start snapping them!")

        player.disguisedPlayers.forEach(async (target) => {
            if (db.get(`player_${target}`).status === "Dead") return
            let member = await message.guild.members.fetch(target)
            let roles = member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id))
            let guy = db.get(`player_${target}`)
            let role = guy.role
            if (guy.tricked) role = "Wolf Trickster"
            db.set(`player_${target}.status`, "Dead")
            await member.roles.set(roles)
            await daychat.send(`${getEmoji("snap", client)} The Illusionist killed **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`)
            client.emit("playerKilled", db.get(`player_${target}`), player)
        })

        await message.channel.send(`${getEmoji("snap", client)} All disguised players have been snapped!`)
    },
}
