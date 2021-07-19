const shuffle = require("shuffle-array")
const Discord = require("discord.js")
const db = require("quick.db")
const pull = require("array-pull")
const { getRole, fn } = require("../../config")

module.exports = {
    name: "srole",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let mininarr = message.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        let narrator = message.guild.roles.cache.find((r) => r.name === "Narrator")
        let allPlayers = [],
            roleOptions = [],
            allChannels = []
        for (let i = 0; i < alive.members.size; i++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === (i + 1).toString())
            if (!guy) return message.channel.send(`Player ${i} was not found!`)
            allPlayers.push(guy.id)
        }
        let exists = false
        let allchan = message.guild.channels.cache.filter((c) => c.name.startsWith("priv"))
        for (let a = 0; a < allchan.keyArray("id").length; a++) {
            let chan = message.guild.channels.cache.get(allchan.keyArray("id")[a])
            if (chan) {
                for (let b = 1; b <= alive.members.size; b++) {
                    let tt = message.guild.members.cache.find((m) => m.nickname === b.toString())
                    if (tt) {
                        if (chan.permissionsFor(tt).has(["VIEW_CHANNEL"])) {
                            exists = true
                        }
                    }
                }
            }
        }
        if (exists == true) {
            message.channel.send("A player has a channel occupied already! Use `+nmanual [player number] [role]` to remove them from their channel!")
            client.commands.get("playerinfo").run(message, args, client)
            return
        }
        let gamemode = args[0]
        if (!["quick", "ranked", "custom", "customhide", "sandbox"].includes(gamemode)) return message.channel.send("Invalid gamemode!")
        if (args[1] != "force" && !["custom", "customhide"].includes(gamemode)) {
            console.log(alive.members.size)
            if (![4, 6, 8, 10, 13, 16].includes(alive.members.size)) return message.channel.send(`The game is currently unbalanced! If you want to bypass this, use \`+srole ${gamemode} force\``)
        }
        let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
        let bot = message.guild.roles.cache.find((r) => r.name === "Bots")
        let wwsChat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let wwsVote = message.guild.channels.cache.find((c) => c.name === "ww-vote")
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let gamlobi = message.guild.channels.cache.find((c) => c.name === "game-lobby")
        let sib = message.guild.channels.cache.find((c) => c.name === "sibling-chat")
        let bandits = message.guild.channels.cache.find((c) => c.name === "bandits")
        let sl = message.guild.channels.cache.find((c) => c.name === `sect-members`)
        let zomb = message.guild.channels.cache.find((c) => c.name === "zombies")
        let excludes = db.get("excludes") || []

        let usedChannels = []
        db.set(`usedChannels`, usedChannels)

        args.forEach((arg) => {
            args[args.indexOf(arg)] = arg.toLowerCase()
        })
        if (args.length - 1 != alive.members.size && ["custom", "customhide"].includes(gamemode)) {
            return message.channel.send("The number of roles do not match the number of players!")
        }

        let rolelist = []
        let randoms = ["rrv", "rv", "rsv", "rww", "rk", "random", "random-regular-villager", "random-voting", "random-strong-villager", "random-werewolf", "random-killer"]
        let random = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "cupid", "cursed", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch", "president", "detective", "forger", "fortune-teller", "gunner", "jailer", "medium", "seer", "alpha-werewolf", "guardian-wolf", "junior-werewolf", "kitten-wolf", "nightmare-werewolf", "shadow-wolf", "werewolf", "werewolf-berserk", "wolf-pacifist", "wolf-seer", "wolf-shaman", "sorcerer", "alchemist", "arsonist", "bomber", "cannibal", "corruptor", "illusionist", "serial-killer", "zombie", "fool", "headhunter"]
        let rrv = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch"]
        let rsv = ["detective", "forger", "fortune-teller", "gunner", "jailer", "medium", "seer"]
        let rww = ["alpha-werewolf", "guardian-wolf", "junior-werewolf", "kitten-wolf", "nightmare-werewolf", "shadow-wolf", "werewolf", "werewolf-berserk", "wolf-pacifist", "wolf-seer", "wolf-shaman"]
        let rk = ["alchemist", "arsonist", "bomber", "cannibal", "corruptor", "illusionist", "serial-killer", "zombie"]
        let rv = ["fool", "headhunter"]
        let seerdet = ["seer", "detective"]
        let auraspirit = ["aura-seer", "spirit-seer"]
        let beastbunny = ["beast-hunter"] // , "easter-bunny"]
        let jailerwitch = ["jailer", "witch"]
        let jailerftwitch = jailerwitch.concat("fortune-teller")
        let alphashaman = ["alpha-werewolf", "wolf-shaman"]
        let skcanni = ["illusionist", "cannibal"]
        let foolhh = ["fool", "headhunter"]
        let docbg = ["doctor", "bodyguard"]
        let gunnermarks = ["gunner", "marksman"]
        let alcrk = ["alchemist", "rk"]
        let pacishadownmber = ["wolf pacifist", "shadow wolf", "nightmare werewolf", "werewolf berserk"]
        let juniorrww = ["junior-werewolf", "rw"]
        let cupidgr = ["cupid"] //, "grave-robber"]

        random = shuffle(random)
        rrv = shuffle(rrv)
        rsv = shuffle(rsv)
        rww = shuffle(rww)
        rk = shuffle(rk)
        rv = shuffle(rv)

        if (gamemode == "ranked") excludes = ["grave-robber", "villager", "mayor", "pacifist", "seer-apprentice", "werewolf", "kitten-wolf", "wolf-pacifist"]
        excludes.forEach((role) => {
            random = pull(random, role)
            rrv = pull(rrv, role)
            rsv = pull(rsv, role)
            rww = pull(rww, role)
            rk = pull(rk, role)
            rv = pull(rv, role)
        })

        // Set roleOptions to an array containing arrays of possible rolelists
        if (gamemode == "quick") {
            alphashaman = shuffle(alphashaman)
            foolhh = shuffle(foolhh)
            jailerwitch = shuffle(jailerwitch)
            skcanni = shuffle(skcanni)
            seerdet = shuffle(seerdet)
            roleOptions = [
                ["Aura Seer", "Wolf Seer", "Doctor", "Avenger", "Detective", "Wolf Shaman", "Gunner", rv[0], "Witch", "Cannibal", "Medium", "Seer", "Alpha Werewolf", "Cursed", "Werewolf", "Cupid"],
                ["Aura Seer", "Wolf Seer", "Doctor", "Beast Hunter", "Aura", "Wolf Shaman", "Gunner", rv[0], "Witch", "Bomber", "Medium", "Seer", "Alpha Werewolf", "Cursed", "Avenger", "Werewolf"],
                ["Aura Seer", "Wolf Seer", "Doctor", "Priest", "Tough Guy", alphashaman[0], "Marksman", foolhh[0], jailerwitch[0], skcanni[0], "Medium", seerdet[0], "Junior Werewolf", "Cursed", "Beast Hunter", "Werewolf"],
                ["Aura Seer", "Wolf Seer", "Doctor", "Priest", "Detective", "Wolf Shaman", "Gunner", foolhh[0], "Jailer", "Arsonist", "Medium", "Seer", "Alpha Werewolf", "Cursed", "Bodyguard", "Werewolf"],
            ]
        } else if (gamemode == "ranked") {
            if (alive.members.size < 9) {
                rww.splice(rww.indexOf("Shadow Wolf"), 1)
                rww.splice(rww.indexOf("Werewolf Berserk"), 1)
                rww.splice(rww.indexOf("Junior Werewolf"), 1)
                rww.splice(rww.indexOf("Guardian Wolf"), 1)
            }

            roleOptions = [
                ["Aura Seer", "rww", "rrv", "Doctor", "rrv", "Wolf Seer", "Marksman", "Headhunter", "Junior Werewolf", "Medium", "Jailer", "Arsonist", "Detective", "rww", "Priest", "rrv"],
                ["Spirit Seer", "rww", "rrv", "Doctor", "rrv", "Wolf Seer", "Gunner", "Fool", "Junior Werewolf", "Medium", "Witch", "Cannibal", "Detective", "rww", "Priest", "rrv"],
            ]
        } else if (gamemode == "sandbox") {
            shuffle(auraspirit)
            shuffle(docbg)
            shuffle(rrv)
            shuffle(beastbunny)
            shuffle(gunnermarks)
            shuffle(alcrk)
            shuffle(pacishadownmber)
            shuffle(juniorrww)
            shuffle(cupidgr)
            roleOptions.push([auraspirit[0], "alpha-werewolf", docbg[0], "rrv", beastbunny[0], "wolf-seer", gunnermarks[0], "rv", jailerftwitch[0], alcrk[0], "medium", "seer", pacishadownmber[0], "rrv", juniorrww[0], cupidgr[0]])
        } else if (gamemode == "custom" || gamemode == "customhide") {
            args.shift()
            roleOptions.push(args)
        }

        shuffle(roleOptions) // shuffle and use the first roleList
        console.log(roleOptions[0])
        let dcMessage = [],
            allWolves = []

        finalRoleList = roleOptions[0].splice(0, alive.members.size)
        let cancel = false
        let showrole = []
        finalRoleList.forEach((x, i) => {
            let adddc = false
            if (x == "rk") {
                shuffle(rk)
                x = rk[0]
                finalRoleList[i] = x
                dcMessage.push(`${fn.emote(`Random Killer`, client)} Random Killer`)
            } else if (x == "rrv") {
                shuffle(rrv)
                x = rrv[0]
                finalRoleList[i] = x
                dcMessage.push(`${fn.emote(`Random Regular Villager`, client)} Random Regular Villager`)
            } else if (x == "rsv") {
                shuffle(rsv)
                x = rsv[0]
                finalRoleList[i] = x
                dcMessage.push(`${fn.emote(`Random Strong Villager`, client)} Random Strong Villager`)
            } else if (x == "rv") {
                shuffle(rv)
                x = rv[0]
                finalRoleList[i] = x
                dcMessage.push(`${fn.emote(`Random Voting`, client)} Random Voting`)
            } else if (x == "rww") {
                shuffle(rww)
                x = rww[0]
                finalRoleList[i] = x
                dcMessage.push(`${fn.emote(`Random Werewolf`, client)} Random Werewolf`)
            } else if (x == "random") {
                shuffle(random)
                x = random[0]
                finalRoleList[i] = x
                dcMessage.push(`${fn.emote(`Random`, client)} Random`)
            } else {
                adddc = true
            }
            console.log(x)

            let role = getRole(x)
            if (!role || role.name == "Unknown Role") {
                cancel = true
                return message.channel.send(`Unable to find the ${x} role!`)
            }
            if (!role.description) {
                cancel = true
                return message.channel.send(`The information for the ${x} role is missing! Please report this using \`+bug\``)
            }
            if (["Bandit", "Accomplice", "Sect Leader"].includes(role.name)) {
                cancel = true
                return message.channel.send(`The ${role.name} role is currently not available`)
            }
            if (adddc) dcMessage.push(`${fn.emote(`${role.name}`, client)} ${role.name}`)
        })
        if (cancel) return message.channel.send("srole canceled")
        shuffle(finalRoleList)
        let sorcChats = []
        for (let k = 0; k < alive.members.size; k++) {
            let theirRole = finalRoleList[k]
            let role = getRole(theirRole)
            rolelist.push(theirRole)
            let guy = message.guild.members.cache.find((x) => x.nickname == `${k + 1}`)
            db.delete(`suicided_${guy.id}`)
            let lol = await message.guild.channels.create(`priv-${role.name.replace(" ", "-")}`, {
                parent: "748959630520090626",
            })
            lol.permissionOverwrites.create(message.guild.id, {
                VIEW_CHANNEL: false,
            })
            lol.permissionOverwrites.create(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })
            lol.permissionOverwrites.create(narrator.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true, MANAGE_CHANNELS: true, MENTION_EVERYONE: true, ATTACH_FILES: true })

            lol.permissionOverwrites.create(narrator.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true, MANAGE_CHANNELS: true, MENTION_EVERYONE: true, ATTACH_FILES: true })

            allChannels.push(lol)
            if (role.name.toLowerCase().includes("wolf")) {
                wwsChat.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
                wwsVote.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
                allWolves.push(`**${guy.nickname} ${guy.user.username}** is the ${role.name}!`)
            }
            if (role.name == "Sorcerer") {
                sorcChats.push(lol)
                allWolves.push(`**${guy.nickname} ${guy.user.username}** is the ${role.name}!`)
            }
            if (role.name == "President") {
                guy.roles.add(revealed)
                setTimeout(() => {
                    dayChat.send(`<:president:583672720932208671> Player **${guy.nickname} ${guy.user.username}** is the **President**!`)
                }, 15000)
            }

            if (role.name.toLowerCase().includes("zombie")) {
                zomb.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                })
            }

            if (role.name == "Bandit") {
                let bandits = message.guild.channels.cache.filter((c) => c.name.startsWith("bandits"))
                let qah = 1
                bandits.forEach(async (e) => {
                    let occupied = false
                    for (let jj = 1; jj < 17; jj++) {
                        let gyu = message.guild.members.cache.find((m) => m.nickname === jj.toString())
                        if (gyu) {
                            if (e.permissionsFor(gyu).has(["VIEW_CHANNEL", "SEND_MESSAGES"])) {
                                occupied = true
                            }
                        }
                    }
                    if (occupied != true) {
                        e.permissionOverwrites.edit(guy.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })
                    }
                    if (occupied == true) {
                        if (qah == bandits.keyArray("id").length) {
                            let t = await message.guild.channels.create("bandits", {
                                parent: "606250714355728395",
                            })
                            t.permissionOverwrites.create(guy.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                            })
                            t.permissionOverwrites.create(message.guild.id, {
                                VIEW_CHANNEL: false,
                            })
                            t.permissionOverwrites.create(narrator.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                                MANAGE_CHANNELS: true,
                                MENTION_EVERYONE: true,
                                ATTACH_FILES: true,
                            })
                            t.permissionOverwrites.create(narrator.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                                MANAGE_CHANNELS: true,
                                MENTION_EVERYONE: true,
                                ATTACH_FILES: true,
                            })
                            let a = await t.send(`${alive}`)
                            setTimeout(() => {
                                a.delete()
                            }, 3000)
                        }
                    }
                })
            }

            if (role.name == "Sect Leader") {
                let sect = message.guild.channels.cache.filter((c) => c.name.startsWith("sect-members"))
                let qah = 1
                sect.forEach(async (e) => {
                    let occupied = false
                    for (let jj = 1; jj < 17; jj++) {
                        let gyu = message.guild.members.cache.find((m) => m.nickname === jj.toString())
                        if (gyu) {
                            if (e.permissionsFor(gyu).has(["VIEW_CHANNEL", "SEND_MESSAGES"])) {
                                occupied = true
                            }
                        }
                    }
                    if (occupied != true) {
                        e.permissionOverwrites.edit(guy.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })
                    }
                    if (occupied == true) {
                        if (qah == sect.keyArray("id").length) {
                            let t = await message.guild.channels.create("sect-members", {
                                parent: "606250714355728395",
                            })
                            t.permissionOverwrites.create(guy.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                            })
                            t.permissionOverwrites.create(message.guild.id, {
                                VIEW_CHANNEL: false,
                            })
                            t.permissionOverwrites.create(narrator.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                                MANAGE_CHANNELS: true,
                                MENTION_EVERYONE: true,
                                ATTACH_FILES: true,
                            })
                            t.permissionOverwrites.create(narrator.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                                MANAGE_CHANNELS: true,
                                MENTION_EVERYONE: true,
                                ATTACH_FILES: true,
                            })
                            let a = await t.send(`${alive}`)
                            setTimeout(() => {
                                a.delete()
                            }, 3000)
                        }
                    }
                })
            }

            await lol.send(role.description)
            db.set(`role_${guy.id}`, theirRole)

            db.delete(`atag_${guy.id}`)
            db.delete(`jwwtag_${guy.id}`)
            db.delete(`mouth_${guy.id}`)
        }

        if (allWolves.length > 0) {
            wwsChat.send(allWolves.join("\n"))
            sorcChats.forEach((x) => x.send(allWolves.join("\n")))
        }

        let dcSent = await dayChat.send(gamemode.includes("hide") ? "Role list is hidden" : `${gamemode.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())} Game:\n${shuffle(dcMessage).join("\n")}`)
        dcSent.pin()
        dayChat.permissionOverwrites.edit(alive, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
        })
        client.commands.get("playerinfo").run(message, args, client)
        message.channel.send("If everything looks correct, use `+startgame` to start the game!")
    },
}
