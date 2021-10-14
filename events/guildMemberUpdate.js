const db = require("quick.db")
const { getRole, ids, getEmoji } = require("../config")
const shuffle = require("shuffle-array")
module.exports = (client) => {
    //Bot updating roles
    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        let maint = db.get("maintenance")
        if (maint) return
        if (newMember.guild.id != ids.server.game) return
        if (newMember.roles.cache.has(ids.dead) && oldMember.roles.cache.has(ids.dead)) return
        if (!newMember.roles.cache.has(ids.dead)) return
        newMember.roles.remove(ids.revealed)
        // canceling terror & peace
        if (db.get(`role_${newMember.id}`) == "Prognosticator") {
            let prog = newMember.guild.channels.cache.filter((c) => c.name === "priv-prognosticator").map((x) => x.id)
            for (let a = 0; a < prog.length; a++) {
                let chan = newMember.guild.channels.cache.get(prog[a])
                if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    // peace
                    if (db.get(`peace_${chan.id}`) > Math.floor(db.get(`gamePhase`) / 3) + 1) {
                        db.set(`peace_${chan.id}`, 0)
                    }
                    // terror
                    if (db.get(`terror_${chan.id}.day`) <= Math.floor(db.get(`gamePhase`) / 3) + 1) {
                        db.set(`terror_${chan.id}.guy`, 0)
                    }
                }
            }
        }

        // canceling frenzy
        if (db.get(`role_${newMember.id}`) == "Werewolf Berserk") {
            let wwb = newMember.guild.channels.cache.filter((c) => c.name === "priv-werewolf-berserk").map((x) => x.id)
            for (let a = 0; a < wwb.length; a++) {
                let chan = newMember.guild.channels.cache.get(wwb[a])
                if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    if (db.get(`frenzy_${chan.id}`) == true) {
                        db.set(`frenzy_${chan.id}`, false)
                        newMember.guild.channels.cache.find((c) => c.name === "werewolves-chat").send(`${getEmoji("frenzy", client)} The frenzy has stopped because the Werewolf Berserk has died!`)
                    }
                }
            }
        }

        // mort dies
        if (db.get(`role_${newMember.id}`) == "Mortician") {
            let mort = newMember.guild.channels.cache.filter((c) => c.name === "priv-mortician").map((x) => x.id)
            for (let a = 0; a < mort.length; a++) {
                let chan = newMember.guild.channels.cache.get(mort[a])
                if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    if (db.get(`mortician_${chan.id}`)) {
                        db.set(`mortician_${chan.id}`, null)
                    }
                }
            }
        }

        // corr death
        if (db.get(`role_${newMember.id}`) == "Corruptor") {
            let corr = newMember.guild.channels.cache.filter((c) => c.name === "priv-corruptor").map((x) => x.id)
            for (let a = 0; a < corr.length; a++) {
                let chan = newMember.guild.channels.cache.get(corr[a])
                if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    let allChannels = newMember.guild.channels.cache.filter((c) => c.name.startsWith("priv-")).map((x) => x.id)
                    let nick = db.get(`corrupt_${chan.id}`)
                    for (let b = 0; b < allChannels.length; b++) {
                        let chann = newMember.guild.channels.cache.get(allChannels[b])
                        let guy = newMember.guild.members.cache.find((m) => m.nickname === nick)
                        if (chann.permissionsFor(guy.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            chann.permissionOverwrites.edit(guy.id, {
                                SEND_MESSAGES: true,
                            })
                        }
                    }
                }
            }
        }

        // prisoner died
        let jailed = newMember.guild.channels.cache.find((c) => c.name === "jailed-chat")
        if (jailed.permissionsFor(newMember).has(["VIEW_CHANNEL"])) {
            jailed.permissionOverwrites.edit(newMember.id, {
                VIEW_CHANNEL: false,
            })
        }

        // grave robber
        let alive = newMember.guild.roles.cache.find((r) => r.name === "Alive")
        let graverobbers = newMember.guild.channels.cache.filter((c) => c.name === "priv-grave-robber").map((x) => x.id)
        for (let a = 0; a < graverobbers.length; a++) {
            let chan = newMember.guild.channels.cache.get(graverobbers[a])
            if (db.get(`target_${chan.id}`) == newMember.nickname) {
                let role = db.get(`role_${newMember.id}`)
                let invalidroles = ["Jailer", "Doppelganger", "Cupid", "President", "Sect Leader"]
                if (invalidroles.includes(role)) {
                    chan.send(`You could not rob the role from **${newMember.nickname} ${newMember.user.username}** because they were the **${role}**!`)
                } else {
                    let guy
                    for (let b = 1; b < 17; b++) {
                        let um = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
                        if (um) {
                            if (um.roles.cache.has(alive.id)) {
                                if (chan.permissionsFor(um).has(["VIEW_CHANNEL"])) {
                                    guy = um
                                    b = 99
                                }
                            }
                        }
                    }
                    if (guy) {
                        let abc = await newMember.guild.channels.create(`priv-${role.toLowerCase().replace(" ", "-")}`, {
                            parent: "892046231516368906",
                            permissionOverwrites: [
                                {
                                    id: guy.id,
                                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                                },
                                {
                                    id: newMember.guild.id,
                                    deny: ["VIEW_CHANNEL"],
                                },
                                {
                                    id: "606139219395608603",
                                    allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                                },
                                {
                                    id: "606276949689499648",
                                    allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                                },
                            ],
                        })
                        let role = getRole(role.toLowerCase())
                        await abc.send(role.description)
                        let t = await abc.send(alive)
                        await t.delete({ timeout: 5000 })
                        chan.permissionOverwrites.edit(guy.id, { VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false, SEND_MESSAGES: false })
                        await t.send(`You have stolen the role from **${newMember.nickname} ${newMember.user.username}**!`)
                        db.set(`role_${guy.id}`, role)
                        if (role.toLowerCase().includes("wolf")) {
                            newMember.guild.channels.cache.find((c) => c.name === "werewolves-chat").permissionOverwrites.edit(guy.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true })
                        }
                    }
                }
            }
        }
        // jww tag
        if (db.get(`role_${newMember.id}`) == "Junior Werewolf") {
            let jww = newMember.guild.channels.cache.filter((c) => c.name === "priv-junior-werewolf").map((x) => x.id)
            for (let a = 0; a < jww.length; a++) {
                let chan = newMember.guild.channels.cache.get(jww[a])
                if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    a = 99
                    let tag = db.get(`jwwtag_${oldMember.id}`)
                    let guy = newMember.guild.members.cache.find((m) => m.nickname === tag)
                    if (guy.roles.cache.has(ids.alive) && newMember.roles.cache.has("606131202814115882")) {
                        await newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("revenge", client)} The Junior Werewolf's death has been avenged! **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** is dead!`)
                        await guy.roles.add("606131202814115882")
                        await guy.roles.remove(ids.alive)
                    }
                }
            }
        }

        // avenger tag
        if (db.get(`role_${newMember.id}`) == "Avenger") {
            let jww = newMember.guild.channels.cache.filter((c) => c.name === "priv-avenger").map((x) => x.id)
            for (let a = 0; a < jww.length; a++) {
                let chan = newMember.guild.channels.cache.get(jww[a])
                if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    let tag = db.get(`atag_${oldMember.id}`)
                    let guy = newMember.guild.members.cache.find((m) => m.nickname === tag)
                    if (guy.roles.cache.has(ids.alive)) {
                        newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("avenge", client)} The Avenger avenged **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
                        guy.roles.add("606131202814115882")
                        guy.roles.remove(ids.alive)
                    }
                }
            }
        }

        // loudmouth
        if (db.get(`role_${newMember.id}`) == "Loudmouth") {
            let jww = newMember.guild.channels.cache.filter((c) => c.name === "priv-loudmouth").map((x) => x.id)
            for (let a = 0; a < jww.length; a++) {
                let chan = newMember.guild.channels.cache.get(jww[a])
                if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    let tag = db.get(`mouth_${oldMember.id}`)
                    let guy = newMember.guild.members.cache.find((m) => m.nickname === tag)
                    if (guy.roles.cache.has(ids.alive)) {
                        newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("loudmouthed", client)} The Loudmouth's last will was to reveal **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
                        guy.roles.add("822806480099999774")
                    }
                }
            }
        }

        // mortician
        let mort = newMember.guild.channels.cache.filter((c) => c.name === "priv-mortician").map((x) => x.id)
        for (let a = 0; a < mort.length; a++) {
            let chan = newMember.guild.channels.cache.get(mort[a])
            let mortUser = chan.permissionOverwrites?.cache.find((x) => x.type == "member")
            if (mortUser) {
                let target = db.get(`mortician_${chan.id}`)
                if (target && target == newMember.nickname) {
                    let teams = { village: [], werewolf: [], solo: [], zombie: [], sect: [] }
                    for (let g = 1; g < 17; g++) {
                        let user = newMember.guild.members.cache.filter((m) => m.nickname === g.toString() && m.roles.cache.has(ids.alive)).first()
                        if (user && user.id != newMember.id && user.id != mortUser.id) {
                            let role = db.get(`role_${user.id}`)
                            let team = getRole(role).team
                            if (team == "Werewolf") teams.werewolf.push(user.id)
                            if (team == "Village") teams.village.push(user.id)
                            if (team == "Zombie") teams.zombie.push(user.id)
                            if (team == "Sect") teams.sect.push(user.id)
                        }
                    }
                    let targetRole = db.get(`role_${newMember.id}`)
                    let targetTeam = getRole(targetRole).team
                    let findTeam = teams[targetTeam.toLowerCase()]
                    if (findTeam.length < 1) {
                        chan.send(`<@&${ids.alive}>\nYour target (**${newMember.nickname} ${newMember.user.username}**) has died! They had no teammates!`)
                    } else {
                        let result = shuffle(teams[targetTeam.toLowerCase()])[0]
                        let resultUser = newMember.guild.members.cache.get(result)
                        chan.send(`<@&${ids.alive}>\nYour target (**${newMember.nickname} ${newMember.user.username}**) has died! **${resultUser.nickname} ${resultUser.user.username}** is on the same team as them!`)
                    }
                }
            }
        }

        // doppelganger
        let dp = newMember.guild.channels.cache.filter((c) => c.name === "priv-doppelganger").map((x) => x.id)
        for (let a = 0; a < dp.length; a++) {
            let chan = newMember.guild.channels.cache.get(dp[a])
            console.log("worked")
            if (db.get(`copy_${chan.id}`) == oldMember.nickname) {
                console.log("Worked 2")
                let role = db.get(`role_${newMember.id}`)
                console.log(role)
                let guy
                for (let b = 1; b < 17; b++) {
                    let toGuy = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
                    //console.log(toGuy.nickname)
                    if (toGuy) {
                        if (toGuy.roles.cache.has(ids.alive)) {
                            if (chan.permissionsFor(toGuy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                guy = toGuy
                                let ff = await newMember.guild.channels.create(`priv-${role.toLowerCase().replace(" ", "-")}`, {
                                    parent: "892046231516368906",
                                    permissionOverwrites: [
                                        {
                                            id: guy.id,
                                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                                        },
                                        {
                                            id: newMember.guild.id,
                                            deny: ["VIEW_CHANNEL"],
                                        },
                                        {
                                            id: "606139219395608603",
                                            allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                                        },
                                        {
                                            id: "606276949689499648",
                                            allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                                        },
                                    ],
                                })
                                db.set(`role_${guy.id}`, role)
                                chan.permissionOverwrites.edit(guy.id, {
                                    VIEW_CHANNEL: false,
                                    READ_MESSAGE_HISTORY: false,
                                    SEND_MESSAGES: false,
                                })
                                await ff.send(`${db.get(`roleinfo_${role.toLowerCase()}`)}`)
                                await ff.send(`_ _\n\n_ _\n\n${guy}\n\nThe Player you selected to copy has died! You have taken over their role and your new role is: **${role}**!`)
                            }
                        }
                    }
                }
            }
        }

        // sect leader
        if (db.get(`role_${newMember.id}`) == "Sect Leader") {
            let sectMember = newMember.guild.channels.cache.find((c) => c.name === "sect-members")
            for (let b = 1; b < 17; b++) {
                let guy = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
                if (guy) {
                    if (guy.roles.cache.has(ids.alive)) {
                        if (sectMember.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && db.get(`role_${guy.id}`) != "Sect Leader") {
                            newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("sect_member", client)} Sect Member **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** commited suicide!`)
                            guy.roles.add("606131202814115882")
                            guy.roles.remove(ids.alive)
                            sectMember.permissionOverwrites.edit(guy.id, { VIEW_CHANNEL: false })
                        }
                    }
                }
            }
        }

        // if someone from the sect dies
        let sectMember = newMember.guild.channels.cache.find((c) => c.name === "sect-members")
        if (sectMember.permissionsFor(newMember).has(["VIEW_CHANNEL"])) {
            sectMember.permissionOverwrites.edit(newMember.id, { VIEW_CHANNEL: false })
        }

        // seer apprentice
        if (db.get(`role_${newMember.id}`) == "Seer") {
            for (let a = 1; a < 17; a++) {
                let guy = newMember.guild.members.cache.find((m) => m.nickname === a.toString())
                if (guy) {
                    if (guy.roles.cache.has(ids.alive)) {
                        if (db.get(`role_${guy.id}`) == "Seer Apprentice") {
                            a = 99
                            let ff = await newMember.guild.channels.create("priv-seer", {
                                parent: "892046231516368906",
                                permissionOverwrites: [
                                    {
                                        id: guy.id,
                                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                                    },
                                    {
                                        id: newMember.guild.id,
                                        deny: ["VIEW_CHANNEL"],
                                    },
                                    {
                                        id: "606139219395608603",
                                        allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                                    },
                                    {
                                        id: "606276949689499648",
                                        allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                                    },
                                ],
                            })
                            let seerapp = newMember.guild.channels.cache.filter((c) => c.name === "priv-seer-apprentice").map((x) => x.id)
                            for (let b = 0; b < seerapp.length; b++) {
                                let chan = newMember.guild.channels.cache.get(seerapp[b])
                                if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    chan.permissionOverwrites.edit(guy.id, {
                                        SEND_MESSAGES: false,
                                        VIEW_CHANNEL: false,
                                        READ_MESSAGE_HISTORY: false,
                                    })
                                }
                            }
                            await ff.send(`${db.get(`roleinfo_Seer`)}\n\n_ _\n${guy}\n\n_ _`)
                            await ff.send(`_ _\nSince the Seer has died, you have become the new Seer!`)
                            db.set(`role_${guy.id}`, "Seer")
                        }
                    }
                }
            }
        }

        // mad scientist
        if (db.get(`role_${newMember.id}`) == "Mad Scientist") {
            let guild = newMember.guild
            let alive = guild.roles.cache.find((r) => r.name === "Alive")
            let dead = guild.roles.cache.find((r) => r.name === "Dead")
            let found1 = false
            let found2 = false
            let guy1
            let guy2
            let thenick = newMember.nickname
            while (found1 == false) {
                let guy = guild.members.cache.find((m) => m.nickname === (parseInt(thenick) - 1).toString())
                if (!guy) {
                    thenick = alive.members.size + dead.members.size + 1
                } else if (newMember.nickname == guy.nickname) {
                    found1 = "None"
                } else {
                    if (guy.roles.cache.has(alive.id)) {
                        found1 = true
                        guy1 = guy
                    } else {
                        thenick = thenick - 1
                    }
                }
            }
            thenick = newMember.nickname
            while (found2 == false) {
                let guy = guild.members.cache.find((m) => m.nickname === (parseInt(thenick) + 1).toString())
                if (!guy) {
                    thenick = 0
                } else if (newMember.nickname == guy.nickname) {
                    found2 = "None"
                } else {
                    if (guy.roles.cache.has(alive.id)) {
                        found2 = true
                        guy2 = guy
                    } else {
                        thenick = thenick + 1
                    }
                }
            }
            if (found1 != "None") {
                guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("toxic", client)} The Mad Scientist's toxic was exposed and killed **${guy1.nickname} ${guy1.user.username} (${db.get(`role_${guy1.id}`)})**!`)
                guy1.roles.add(dead.id)
                guy1.roles.remove(alive.id)
            }
            if (found2 != "None") {
                guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("toxic", client)} The Mad Scientist's toxic was exposed and killed **${guy2.nickname} ${guy2.user.username} (${db.get(`role_${guy2.id}`)})**!`)
                guy2.roles.add(dead.id)
                guy2.roles.remove(alive.id)
            }
        }

        // red lady
        let rl = newMember.guild.channels.cache.filter((c) => c.name === "priv-red-lady").map((x) => x.id)
        let dead = newMember.guild.roles.cache.find((r) => r.name === "Dead").id
        for (let a = 0; a < rl.length; a++) {
            let chan = newMember.guild.channels.cache.get(rl[a])
            //console.log(newMember.nickname + " rl")
            //console.log(db.get(`visit_${chan.id}`))
            if (db.get(`visit_${chan.id}`) == newMember.nickname) {
                for (let b = 1; b < 17; b++) {
                    let guy = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
                    if (guy) {
                        if (guy.roles.cache.has(alive.id)) {
                            if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`**${guy.nickname} ${guy.user.username} (Red Lady)** visited someone who was attacked and was killed!`)
                                guy.roles.add(dead)
                                guy.roles.remove(alive.id)
                            }
                        }
                    }
                }
            }
        }

        // couple
        let cupid = newMember.guild.channels.cache.find((c) => c.name === "lovers")
        if (cupid.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
            for (let a = 1; a <= 17; a++) {
                let guy = newMember.guild.members.cache.find((m) => m.nickname === a.toString())
                if (guy) {
                    if (cupid.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        if (guy != newMember) {
                            if (guy.roles.cache.has(alive.id) && newMember.presence.status != "offline" && !db.get(`suicided_${newMember.id}`)) {
                                newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`${getEmoji("couple", client)} Player **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** lost the love of their live and commited suicide!`)
                                guy.roles.add(dead)
                                guy.roles.remove(alive.id)
                            }
                        }
                    }
                }
            }
        }

        //         //voting
        //         let voted = db.get(`votemsgid_${newMember.id}`)
        //         if (voted) {
        //             let votechan = newMember.guild.channels.cache.find((c) => c.name === "vote-chat")
        //             let message = votechan.messages.fetch(voted).catch((e) => console.log(e.message))
        //             if (message) {
        //                 await message.delete()
        //             }
        //         }
        //         db.delete(`vote_${newMember.id}`)
        //         db.delete(`votemsgid_${newMember.id}`)

        // disabling everythihng
        let role = db.get(`role_${newMember.id}`) || "None"
        let allchannels = newMember.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).map((x) => x.id)
        for (let a = 0; a < allchannels.length; a++) {
            let chan = newMember.guild.channels.cache.get(allchannels[a])
            if (chan) {
                if (chan.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    if (role == "Doctor") {
                        db.set(`heal_${chan.id}`, null)
                    } else if (role == "Bodyguard") {
                        db.set(`guard_${chan.id}`, null)
                    } else if (role == "Witch") {
                        db.set(`potion_${chan.id}`, null)
                    } else if (role == "Tough Guy") {
                        db.set(`tough_${chan.id}`, null)
                    } else if (role == "Beast Hunter") {
                        db.set(`setTrap_${chan.id}`, null)
                        db.set(`trapActive_${chan.id}`, false)
                    } else if (role == "Bandit") {
                        db.set(`bandit_${chan.id}`, null)
                        let allbandits = newMember.guild.channels.cache.filter((c) => c.name === "bandits")
                        allbandits.forEach((e) => {
                            if (e.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                db.set(`banditKill_${e.id}`, null)
                            }
                        })
                    } else if (role == "Accomplice") {
                        let allbandits = newMember.guild.channels.cache.filter((c) => c.name === "bandits")
                        allbandits.forEach((e) => {
                            if (e.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                db.set(`accomplice_${e.id}`, null)
                            }
                        })
                        alive.members.forEach((e) => {
                            if (db.get(`role_${e.id}`) == "Bandit") {
                                allbandits.forEach((m) => {
                                    if (m.permissionsFor(e).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                        db.set(`banditKill_${m.id}`, null)
                                    }
                                })
                            }
                        })
                    } else if (role == "Serial Killer") {
                        db.delete(`stab_${chan.id}`)
                    } else if (role == "Arsonist") {
                        db.delete(`douse_${chan.id}`)
                    } else if (role == "Corruptor") {
                        db.delete(`corrupt_${chan.id}`)
                    } else if (role == "Cannibal") {
                        db.delete(`eat_${chan.id}`)
                    } else if (role == "Illusionist") {
                        db.delete(`disguise_${chan.id}`)
                    } else if (role == "Sect Leader") {
                        db.delete(`sect_${chan.id}`)
                    } else if (role == "Zombie") {
                        db.delete(`bite_${chan.id}`)
                    } else if (role == "Jailer") {
                        db.delete(`jail_${chan.id}`)
                    } else if (role == "Marksman") {
                        db.delete(`mark_${chan.id}`)
                    } else if (role == "Sheriff") {
                        db.delete(`snipe_${chan.id}`)
                    } else if (role == "Kitten Wolf") {
                        db.delete(`scratch_${chan.id}`)
                    } else if (role == "Nightmare Werewolf") {
                        db.delete(`sleepy_${chan.id}`)
                    } else if (role == "Naughty Boy") {
                        db.delete(`switch_${chan.id}`)
                    } else if (role.toLowerCase().includes("wolf")) {
                        db.delete(`wolvesKill_${chan.id}`)
                    } else if (role == "Spirit Seer") {
                        db.set(`spirit_${chan.id}`, null)
                    }
                }
            }
        }
    })
}
