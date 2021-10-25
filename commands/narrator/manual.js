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
        for (const key in aliases) {
            if (args[1].includes(key)) {
                if (Object.hasOwnProperty.call(aliases, key)) {
                    const element = aliases[key]
                    args[1] = element
                }
            }
        }

        message.react("💋")
        let content = args[1]
        let night = Math.floor(db.fetch(`gamePhase`) / 3) + 1
        let day = Math.floor(db.fetch(`gamePhase`) / 3) + 1
        let amtD = day - day * 2 + 1
        let amtN = night - night * 2 + 1
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
        let role = await db.fetch(`role_${guy.id}`, args[1])
        let real = args[1].toLowerCase()
        let channel = message.guild.channels.cache.find((c) => c.name === `priv-${real}`)
        let wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let wwvote = message.guild.channels.cache.find((c) => c.name === "ww-vote")

        // let channels = message.guild.channels.cache.filter((c) => c.name === `priv-${real}`)
        // //console.log(channels)
        // let tomato = channels.map(x => x.id)
        // let ch = await db.fetch(`channels_${real}`)
        // console.log(tomato)
        // if (content.includes("-")) {
        //   content = content.replace(/(\w+)-(\w+)/g, (_, m1, m2) => `${m1[0].toUpperCase()}${m1.slice(1).toLowerCase()} ${m2[0].toUpperCase()}${m2.slice(1).toLowerCase()}`)
        // } else {
        //   content = `${args[1][0].toUpperCase()}${args[1].slice(1).toLowerCase()}`
        //   message.channel.send(content)
        // }

        // const { Permissions } = require("discord.js")
        // let permissions
        // console.log(tomato.length)
        // for (let y = 0; y < tomato.length; y++) {
        //   let guy
        //   for (let o = 1; o <= alive.members.size; o++) {
        //     guy = message.guild.members.cache.find((m) => m.nickname === o.toString())
        //     permissions = channel.permissionsFor(guy).has(["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"])
        //     if (permissions) {
        //       channel = message.guild.channels.cache.find((c) => c.id === tomato[y + 1])
        //       if (!channel) return await message.channel.send("All the channels for this role are occupied!")
        //     }
        //   }
        // }

        let mininarr = message.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        let narrator = message.guild.roles.cache.find((r) => r.name === "Narrator")
        let uwu = await message.guild.channels.create(`priv-${real}`, {
            parent: "892046231516368906",
        })
        uwu.permissionOverwrites.create(message.guild.id, {
            VIEW_CHANNEL: false,
        })
        uwu.permissionOverwrites.create(narrator.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
            ADD_REACTIONS: true,
            MANAGE_CHANNELS: true,
        })
        uwu.permissionOverwrites.create(mininarr.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
            ADD_REACTIONS: true,
            MANAGE_CHANNELS: true,
        })
        await uwu.send(getRole(real).description).then((msg) => msg.pin())

        uwu.permissionOverwrites.edit(guy.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
        })

        if (real.includes("wolf") || real == "sorcerer") {
            wwchat.permissionOverwrites.edit(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
        }

        if (real.includes("wolf")) {
            wwvote.permissionOverwrites.edit(guy.id, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
        }

        if (real == "sibling") {
            let sibling = message.guild.channels.cache.find((c) => c.name === "sibling-chat")
            sibling.permissionOverwrites.edit(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
        }
        db.set(`role_${guy.id}`, getRole(real).name)
    },
}
