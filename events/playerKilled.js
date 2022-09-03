const db = require("quick.db")
const { getEmoji, getRole } = require("../config")

function getPhase() {
    const gamePhase = db.get(`gamePhase`)
    const voting = db.get(`commandEnabled`)
    let time = gamePhase % 3 === 0 ? "night" : voting === true ? "voting" : "day"
    let date = Math.floor(gamePhase / 3) + 1
    return { during: time, on: date, raw: gamePhase }
}

module.exports = async (client) => {
    client.on("playerKilled", async (guy, attacker, options) => {
        const phase = getPhase()
        const guild = client.guilds.cache.get("890234659965898813")
        const dayChat = guild.channels.cache.find((c) => c.name === "day-chat")
        const players = db.get(`players`) || []
        const doppelgangers = players.filter((p) => db.get(`player_${p}`).role === "Doppelganger" && db.get(`player_${p}`).status === "Alive")
        const splitwolfs = players.filter((p) => db.get(`player_${p}`).role === "Split Wolf" && db.get(`player_${p}`).status === "Alive")
        const redladies = players.filter((p) => db.get(`player_${p}`).role === "Red Lady" && db.get(`player_${p}`).status === "Alive")
        const preachers = players.filter((p) => db.get(`player_${p}`).role === "Preacher" && db.get(`player_${p}`).status === "Alive")
        const tricksters = players.filter((p) => db.get(`player_${p}`).role === "Wolf Trickster" && db.get(`player_${p}`).status === "Alive")
        const ritualists = players.filter((p) => db.get(`player_${p}`).role === "Ritualist" && db.get(`player_${p}`).status === "Alive")
        const trappers = players.filter((p) => db.get(`player_${p}`).role === "Trapper" && db.get(`player_${p}`).status === "Alive")
        const astralwolves = players.filter((p) => db.get(`player_${p}`).role === "Astral Wolf")
        const seerappprentices = players.filter((p) => db.get(`player_${p}`).role === "Seer Apprentice" && db.get(`player_${p}`).status === "Alive")
        const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
        const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        const stubbornWerewolves = require("../commands/narrator/day/killingActions/protection/stubbornWolves.js") // stubborn ww

        guild.members.fetch(guy.id).then((a) => {
            if (a.roles.cache.has("892046205780131891")) a.roles.remove("892046205780131891")
        })

        db.set(`player_${guy.id}.killedBy`, typeof attacker === "string" ? attacker : attacker.id)
        db.set(`player_${guy.id}.killedDuring`, phase.during)
        db.set(`player_${guy.id}.killedOn`, phase.on)
        db.set(`player_${guy.id}.killedByWolf`, options?.werewolfKill ? true : false)

        db.delete(`player_${guy.id}.corrupted`)
        db.delete(`player_${guy.id}.poisoned`)

        // ritualist set to revive
        for (const ritualist of ritualists) {
            let player = db.get(`player_${ritualist}`)
            if (player.target !== guy.id) continue
            let channel = guild.channels.cache.get(db.get(`player_${player.target}`)?.channel)
            channel?.send(`${getEmoji("ritualist_revive", client)} Hey there, don't go offline just yet! The Ritualist has selected to revive you. You will be revived after a full phase.`)
            channel?.send(`${guild.roles.cache.find((r) => r.name === "Dead")}`)
            db.subtract(`player_${ritualist}.uses`, 0)
            db.set(`player_${player.target}.ritualRevive`, phase.raw + 2)
            db.delete(`player_${ritualist}.target`)
        }

        if (guy.team === "Village") {
            for (const preacher of preachers) {
                let player = db.get(`player_${preacher}`)
                if (player.preachVotes === 3) continue // maximum additional votes is 3
                let channel = guild.channels.cache.get(player.channel) // get the channel
                db.add(`player_${preacher}.preachVotes`, 1) // add into the database an additional vote
                await channel?.send(`The villagers have mistakenly lynched one of their own!\nYou get an additional permanent vote.`)
                await channel?.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
            }
        }

        if (guy.role === "Sect Leader") {
            let members = guy.sectMembers?.filter((p) => db.get(`player_${p}`).status === "Alive") || []
            members.forEach(async (p) => {
                let player = db.get(`player_${p}`)
                let member = await guild.members.fetch(player.id)
                let memberRoles = member.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                db.set(`player_${p}.status`, "Dead")
                let role = player.role
                if (player.tricked) role = "Wolf Trickster"
                await dayChat.send(`${getEmoji("sect_member", client)} Sect member **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** fled the village!`)
                await member.roles.set(memberRoles)
                client.emit("playerKilled", player, guy)
            })
        }

        if (guy.role === "Mad Scientist") {
            let alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive" || p === guy.id)
            let player1 = alivePlayers[alivePlayers.indexOf(guy.id) - 1] || alivePlayers[alivePlayers.length - 1]
            let player2 = alivePlayers[alivePlayers.indexOf(guy.id) + 1] || alivePlayers[0]

            if (player1 === player2) {
                // check if the player is stubborn wolf that has 2 lives
                let getResult = await stubbornWerewolves(client, db.get(`player_${player1}`)) // checks if the player is stubborn wolf and has 2 lives
                if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives

                let member = await guild.members.fetch(player1)
                let memberRoles = member.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                let guy1 = db.get(`player_${player1}`)
                let role = guy1.role
                if (guy1.tricked) role = "Wolf Trickster"
                db.set(`player_${player1}.status`, "Dead")
                await dayChat.send(`${getEmoji("toxic", client)} The Mad Scientist released a toxic gas and killed **${players.indexOf(player1) + 1} ${db.get(`player_${player1}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`)
                await member.roles.set(memberRoles)
                client.emit("playerKilled", db.get(`player_${player1}`), guy)
            } else {
                // check if the player is stubborn wolf that has 2 lives
                let getResult = await stubbornWerewolves(client, db.get(`player_${player1}`)) // checks if the player is stubborn wolf and has 2 lives
                if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                // check if the player is stubborn wolf that has 2 lives
                getResult = await stubbornWerewolves(client, db.get(`player_${player2}`)) // checks if the player is stubborn wolf and has 2 lives
                if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                let member1 = await guild.members.fetch(player1)
                let memberRoles1 = member1.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                let guy1 = db.get(`player_${player1}`)
                let role = guy1.role
                if (guy1.tricked) role = "Wolf Trickster"
                db.set(`player_${player1}.status`, "Dead")
                await dayChat.send(`${getEmoji("toxic", client)} The Mad Scientist released a toxic gas and killed **${players.indexOf(player1) + 1} ${db.get(`player_${player1}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`)
                await member1.roles.set(memberRoles)
                client.emit("playerKilled", db.get(`player_${player1}`), guy)
                let member2 = await guild.members.fetch(player1)
                let memberRoles2 = member2.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                let guy2 = db.get(`player_${player2}`)
                role = guy2.role
                if (guy2.tricked) role = "Wolf Trickster"
                db.set(`player_${player2}.status`, "Dead")
                await dayChat.send(`${getEmoji("toxic", client)} The Mad Scientist released a toxic gas and killed **${players.indexOf(player2) + 1} ${db.get(`player_${player2}`).username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})**!`)
                await member2.roles.set(memberRole2)
                client.emit("playerKilled", db.get(`player_${player2}`), guy)
            }
        }

        if (guy.role === "Split Wolf") {
            let target = db.get(`player_${guy.target}`)
            if (!target) return
            if (target.status !== "Alive") return
            db.set(`player_${target.id}.status`, "Dead")
            let member = await guild.members.fetch(target.id)
            await member.roles.set(member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)))
            await dayChat.send(`${getEmoji("bind", client)} **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji(target.role.toLowerCase().replace(/\s/g, "_"), client)} ${target.role})** was killed because their soul was bounded to a split wolf that died.`)
            client.emit("playerKilled", db.get(`player_${target.id}`), db.get(`player_${guy.id}`), { trickster: false })
        }

        if (guy.role === "Loudmouth") {
            if (guy.target) {
                let player = db.get(`player_${guy.target}`) || { status: "Dead" }
                if (player.status === "Alive") {
                    let member = await guild.members.fetch(player.id)
                    await dayChat.send(`${getEmoji("loudmouthed", client)} The Loudmouth's last will was to reveal **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})**.`)
                }
            }
        }

        if (["Avenger", "Junior Werewolf"].includes(guy.role)) {
            if (guy.target) {
                let player = db.get(`player_${guy.target}`) || { status: "Dead" }
                if (player.status === "Alive") {
                    // check if the player is stubborn wolf that has 2 lives
                    let getResult = await stubbornWerewolves(client, player) // checks if the player is stubborn wolf and has 2 lives
                    if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                    let member = await guild.members.fetch(player.id)
                    let memberRoles = member.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                    db.set(`player_${guy.target}.status`, "Dead")
                    let role = player.role
                    if (player.tricked && guy.role !== "Junior Werewolf") role = "Wolf Trickster"
                    await dayChat.send(`${getEmoji(guy.role === "Avenger" ? "avenge" : "jwwtag", client)} ${guy.role === "Avenger" ? "The Avenger avenged" : `The Junior Werewolf's death has been avenged!`} **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** ${guy.role === "Avenger" ? "" : " is dead"}!`)
                    await member.roles.set(memberRoles)
                    client.emit("playerKilled", player, guy, { trickster: guy.role === "Avenger" ? true : false })
                }
            }
        }

        if (guy.cupid) {
            db.get(`player_${guy.cupid}`).forEach(async (p) => {
                let target = db.get(`player_${p}`).target.filter((a) => a !== guy.id)
                let player = db.get(`player_${target}`)
                if (player.status === "Alive") {
                    // check if the player is stubborn wolf that has 2 lives
                    let getResult = await stubbornWerewolves(client, player) // checks if the player is stubborn wolf and has 2 lives
                    if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                    let member = await guild.members.fetch(player.id)
                    let memberRoles = member.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                    db.set(`player_${target}.status`, "Dead")
                    db.delete(`player_${p}.target`)
                    let role = player.role
                    if (player.tricked) role = "Wolf Trickster"
                    await dayChat.send(`${getEmoji("couple", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** lost the love of their life and fled the village!`)
                    await member.roles.set(memberRoles)
                    client.emit("playerKilled", db.get(`player_${target}`), guy)
                }
            })
        }

        if (guy.instigator) {
            db.get(`player_${guy.id}`).instigator.forEach(async (p) => {
                let target = db.get(`player_${p}`).target.filter((a) => a !== guy.id)
                let player = db.get(`player_${target}`)
                if (player.status === "Alive") {
                    // check if the player is stubborn wolf that has 2 lives
                    let getResult = await stubbornWerewolves(client, player) // checks if the player is stubborn wolf and has 2 lives
                    if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                    let member = await guild.members.fetch(player.id)
                    let memberRoles = member.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                    db.set(`player_${target}.status`, "Dead")
                    db.delete(`player_${p}.target`)
                    let role = player.role
                    if (player.tricked) role = "Wolf Trickster"
                    await dayChat.send(`${getEmoji("instigator", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** was instigated with another player who died so they fled the village!`)
                    await member.roles.set(memberRoles)
                    client.emit("playerKilled", db.get(`player_${target}`), guy)
                }
            })
        }

        if (guy.chained) {
            guy.chained?.forEach(async (chain) => {
                let target = db.get(`player_${chain}`)
                if (target?.status !== "Alive") return
                // check if the player is stubborn wolf that has 2 lives
                let getResult = await stubbornWerewolves(client, target) // checks if the player is stubborn wolf and has 2 lives
                if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                let member = await guild.members.fetch(target.id)
                let memberRoles = member.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                db.set(`player_${target.id}.status`, "Dead")
                let role = target.role
                if (target.tricked) role = "Wolf Trickster"
                await dayChat.send(`${getEmoji("astral_chain", client)} Player **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** was chained to another player by the Astral Wolf and has died!`)
                await member.roles.set(memberRoles)
                client.emit("playerKilled", db.get(`player_${chain}`), guy)
            })
        }

        if (guy.tricked) {
            if (options?.trickster !== false) {
                let wwtrick = tricksters.find((p) => db.get(`player_${p}`).target === guy.id)
                if (wwtrick) {
                    let channel = guild.channels.cache.get(db.get(`player_${wwtrick}`).channel)
                    channel.send(`${getEmoji("wolf_trickster_swap", client)} Your target **${players.indexOf(guy.id) + 1} ${guy.username} (${getEmoji(guy.role.toLowerCase().replace(/\s/g, "_"), client)} ${guy.role})** has died. You will be now seen as **${getEmoji(guy.role.toLowerCase().replace(/\s/g, "_"), client)} ${guy.role}** during the night.`)
                    channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
                    db.subtract(`player_${wwtrick}.uses`, 1)
                    db.set(`player_${wwtrick}.trickedRole`, { role: guy.role, aura: guy.aura, team: guy.team })
                }
            }
        }

        if (guy.role === "Kitten Wolf") {
            require("../commands/narrator/day/killingActions/wolves.js").triggerKittenWolf(client)
        }

        // doppelgangers
        for (const doppel of doppelgangers) {
            let player = db.get(`player_${doppel}`) || { status: "Dead" }
            let target = db.get(`player_${player.target}`)

            if (player.target === guy.id) {
                // set the previous roles
                let previousRoles = player.allRoles || [player.role]
                previousRoles.push(target.role)
                db.set(`player_${guy.id}.allRoles`, previousRoles)

                db.delete(`player_${doppel}.target`)
                Object.entries(target).forEach((entry) => {
                    if (!["username", "id", "status", "channel", "allRoles", "target", "corrupted", "sected", "bitten", "couple", "poisoned", "hypnotized", "disguised", "shamanned", "binded"].includes(entry[0])) {
                        db.set(`player_${doppel}.${entry[0]}`, entry[1])
                    }
                })

                let channel = guild.channels.cache.get(player.channel)

                await channel.edit({ name: `priv-${target.role.toLowerCase().replace(/\s/g, "-")}` }) // edit the channel name

                await channel.bulkDelete(100)

                await channel.send(getRole(target.role.toLowerCase().replace(/\s/g, "-")).description).then(async (c) => {
                    await c.pin()
                    await c.channel.bulkDelete(1)
                }) // sends the description, pins the message and deletes the last message
                await channel.send(`<@${doppel}>`).then((c) => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds

                if (target.team === "Werewolf") {
                    // give perms to the werewolves' chat
                    const wolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat")
                    await wolvesChat.send(`${getEmoji("werewolf", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji(target.role?.toLowerCase().replace(/\s/g, "_"))} ${target.role})**! Welcome them to your team.`) // send a message
                    await wolvesChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
                    if (phase.during === "night") wolvesChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                } else if (target.role === "Zombie") {
                    // give perms to zombies chat
                    const zombChat = guild.channels.cache.find((c) => c.name === "zombies-chat")
                    await zombChat.send(`${getEmoji("zombie", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji("zombie", client)} Zombie)**! Welcome them to your team.`) // send a message
                    await zombChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
                    if (phase.during === "night") zombChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                } else if (target.role === "Sect Leader") {
                    // give perms to sect chat
                    const sectChat = guild.channels.cache.get(target.sectChannel)
                    await sectChat.send(`${getEmoji("sect_leader", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji("sect_leader", client)} Sect Leader)**! Welcome them to your team.`) // send a message
                    await sectChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
                    if (phase.during === "night") sectChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                } else if (target.role === "Sibling") {
                    // give perms to sibling chat
                    const sibChat = guild.channels.cache.find((c) => c.name === "siblings-chat")
                    await sibChat.send(`${getEmoji("sibling", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji("sibling", client)} Sibling)**! Welcome them to your team.`) // send a message
                    await sibChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
                    if (phase.during === "night") sibChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                } else if (["Bandit", "Accomplice"].includes(player.role)) {
                    // give perms to zombies chat
                    const banditChat = guild.channels.cache.get(target.banditChannel)
                    await banditChat.send(`${getEmoji("zombie", client)} Player **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji("doppelganger", client)} Doppelganger)** was a doppelganger that now took over the role of **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji(target.role.toLowerCase(), client)} target.role)**! Welcome them to your team.`) // send a message
                    await banditChat.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
                    if (phase.during === "night") sectChat.permissionOverwrites.edit(player.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                }

                client.emit("playerUpdate", db.get(`player_${doppel}`))
            }
        }

        // red ladies
        for (const redlady of redladies) {
            let player = db.get(`player_${redlady}`)
            if (player.status !== "Alive") continue
            console.log("rl is alive")
            if (player.target !== guy.id) continue
            console.log("rl's target is ded")
            if (guy.killedDuring !== "night") continue
            db.set(`player_${redlady}.status`, "Dead")
            db.delete(`player_${redlady}.target`)
            let member = await guild.members.fetch(redlady)
            await member.roles.set(member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)))
            await dayChat.send(`${getEmoji("visit", client)} Player **${players.indexOf(redlady) + 1} ${player.username} (${getEmoji("red_lady", client)} Red Lady)** visited a player who was attacked and died!`)
            client.emit("playerKilled", db.get(`player_${member.id}`), db.get(`player_${member.id}`))
        }

        // split wolves
        for (const splitwolf of splitwolfs) {
            let player = db.get(`player_${splitwolf}`)
            let target = db.get(`player_${player?.target}`)
            if (target?.status !== "Alive") continue
            if (target.id !== guy.id) continue
            db.set(`player_${splitwolf}.status`, "Dead")
            db.delete(`player_${splitwolf}.target`)
            let member = await guild.members.fetch(splitwolf)
            await member.roles.set(member.roles.cache.map((r) => (r.name === "Alive" ? "892046207428476989" : r.id)))
            await dayChat.send(`${getEmoji("bind", client)} **${players.indexOf(splitwolf) + 1} ${player.username} (${getEmoji("split_wolf", client)} Split Wolf)** was killed because they bounded their soul to another player that died.`)
            client.emit("playerKilled", db.get(`player_${splitwolf}`), db.get(`player_${guy.id}`))
        }

        // trapper
        for (const trapper of trappers) {
            let player = db.get(`player_${trapper}`)
            if (player.target === guy.id) {
                db.delete(`player_${trapper}.target`)
            }
            if (player.traps.includes(guy.id)) {
                db.set(
                    `player_${trapper}.traps`,
                    player.traps.filter((t) => t !== guy.id)
                )
                db.set(`player_${trapper}.target`, undefined)
            }
        }

        for (const seerapp of seerappprentices) {
            if (!["Analyst", "Aura Seer", "Detective", "Mortician", "Seer", "Sheriff", "Spirit Seer", "Violinist"].includes(guy.role)) continue
            db.set(`player_${seerapp}.originalRole`, "Seer Apprentice")
            db.set(`player_${seerapp}.originalPlayer`, guy.id)
            db.set(`player_${seerapp}.role`, guy.role)

            let allRoles = db.get(`player_${seerapp}.allRoles`) || ["Seer Apprentice"]
            allRoles.push(guy.role)
            db.set(`player_${member}.allRoles`, allRoles)

            if (["Analyst", "Aura Seer", "Detective", "Mortician", "Seer", "Violinist"].includes(guy.role)) db.set(`player_${seerapp}.uses`, 1)
            let channel = guild.channels.cache.get(db.get(`player_${seerapp}`)?.channel)
            channel?.send(`${guy.role.startsWith("A") ? "An" : "A"} **${guy.role}** has died so you have taken over their role!`)
            channel?.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
            channel?.edit({ name: `priv-${guy.role.toLowerCase().replace(/\s/g, "-")}` })
        }

        for (const astral of astralwolves) {
            let player = db.get(`player_${astral}`)
            if (!player.target || player.target?.length === 0) continue;
            if (!player.target.includes(guy.id)) continue;

            player.target.forEach(async p => {
                let target = db.get(`player_${p}`)

                if (target.status === "Alive") {
                    let getResult = await stubbornWerewolves(client, target) // checks if the player is stubborn wolf and has 2 lives
                    if (getResult === true) return false // exits early if the player IS stubborn wolf AND has 2 lives
                    let member = await guild.members.fetch(target.id)
                    let memberRoles = member.roles.cache.map((a) => (a.name === "Alive" ? "892046207428476989" : a.id))
                    db.set(`player_${target.id}.status`, "Dead")
                    let role = target.role
                    if (target.tricked) role = "Wolf Trickster"
                    await dayChat.send(`${getEmoji("astral_chain", client)} Player **${players.indexOf(target.id) + 1} ${target.username} (${getEmoji(role.toLowerCase().replace(/\s/g, "_"), client)} ${role})** was chained to another player by the Astral Wolf and has died!`)
                    await member.roles.set(memberRoles)
                    client.emit("playerKilled", db.get(`player_${p}`), guy)
                }
                db.delete(`player_${astral}.target`)
            })
        }
    })

    
}
