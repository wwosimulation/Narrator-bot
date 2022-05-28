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
        let mid = db.get("entermsg")
        if (mid && !client.user.username.includes("Beta")) {
            message.guild.channels.cache
                .find((x) => x.name == "enter-game")
                .messages.fetch(mid)
                .then((m) => {
                    let allc = m.components[0]
                    allc[0].disabled = true
                    m.edit({ components: [{ type: 1, components: allc }] })
                })
        }

        let alive = message.guild.roles.cache.find(r => r.name === "Alive")
        let dead = message.guild.roles.cache.find(r => r.name === "Dead")
        let players = db.get(`players`)

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
        let graveRobbers = players.filter(p => db.get(`player_${p}`).role === "Grave Robber")

        // loop through each grave robber
        for (let gr of graveRobbers) {
             
            // filter through each player to see if they meet the requirement to be a grave robber's target
            let eligiblePlayers = players.filter(p => !["Mayor", "Flower Child", "Pacifist", "Cursed", "Jailor", "Marksman", "Cupid", "Medium", "Seer", "Seer Apprentice", "Detective", "President", "Kitten Wolf", "Wolf Pacifist", "Wolf Seer", "Sect Leader", "Zombie", "Bandit", "Headhunter"].includes(db.get(`player_${p}`).role) && p !== gr)

            // if there are no eligible players, tell the narrator and the player that there were no valid targets
            if (eligiblePlayers.length === 0) {
                let chan = db.get(`player_${gr}.channel`)
                await message.channel.send(`Player ${players.indexOf(gr)+1} does not have a valid target!`)
                await message.guild.channels.cache.get(chan)?.send("You don't have any valid targets to rob! You belong to the Village team.")
            } else {    

                // there were eligible targets, so set the target.
                shuffle(eligiblePlayers)
                db.set(`player_${gr}.target`, eligiblePlayers[0])

                // send the message to the player and the narrator
                await message.channel.send(`${getEmoji(client, "grave_robber")} Player ${players.indexOf(gr)+1}'s target is ${players.indexOf(eligiblePlayers[0])+1}`)
                await message.guild.channels.cache.get(chan)?.send(`${getEmoji(client, "grave_robber")} Your target is **${players.indexOf(eligiblePlayers[0])+1} ${message.guild.members.cache.get(eligiblePlayers[0])?.user.username}**`)
            }
        }


        // give all targets for hh
        let headhunters = players.filter(p => db.get(`player_${p}`).role === "Headhunter")
        
        for (let hh of headhunters) {
        
            // filter through each player to see if they meet the requirement to be a headhunter's target
            let stage1 = players.filter(p => p !== hh && !["Gunner", "Priest", "Mayor", "Vigilante", "Grave Robber", "Cupid", "President", "Cursed"].includes(db.get(`player_${p}`).role))
            let stage2 = players.filter(p => p !== hh && ["Gunner", "Priest", "Mayor", "Vigilante"].includes(db.get(`player_${p}`).role))
            let stage3 = players.filter(p => p !== hh && db.get(`player_${p}`).team === "Werewolf")
            let stage4 = players.filter(p => p !== hh && !["Village", "Werewolf"].includes(db.get(`player_${p}`).team))
            let stage5 = players.filter(p => p !== hh && db.get(`player_${p}`).role === "Headhunter")
            let stage6 = players.filter(p => p !== hh && db.get(`player_${p}`).role === "Fool")
            let obj = { stage1, stage2, stage3, stage4, stage5, stage6 }

            // go through each stage
            let counter = 1 // set the counter 1

            while (counter <= 6) { // while the counter is below 6, keep looping

                // check if the stage has at least 1 valid player.
                if (obj[`stage${counter}`].length > 0) { 
                    let stage = obj[`stage${counter}`] // make a copy of the stage 
                    counter = 10 // make the counter to 10 so it stops looping
                    shuffle(stage) // shuffle the players
                    db.set(`player_${hh}.target`, stage[0]) // set the target
                    let chan = db.get(`player_${hh}.channel`)
                    await message.channel.send(`${getEmoji(client, "headhunter")} Player ${players.indexOf(hh)+1}'s target is ${players.indexOf(stage[0])+1}`)
                    await message.guild.channels.cache.get(chan)?.send(`${getEmoji(client, "headhunter")} Your target is **${players.indexOf(stage[0])+1} ${message.guild.members.cache.get(stage[0])?.user.username}**`)
                }
                counter++
            }

            // if there are no eligible players, tell the narrator and the player that there were no valid targets
            if (counter < 10) {
                let chan = db.get(`player_${hh}.channel`)
                await message.channel.send(`Player ${players.indexOf(hh)+1} does not have a valid target! They are now a villager.`)
                await message.guild.channels.cache.get(chan)?.send("You don't have any valid targets to lynch! You now belong to the Village team.")
            }
        }

        // reveal any presidents if there is one
        let presidents = players.filter(p => db.get(`player_${p}`).role === "President")
        presidents.forEach(async pres => {
            if (presidents.length > 1) { // future game mode
                // code for a future gamemode i have an idea for
            } else {
                await message.guild.channels.cache.find(c => c.name === "day-chat")?.send(`${getEmoji(client, "president")} Player **${players.indexOf(pres)+1} ${message.guild.members.cache.get(pres)?.user.username}** is your President`)
            }
            
        })

        // give teams their channels

        // teams
        let wolves = players.filter(p => db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Sorcerer")
        let zombies = players.filter(p => db.get(`player_${p}`).team === "Zombie")
        let sects = players.filter(p => db.get(`player_${p}`).team === "Sect")
        let bandits = players.filter(p => db.get(`player_${p}`).team === "Bandit")
        let siblings = players.filter(p => db.get(`player_${p}`).role === "Sibling")
        
        // get the chats 
        let wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
        let zombchat = message.guild.channels.cache.find(c => c.name === "zombies-chat")
        let sibchat = message.guild.channels.cache.find(c => c.name === "siblings-chat")

        // perms
        wolves.forEach(async wolf => { await wwchat.permissionOverwrites.edit(wolf, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true }) })
        zombchat.forEach(async zomb => { await wwchat.permissionOverwrites.edit(zomb, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true }) })
        sibchat.forEach(async sib => { await wwchat.permissionOverwrites.edit(sib, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true }) })

        // create channels + perms
        bandits.forEach(async bandit => {
            let bchat = await message.guild.channels.create("bandits")
            await bchat.permissionOverwrites.edit(bandit, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
            db.set(`player_${bandit}.banditChannel`, bchat.id)
        })

        sects.forEach(async sl => {
            let schat = await message.guild.channels.create("sect")
            await schat.permissionOverwrites.edit(sl, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
            db.set(`player_${sl}.sectChannel`, schat.id)
        })

        await message.channel.send("The game has started! Ping @Alive in #day-chat when you are ready to start Night 1")

        await client.channels.cache.find((c) => c.id === "606123818305585167").send("Game is starting. You can no longer join. Feel free to spectate!")

        let gamemode = db.get(`gamemode`)

        await message.guild.channels.cache.find((x) => x.name == "enter-game").send(`A ${gamemode} game has started, you can no longer join. Feel free to spectate!`)

        db.set("started", "yes")
        db.delete(`gamemode`)

    }
}
