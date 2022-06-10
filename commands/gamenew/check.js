const db = require("quick.db")
const { soloKillers, roles, getRole, getEmoji, fn, ids } = require("../../config")

module.exports = {
    name: "check",
    description: "Check players during the night. This command works for every seer in game.",
    usage: `${process.env.PREFIX}check <player> [<player>]`,
    gameOnly: true,
    run: async (message, args, client) => {
        
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const wwchat = message.guild.channels.cache.find("werewolves-chat")
        let player = db.get(`player_${message.author.id}`) || [{ status: "Dead" }]

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await send("Listen to me, you need to be ALIVE to check players.")
        if (!["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff"].includes(player.role) && !["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff"].includes(player.dreamRole)) return;
        if (["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only check during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.uses === 0) return await message.channel.send("You already used up your ability!")
        if (args.length < 1) return await message.channel.send("Please select a player first.")
        if (["Spirit Seer", "Detective"].includes(player.role) && args.length !== 1) return await message.channel.send("You need to select 1 player to check!")
        if (player.role === "Spirit Seer" && args.length > 2) return await message.channel.send("You can only select a maximum of 2 players to check!")
        if (player.role === "Detective" && args.length !== 2) return await message.channel.send("You need to select 2 players to investigate!")

        let target = []

        target.push(players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0]))

        if (args.length > 1) target.push( players[Number(args[1])-1] || players.find(p => p === args[1]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[1]) )
        if (!player.hypnotized && (target.includes(player.id))) return await message.channel.send("You can't check yourself, unless you have trust issues of course.")

        let result = { p1: {}, p2: {} }
        target.forEach((guy, index) => {
            
            let { aura, role, team } = db.get(`player_${guy}`)

            if (guy.disguised === true) { aura = "Unknown", role = "Illusionist", team = "Solo" };
            if (!["Wolf Seer", "Sorcerer"].includes(guy.role) && guy.shamanned === true) { aura = "Evil", role = "Wolf Shaman", team = "Werewolf" }
            if (guy.role === "Sorcerer" && player.team !== "Werewolf") { aura = "Good", role = guy.fakeRole, team = "Village" }

            result[`p${index+1}`] = { aura, team, role }
        })

        target = target.map(a => db.get(`player_${a}`))

        if (player.role === "Seer") await message.channel.send(`${getEmoji("seer", client)} You checked **${players.indexOf(target[0].id)+1} ${target[0].username} (${getEmoji(result[p1].role.toLowerCase().replace(/\s/g, "_"), client)} ${result[p1].role})**!`)
        if (player.role === "Aura Seer") await message.channel.send(`${getEmoji("aura_seer", client)} You checked **${players.indexOf(target[0].id)+1} ${target[0].username} (${result[p1].aura})**!`)
        if (player.role === "Wolf Seer") await message.channel.send(`${getEmoji("wolf_seer", client)} You checked **${players.indexOf(target[0].id)+1} ${target[0].username} (${getEmoji(result[p1].role.toLowerCase().replace(/\s/g, "_"), client)} ${result[p1].role})**!`)
        if (player.role === "Wolf Seer") await wwchat.send(`${getEmoji("wolf_seer", client)} The Wolf Seer checked **${players.indexOf(target[0].id)+1} ${target[0].username} (${getEmoji(result[p1].role.toLowerCase().replace(/\s/g, "_"), client)} ${result[p1].role})**!`)
        if (player.role === "Sorcerer") await message.channel.send(`${getEmoji("sorcerer", client)} You checked **${players.indexOf(target[0].id)+1} ${target[0].username} (${getEmoji(result[p1].role.toLowerCase().replace(/\s/g, "_"), client)} ${result[p1].role})**!`)
        if (player.role === "Detective") {
            let result = p1.team === p2.team ? "belong to the same team" : "do not belong to the same team!"
            if ([p1.team, p2.team].includes("Solo")) result = "do not belong to the same team."
            await message.channel.send(`${getEmoji(result.startsWith("do") ? "detnotequal" : "detequal", client)} Player **${players.indexOf(target[0].id)+1} ${target[0].username}** and **${players.indexOf(target[1].id)+1} ${target[1].username}** __${result}__`)
        }

        db.set(`player_${player.id}.uses`, 0)

        if (player.role === "Spirit Seer") {
            db.set(`player_${player.id}.target`, target.map(a => a.id))
            await message.channel.send(`${getEmoji("sscheck", client)} You decided to check **${target.map(s => `${players.indexOf(s)+1} ${db.get(`player_${s}`).username}`).join("** and **")}**!`)
        }

        if (player.role === "Sheriff") {
            db.set(`player_${player.id}.target`, target[0].id)
            await message.channel.send(`${getEmoji("snipe", client)} You decided to look out for **${players.indexOf(target[0].id)+1} ${target[0].username}**!`)
        }

    },
}
