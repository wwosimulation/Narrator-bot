const db = require("quick.db")
const { getRole } = require("../../config")
const aliases = require("../../config/src/aliases")

module.exports = {
    name: "manual",
    description: "Assign a role to someone.",
    usage: `${process.env.PREFIX}manual <player> <role>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        if (args.length !== 2) return await message.channel.send("You need to state the player and the role!")

        for (const key in aliases) {
            if (args[1].toLowerCase() === key) args[1] = aliases[key]
        }

        const gamePhase = db.get(`gamePhase`)
        const night = Math.floor(gamePhase / 3) + 1
        const alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        const mininarr = message.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        const narrator = message.guild.roles.cache.find((r) => r.name === "Narrator")

        let players = db.get(`players`) || []

        let player = message.guild.members.cache.find((m) => [m.nickname, m.id, m.user.username, m.user.tag].includes(args[0]))
        let role = getRole(args[1])

        if (!player) return await message.channel.send("Player not found!")

        if (!player.roles.cache.has(alive.id)) return await message.channel.send("This player does not have the alive role!")

        if (!role) return await message.channel.send("Role not found!")

        if (db.get(`started`) === "yes") return await message.channel.send("The game has already started! If you still want to add this player, use the `+reset` command, and then use the `/srole` command instead!")

        message.react("💋")

        let channel = await message.guild.channels.create(`priv-${role.name.toLowerCase().replace(/\s/g, "-")}`, {
            parent: "892046231516368906",
        })

        channel.permissionOverwrites.create(message.guild.id, {
            VIEW_CHANNEL: false,
        })

        channel.permissionOverwrites.create(narrator.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
            ADD_REACTIONS: true,
            MANAGE_CHANNELS: true,
        })

        channel.permissionOverwrites.create(mininarr.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
            ADD_REACTIONS: true,
            MANAGE_CHANNELS: true,
        })

        channel.permissionOverwrites.create(guy.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
        })

        await channel.send(getRole(role).description || "Description not found").then((msg) => msg.pin().then((msg) => msg.channel.bulkDelete(1)))

        await channel.send(`** **\n\n***__Do not do any actions until the Narrator says that night 1 has started!__***`)

        let object = {
            id: player.id,
            username: player.user.username,
            name: getRole(role).name,
            aura: getRole(role).aura,
            team: getRole(role).team,
            channel: channel.id,
        }

        db.set(`player_${player.id}`, object)

        players.push(player.id)
        db.set(`players`, players)
    },
}
