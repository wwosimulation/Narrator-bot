const db = require("quick.db")
const { soloKillers, roles, getRole, getEmoji, fn, ids } = require("../../config")

module.exports = {
    name: "check",
    description: "Select a player to forsee the result.",
    usage: `${process.env.PREFIX}check <player> [<player>]`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to check players.")
        if (!["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff", "Evil Detective"].includes(player.role) && !["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff", "Evil Detective"].includes(player.dreamRole)) return
        if (["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff", "Evil Detective"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only check during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used up your ability!")
        if (args.length < 1) return await message.channel.send("Please select a player first.")
        if (!["Spirit Seer", "Detective"].includes(player.role) && args.length !== 1) return await message.channel.send("You need to select 1 player to check!")
        if (player.role === "Wolf Seer" && player.resign) return await message.channel.send("You already resigned from checking!")
        if (player.role === "Spirit Seer" && args.length > 2) return await message.channel.send("You can only select a maximum of 2 players to check!")
        if (["Detective", "Evil Detective"].includes(player.role) && args.length !== 2) return await message.channel.send("You need to select 2 players to investigate!")

        let target = []

        target.push(players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0]))

        if (args.length > 1) target.push(players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1]))
        if (!player.hypnotized && target.includes(player.id) && player.role !== "Evil Detective") return await message.channel.send("You can't check yourself, unless you have trust issues of course.")
        if (!player.hypnotized && player.role === "Wolf Seer" && db.get(`player_${target[0]}`).team === "Werewolf" && db.get(`player_${target[0]}`).role !== "Werewolf Fan") return await message.channel.send("I know have trust issues, but you cannot check your own teammates!")
        if (target.map((a) => db.get(`player_${a}`).role).includes("President")) return await message.channel.send("You cannot check the president.")

        let result = { p1: {}, p2: {} }
        target.forEach((guy, index) => {
            let { aura, role, team } = db.get(`player_${guy}`)

            if (guy.disguised === true) {
                aura = "Unknown"
                role = "Illusionist"
                team = "Solo"
            }
            if (!["Wolf Seer", "Sorcerer"].includes(guy.role) && guy.shamanned === true) {
                aura = "Evil"
                role = "Wolf Shaman"
                team = "Werewolf"
            }
            if (guy.role === "Sorcerer" && player.team !== "Werewolf") {
                aura = "Good"
                role = guy.fakeRole
                team = "Village"
            }

            result[`p${index + 1}`] = { aura, team, role }
        })

        if (player.role === "Seer") await message.channel.send(`${getEmoji("seer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Aura Seer") await message.channel.send(`${getEmoji("aura_seer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${result["p1"].aura})**!`)
        if (player.role === "Wolf Seer") await message.channel.send(`${getEmoji("wolf_seer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Wolf Seer") await wwchat.send(`${getEmoji("wolf_seer", client)} The Wolf Seer checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Sorcerer") await message.channel.send(`${getEmoji("sorcerer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Detective") {
            let results = result.p1.team === result.p2.team ? "belong to the same team" : "do not belong to the same team!"
            if ([result.p1.team, result.p2.team].includes("Solo")) result = "do not belong to the same team."
            await message.channel.send(`${getEmoji(results.startsWith("do") ? "detnotequal" : "detequal", client)} Player **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username}** and **${players.indexOf(target[1]) + 1} ${db.get(`player_${target[1]}`).username}** __${results}__`)
        }

        if (player.role !== "Evil Detective") db.set(`player_${player.id}.uses`, 0)

        if (player.role === "Spirit Seer") {
            db.set(`player_${player.id}.target`, target)
            await message.channel.send(`${getEmoji("sscheck", client)} You decided to check **${target.map((s) => `${players.indexOf(s) + 1} ${db.get(`player_${s}`).username}`).join("** and **")}**!`)
        }

        if (player.role === "Sheriff") {
            db.set(`player_${player.id}.target`, target[0])
            await message.channel.send(`${getEmoji("snipe", client)} You decided to look out for **${players.indexOf(target[0].id) + 1} ${target[0].username}**!`)
        }

        if (player.role === "Evil Detective") {
            db.set(`player_${player.id}.target`, target)
            await message.channel.send(`${getEmoji("evildetcheck", client)} You have decided to investigate **${target.map((p) => `${players.indexOf(p) + 1} ${db.get(`player_${p}`).username}`).join("** and **")}**. These players will be killed if they belong to different teams!`)
        }
    },
}
