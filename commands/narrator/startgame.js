const db = require("quick.db")
const shuffle = require("shuffle-array")
const { getEmoji } = require("../../config")

module.exports = {
    name: "startgame",
    description: "Start the game.",
    usage: `${process.env.PREFIX}startgame`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        // disable the buttons to avoid others from joining (not for beta tho)
        client.commands.get("disable").run(message, ["join"], client)

        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let players = db.get(`players`) || []

        if (players.length === 0) return await message.channel.send("There are literally no players. What are you even trying to start?")
        if (players.map((a) => db.get(`player_${a}`)).filter(Boolean).length !== alive.members.size) return await message.channel.send("The number of players that have a role doesn't equal to the number of people that are playing right now!")

        // set the default stuff
        db.set(`gamePhase`, 0)
        db.set(`wwsVote`, "yes")
        db.set(`commandEnabled`, "no")
        db.delete(`kittenWolfConvert`)

        // a function to send a message after a certain time.
        const startMessage = (time, msg) => {
            setTimeout(async () => {
                message.guild.channels.cache.find((c) => c.name === "game-lobby").send(msg)
            }, time)
        }

        // send the starting message
        startMessage(0, "Game starting in 5 ...")
        startMessage(1000, "4")
        startMessage(2000, "3")
        startMessage(3000, "2")
        startMessage(4000, "1")

        // change the permissions for game-lobby after 5 seconds
        setTimeout(async () => {
            message.guild.channels.cache
                .find((c) => c.name === "game-lobby")
                .permissionOverwrites.edit(alive.id, {
                    SEND_MESSAGES: false,
                    READ_MESSAGE_HISTORY: false,
                    VIEW_CHANNEL: false,
                })
        }, 5000)

        // give all targets for grs
        let graveRobbers = players.filter((p) => db.get(`player_${p}`).role === "Grave Robber")

        // loop through each grave robber
        for (let gr of graveRobbers) {
            // filter through each player to see if they meet the requirement to be a grave robber's target
            let eligiblePlayers = players.filter((p) => !["Mayor", "Flower Child", "Pacifist", "Cursed", "Jailor", "Marksman", "Cupid", "Medium", "Seer", "Seer Apprentice", "Detective", "President", "Kitten Wolf", "Wolf Pacifist", "Wolf Seer", "Sect Leader", "Zombie", "Bandit", "Headhunter"].includes(db.get(`player_${p}`).role) && p !== gr)

            // if there are no eligible players, tell the narrator and the player that there were no valid targets
            let chan = db.get(`player_${gr}.channel`)
            if (eligiblePlayers.length === 0) {
                await message.channel.send(`Player ${players.indexOf(gr) + 1} does not have a valid target!`)
                await message.guild.channels.cache.get(chan)?.send("You don't have any valid targets to rob! You belong to the Village team.")
            } else {
                // there were eligible targets, so set the target.
                shuffle(eligiblePlayers)
                db.set(`player_${gr}.target`, eligiblePlayers[0])

                // send the message to the player and the narrator
                await message.channel.send(`${getEmoji("grave_robber", client)} Player ${players.indexOf(gr) + 1}'s target is ${players.indexOf(eligiblePlayers[0]) + 1}`)
                await message.guild.channels.cache.get(chan)?.send(`${getEmoji("grave_robber", client)} Your target is **${players.indexOf(eligiblePlayers[0]) + 1} ${message.guild.members.cache.get(eligiblePlayers[0])?.user.username}**`)
            }
        }

        // give all targets for hh
        let headhunters = players.filter((p) => db.get(`player_${p}`).role === "Headhunter")

        for (let hh of headhunters) {
            // filter through each player to see if they meet the requirement to be a headhunter's target
            let stage1 = players.filter((p) => p !== hh && db.get(`player_${p}`).team === "Village" && !["Gunner", "Priest", "Mayor", "Vigilante", "Grave Robber", "Cupid", "President", "Cursed", "Pacifist", "Flower Child"].includes(db.get(`player_${p}`).role))
            let stage2 = players.filter((p) => p !== hh && ["Gunner", "Priest", "Mayor", "Vigilante", "Cursed", "President"].includes(db.get(`player_${p}`).role))
            let stage3 = players.filter((p) => p !== hh && db.get(`player_${p}`).team === "Werewolf")
            let stage4 = players.filter((p) => p !== hh && !["Village", "Werewolf"].includes(db.get(`player_${p}`).team))
            let stage5 = players.filter((p) => p !== hh && db.get(`player_${p}`).role === "Headhunter")
            let stage6 = players.filter((p) => p !== hh && db.get(`player_${p}`).role === "Fool")
            let obj = { stage1, stage2, stage3, stage4, stage5, stage6 }

            // go through each stage
            let counter = 1 // set the counter 1

            while (counter <= 6) {
                // while the counter is below 6, keep looping

                // check if the stage has at least 1 valid player.
                if (obj[`stage${counter}`].length > 0) {
                    let stage = obj[`stage${counter}`] // make a copy of the stage
                    counter = 10 // make the counter to 10 so it stops looping
                    shuffle(stage) // shuffle the players
                    db.set(`player_${hh}.target`, stage[0]) // set the target
                    let chan = db.get(`player_${hh}.channel`)
                    await message.channel.send(`${getEmoji("headhunter", client)} Player ${players.indexOf(hh) + 1}'s target is ${players.indexOf(stage[0]) + 1}`)
                    await message.guild.channels.cache.get(chan)?.send(`${getEmoji("headhunter", client)} Your target is **${players.indexOf(stage[0]) + 1} ${message.guild.members.cache.get(stage[0])?.user.username}**`)
                }
                counter++
            }

            // if there are no eligible players, tell the narrator and the player that there were no valid targets
            if (counter < 10) {
                let chan = db.get(`player_${hh}.channel`)
                await message.channel.send(`Player ${players.indexOf(hh) + 1} does not have a valid target! They are now a villager.`)
                await message.guild.channels.cache.get(chan)?.send("You don't have any valid targets to lynch! You now belong to the Village team.")
            }
        }

        // give a fake role to the sorcerer
        let sorcerers = players.filter((p) => db.get(`player_${p}`).role === "Sorcerer")
        sorcerers.forEach(async (sorc) => {
            let investigativeRoles = ["Analyst", "Aura Seer", "Detective", "Mortician", "Red Lady", "Seer", "Seer Apprentice", "Sheriff", "Spirit Seer", "Violinist"]
            let allRoles = players.map((p) => db.get(`player_${p}`).role).filter((r) => investigativeRoles.includes(r))
            let channel = message.guild.channels.cache.get(db.get(`player_${sorc}`)?.channel)
            if (allRoles.length > 0) {
                shuffle(allRoles)
                db.set(`player_${sorc}.fakeRole`, allRoles[0])
                channel?.send(`${getEmoji("sorcerer", client)} Your fake investigative role is **${getEmoji(allRoles[0]?.toLowerCase().replace(/\s/g, "_"), client)} ${allRoles[0]}**!`)
            } else {
                shuffle(investigativeRoles)
                db.set(`player_${sorc}.fakeRole`, investigativeRoles[0])
                channel?.send(`${getEmoji("sorcerer", client)} Your fake investigative role is **${getEmoji(investigativeRoles[0]?.toLowerCase().replace(/\s/g, "_"), client)} ${investigativeRoles[0]}**!`)
            }
        })

        // reveal any presidents if there is one
        let presidents = players.filter((p) => db.get(`player_${p}`).role === "President")
        presidents.forEach(async (pres) => {
            if (presidents.length > 1) {
                // future game mode
                // code for a future gamemode i have an idea for
            } else {
                await message.guild.channels.cache.find((c) => c.name === "day-chat")?.send(`${getEmoji("president", client)} Player **${players.indexOf(pres) + 1} ${message.guild.members.cache.get(pres)?.user.username}** is your President`)
                await message.guild.channels.cache.find((c) => c.name === "day-chat")?.send(`${message.guild.roles.cache.find((r) => r.name === "Alive")}`)
            }
        })

        // if there are instigators, make the recruits
        let instigators = players.filter((p) => db.get(`player_${p}`).role === "Instigator")
        instigators.forEach(async (insti) => {
            let recruit1 = players.filter(p => (["Fool", "Headhunter"].includes(db.get(`player_${p}`).role) || db.get(`player_${p}`).team === "Village") && db.get(`player_${p}`).role !== "President")
            let recruit2 = players.filter(p => db.get(`player_${p}`).team !== "Village" && !["Fool", "Headhunter", "Instigator"].includes(db.get(`player_${p}`).role))
            shuffle(recruit1)
            shuffle(recruit2)
            player1 = recruit1.length > 0 ? recruit1[0] : recruit2[1]
            player2 = recruit2.length > 0 ? recruit2[0] : recruit1[1]
            let existingInstis1 = db.get(`player_${player1}`).instigator || []
            let existingInstis2 = db.get(`player_${player2}`).instigator || []
            existingInstis1.push(insti)
            existingInstis2.push(insti)
            db.set(`player_${player1}.instigator`, existingInstis1)
            db.set(`player_${player2}.instigator`, existingInstis2)
            db.set(`player_${insti}.target`, [player1, player2])
            let channel1 = message.guild.channels.cache.get(db.get(`player_${player1}`)?.channel)
            let channel2 = message.guild.channels.cache.get(db.get(`player_${player2}`)?.channel)
            let channel = mesage.guild.channels.cache.get(db.get(`player_${insti}`)?.channel)
            let player = db.get(`player_${insti}`)
            let rec1 = db.get(`player_${player1}`)
            let rec2 = db.get(`player_${recruit2}`) 
            channel1?.send(`${getEmoji("insigator", client)} You have been recruited by **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("instigator", client)} Instigator)** and you have been instigated with **${players.indexOf(rec2.id)+1} ${rec2.username} (${getEmoji(rec2.role.toLowerCase().replace(/\s/g, "_"), client)} ${rec2.role})**! You now have to win with the Instigator and the recruits and you can no longer win with your original team.`)
            channel2?.send(`${getEmoji("insigator", client)} You have been recruited by **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("instigator", client)} Instigator)** and you have been instigated with **${players.indexOf(rec1.id)+1} ${rec1.username} (${getEmoji(rec1.role.toLowerCase().replace(/\s/g, "_"), client)} ${rec1.role})**! You now have to win with the Instigator and the recruits and you can no longer win with your original team.`)
            channel?.send(`${getEmoji("insigator", client)} You have instigated **${players.indexOf(rec1.id)+1} ${rec1.username}** and **${players.indexOf(rec2.id)+1} ${rec2.username}**! During the day, you can send a private message to your team using the \`+chat\`. Good luck!`)
            
        })


        // make everyone alive
        players.forEach((p) => {
            db.set(`player_${p}.status`, "Alive")
        })

        // give teams their channels

        // teams
        let wolves = players.filter((p) => db.get(`player_${p}`).team === "Werewolf" && !["Werewolf Fan", "Sorcerer"].includes(db.get(`player_${p}`).role))
        let zombies = players.filter((p) => db.get(`player_${p}`).team === "Zombie")
        let sects = players.filter((p) => db.get(`player_${p}`).team === "Sect")
        let bandits = players.filter((p) => db.get(`player_${p}`).team === "Bandit")
        let siblings = players.filter((p) => db.get(`player_${p}`).role === "Sibling")

        // get the chats
        let wwchat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let zombchat = message.guild.channels.cache.find((c) => c.name === "zombies-chat")
        let sibchat = message.guild.channels.cache.find((c) => c.name === "siblings-chat")

        // perms
        wolves.forEach(async (wolf) => {
            await wwchat.permissionOverwrites.edit(wolf, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
        })
        wolves.forEach(async (wolf) => {
            await message.guild.channels.cache.find((x) => x.name === "ww-vote").permissionOverwrites.edit(wolf, { SEND_MESSAGES: false, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
        })
        zombies.forEach(async (zomb) => {
            await zombchat.permissionOverwrites.edit(zomb, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
        })
        siblings.forEach(async (sib) => {
            await sibchat.permissionOverwrites.edit(sib, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
        })

        // create channels + perms
        bandits.forEach(async (bandit) => {
            let bchat = await message.guild.channels.create("bandits", { parent: "892046232111964170" })
            await bchat.permissionOverwrites.edit(bandit, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
            await bchat.permissionOverwrites.edit(alive.id, { SEND_MESSAGES: false, VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false })
            await bchat.permissionOverwrites.edit(dead.id, { SEND_MESSAGES: false, VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false })

            db.set(`player_${bandit}.banditChannel`, bchat.id)
        })

        sects.forEach(async (sl) => {
            let schat = await message.guild.channels.create("sect", { parent: "892046232111964170" })
            await schat.permissionOverwrites.edit(sl, { SEND_MESSAGES: false, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
            await schat.permissionOverwrites.edit(alive.id, { SEND_MESSAGES: false, VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false })
            await schat.permissionOverwrites.edit(dead.id, { SEND_MESSAGES: false, VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false })
            db.set(`player_${sl}.sectChannel`, schat.id)
        })

        // add uses
        players.forEach((p) => {
            let guy = db.get(`player_${p}`)
            if (["Gunner", "Marksman", "Fortune Teller", "Nightmare Werewolf"].includes(guy.role)) db.set(`player_${p}.uses`, 2)
            if (["Seer", "Aura Seer", "Detective", "Cannibal", "Jailer", "Priest", "Witch", "Santa Claus", "Shadow Wolf", "Werewolf Berserk", "Ghost Lady", "Pacifist", "Mayor", "Medium", "Ritualist", "Hacker", "Prognosticator", "Wolf Trickster", "Warden"].includes(guy.role)) db.set(`player_${p}.uses`, 1)
            if (guy.role === "Forger") db.set(`player_${p}.uses`, 3)
            if (guy.role === "Witch") db.set(`player_${p}.usesK`, 1)
            if (guy.role === "Prognosticator") db.set(`player_${p}.usesT`, 1)
            if (guy.role === "Easter Bunny") db.set(`player_${p}.uses`, 4)
            if (guy.role === "Voodoo Werewolf") db.set(`player_${p}.usesM`, 2)
            if (guy.role === "Voodoo Werewolf") db.set(`player_${p}.usesN`, 1)
            if (guy.role === "Bodyguard") db.set(`player_${p}.lives`, 2)
            if (guy.role !== "Bodyguard") db.set(`player_${p}.lives`, 1)

            if (guy.role === "Wolf Seer" && players.filter((c) => db.get(`player_${c}`).team === "Werewolf" && db.get(`player_${c}`).role !== "Werewolf Fan").length === 1) {
                db.set(`player_${guy.id}.resign`, true)
                message.guild.channels.cache.get(guy.channel).send("Since you are the last wolf alive, you automatically resign and can vote with the wolves!")
            }
        })

        await message.channel.send("The game has started! Ping @Alive in #day-chat when you are ready to start Night 1")

        let gamemode = db.get(`gamemode`)

        let droppy = { type: 3, custom_id: "wolves-vote", options: [] }
        for (const p of players) {
            if (db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan") continue
            droppy.options.push({ label: `${players.indexOf(p) + 1} ${db.get(`player_${p}`).username}`, value: `votefor-${players.indexOf(p) + 1}`, description: `${db.get(`player_${p}`).username}` })
        }

        if (!(players.filter((p) => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan" && db.get(`player_${p}`).status === "Alive").length === players.filter((p) => db.get(`player_${p}`).status === "Alive"))) {
            if (players.filter((p) => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan").length > 0) {
                await message.guild.channels.cache.find((x) => x.name === "ww-vote").send({ content: `${message.guild.roles.cache.find((r) => r.name === "Alive")} Time to vote!`, components: [{ type: 1, components: [droppy] }] })
            }
        }

        client.channels.cache.find((x) => x.id == "606123818305585167")?.send(`A ${gamemode} game has started, you can no longer join. Feel free to spectate!`)

        await message.guild.channels.cache.find((x) => x.name == "enter-game").send(`A ${gamemode} game has started, you can no longer join. Feel free to spectate!`)

        db.set("started", "yes")
        db.delete(`gamemode`)
    },
}
