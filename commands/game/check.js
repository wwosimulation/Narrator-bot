const db = require("quick.db")
const shuffle = require("shuffle-array")
const { soloKillers, roles, getRole, getEmoji, fn, ids, wolfList } = require("../../config")

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
        if (!["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff", "Evil Detective", "Mortician", "Analyst", "Harbinger", "Lethal Seer"].includes(player.role) && !["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff", "Evil Detective", "Mortician", "Analyst", "Harbinger", "Lethal Seer"].includes(player.dreamRole)) return
        if (["Seer", "Aura Seer", "Spirit Seer", "Detective", "Wolf Seer", "Sorcerer", "Sheriff", "Evil Detective", "Mortician", "Analyst", "Harbinger", "Lethal Seer"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only check during the night right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if (player.role === "Analyst" && player?.lastChecked?.same === true && player?.lastChecked?.night === Math.floor(gamePhase / 3)) return await message.channel.send(`${getEmoji("analyst_blocked", client)} You checked two players that had the same aura yesterday. You are now blocked from checking tonight.`)
        if (!["Spirit Seer", "Sheriff", "Evil Detective"].includes(player.role) && player.uses === 0) return await message.channel.send("You already used up your ability!")
        if (args.length < 1) return await message.channel.send("Please select a player first.")
        if (!["Spirit Seer", "Detective", "Evil Detective", "Analyst"].includes(player.role) && args.length !== 1) return await message.channel.send("You need to select 1 player to check!")
        if (player.role === "Wolf Seer" && player.resign) return await message.channel.send("You already resigned from checking!")
        if (player.role === "Spirit Seer" && args.length > 2) return await message.channel.send("You can only select a maximum of 2 players to check!")
        if (["Detective", "Evil Detective", "Analyst"].includes(player.role) && args.length !== 2) return await message.channel.send("You need to select 2 players to investigate!")
        if (player.role === "Harbinger" && player.target && player.abilityType === "doom") return await message.channel.send("You have selected someone to doom! Please cancel that action using `+doom cancel` and run this command again!")
        if (player.role === "Lethal Seer" && gamePhase === 0) return await message.channel.send("You cannot use your ability during the first night!")
        if (player.role === "Lethal Seer" && player.lethal === true) return await message.channel.send("You can't check tonight as you have killed someone tonight!")

        let target = []

        if (args[0]?.toLowerCase() === "cancel") {
            if (["Harbinger", "Sheriff", "Spirit Seer", "Evil Detective"].includes(player.role)) {
                db.delete(`player_${player.id}.target`)
                db.delete(`player_${player.id}.abilityType`)
                message.channel.send(`${player.role === "Harbinger" ? getEmoji("herald", client) : player.role === "Spirit Seer" ? getEmoji("sscheck", client) : player.role === "Sheriff" ? getEmoji("snipe", client) : getEmoji("evildetcheck", client)} You succesfully canceled your action!`)
            }
        }

        target.push(players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0]))

        if (args.length > 1) target.push(players[Number(args[1]) - 1] || players.find((p) => p === args[1]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[1]))
        if (!target[0]) return message.channel.send(`I could not find the player with the query: \`${args[0]}\``)
        if (args.length > 1 && !target[1]) return message.channel.send(`I could not find the player with the query: \`${args[1]}\``)
        if (player.role !== "Mortician" && target.map((p) => db.get(`player_${p}`).status).filter((s) => s !== "Alive").length > 0) return message.channel.send("You need to select ALIVE players!")
        if (player.role === "Mortician") {
            let guy = db.get(`player_${target[0]}`)
            if (guy.status !== "Dead") return message.channel.send(`${getEmoji("fail_autopsy", client)} You need to select DEAD players to perform an autopsy!`)
            if (!players.includes(guy.killedBy?.toLowerCase())) return message.channel.send(`${getEmoji("fail_autopsy", client)} This player was not killed by an evil player!`)
            let attacker = db.get(`player_${guy.killedBy}`)
            let previousChecks = guy?.previousChecks || []
            if (attacker.team === "Village") return message.channel.send(`${getEmoji("fail_autopsy", client)} A villager killed this player! Please select another player.`)
            if (attacker.status !== "Alive" && guy.killedByWolf === false) return message.channel.send(`${getEmoji("fail_autopsy", client)} The killer of this player is dead!`)
            if (previousChecks.includes(guy.id)) return message.channel.send(`${getEmoji("fail_autopsy")} You already checked this player before!`)
            if (attacker.status !== "Alive" && guy.killedByWolf === true) {
                let allWolves = players.map((p) => db.get(`player_${p}`)).filter((p) => p.status === "Alive" && p.team === "Werewolf" && p.role !== "Werewolf Fan")

                if (allWolves.length === 0) return await channel.send(`${getEmoji("fail_autopsy", client)} The killer of this player is dead!`)

                let sortedWolves = allWolves.sort((a, b) => wolfList[a] - wolfList[b])
                shuffle(sortedWolves)
                attacker = sortedWolves[0]
            }
            let alivePlayers = db.get(`players`).filter((p) => db.get(`player_${p}`).status === "Alive" && p !== attacker.id && p !== player.id && db.get(`player_${p}`).role !== "President")
            if (alivePlayers.length === 0) return await channel.send(`${getEmoji("fail_autopsy", client)} There are not enough suspects!`)
            shuffle(alivePlayers)
            let suspects = []
            suspects.push(attacker.id)
            suspects.push(alivePlayers[Math.floor(Math.random() * alivePlayers.length)])
            if (attacker.team !== "Werewolf" && alivePlayers.length > 1) suspects.push(alivePlayers.filter((a) => a !== suspects[1])[Math.random() * (alivePlayers.length - 1)])
            suspects = suspects.sort((a, b) => players.indexOf(a) - players.indexOf(b))
            console.log(suspects)
            message.channel.send(`${getEmoji("autopsy", client)} Either ${suspects.map((a, i) => `**${players.indexOf(a) + 1} ${db.get(`player_${a}`).username}**${i === suspects.length - 2 ? " or" : i === suspects.length - 1 ? "" : ","}`).join(" ")} tried to kill **${players.indexOf(guy.id) + 1} ${guy.username}**!`)
            db.subtract(`player_${player.id}.uses`, 1)
            previousChecks.push(guy.id)
            db.set(`player_${player.id}.previousChecks`, previousChecks)
            return
        }
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
            if (guy.role === "Wolf Trickster" && guy.trickedRole) {
                ;({ aura, role, team } = guy.trickedRole)
            }

            result[`p${index + 1}`] = { aura, team, role }
        })

        if (player.role === "Seer") await message.channel.send(`${getEmoji("seer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Aura Seer") await message.channel.send(`${getEmoji("aura_seer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].aura.toLowerCase(), client)} ${result["p1"].aura})**!`)
        if (player.role === "Lethal Seer") await message.channel.send(`${getEmoji("lethal_seer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].aura.toLowerCase(), client)} ${result["p1"].aura})**!`)
        if (player.role === "Lethal Seer") db.set(`player_${player.id}.target`, target[0])
        if (player.role === "Analyst") await message.channel.send(`${getEmoji("analyst_check", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].aura.toLowerCase(), client)} ${result["p1"].aura})** and **${players.indexOf(target[1]) + 1} ${db.get(`player_${target[1]}`).username} (${getEmoji(result["p2"].aura.toLowerCase(), client)} ${result["p2"].aura})**. ${result["p1"].aura === result["p2"].aura ? "Because you checked two players that had the same aura, you won't be able to check tomorrow." : ""}`)
        if (player.role === "Analyst") {
            db.set(`player_${player.id}.lastChecked.same`, result["p1"].aura === result["p2"].aura)
            db.set(`player_${player.id}.lastChecked.night`, Math.floor(gamePhase / 3) + 1)
        }
        if (player.role === "Wolf Seer") await message.channel.send(`${getEmoji("wolf_seer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Wolf Seer") await wwchat.send(`${getEmoji("wolf_seer", client)} The Wolf Seer checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Sorcerer") await message.channel.send(`${getEmoji("sorcerer", client)} You checked **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username} (${getEmoji(result["p1"].role.toLowerCase().replace(/\s/g, "_"), client)} ${result["p1"].role})**!`)
        if (player.role === "Sorcerer") {
            let checkedPlayers = db.get(`player_${player.id}`)?.checkedPlayers || []
            checkedPlayers.push(target[0])
            db.set(`player_${player.id}.checkedPlayers`, checkedPlayers)
        }
        if (player.role === "Detective") {
            let results = result.p1.team === result.p2.team ? "belong to the same team" : "do not belong to the same team!"
            if ([result.p1.team, result.p2.team].includes("Solo")) result = "do not belong to the same team."
            await message.channel.send(`${getEmoji(results.startsWith("do") ? "detnotequal" : "detequal", client)} Player **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username}** and **${players.indexOf(target[1]) + 1} ${db.get(`player_${target[1]}`).username}** __${results}__`)
        }

        if (player.role !== "Evil Detective") db.subtract(`player_${player.id}.uses`, 1)

        if (player.role === "Spirit Seer") {
            db.set(`player_${player.id}.target`, target)
            await message.channel.send(`${getEmoji("sscheck", client)} You decided to check **${target.map((s) => `${players.indexOf(s) + 1} ${db.get(`player_${s}`).username}`).join("** and **")}**!`)
        }

        if (player.role === "Sheriff") {
            db.set(`player_${player.id}.target`, target[0])
            await message.channel.send(`${getEmoji("snipe", client)} You decided to look out for **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username}**!`)
        }

        if (player.role === "Evil Detective") {
            db.set(`player_${player.id}.target`, target)
            await message.channel.send(`${getEmoji("evildetcheck", client)} You have decided to investigate **${target.map((p) => `${players.indexOf(p) + 1} ${db.get(`player_${p}`).username}`).join("** and **")}**. These players will be killed if they belong to different teams!`)
        }

        if (player.role === "Harbinger") {
            db.set(`player_${player.id}.target`, target[0])
            db.set(`player_${player.id}.abilityType`, "herald")
            await message.channel.send(`${getEmoji("herald", client)} You have decided to check **${players.indexOf(target[0]) + 1} ${db.get(`player_${target[0]}`).username}**!`)
        }
    },
}
