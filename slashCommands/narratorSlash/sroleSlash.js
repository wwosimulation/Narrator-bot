const shuffle = require("shuffle-array")
const db = require("quick.db")
const pull = require("array-pull")
const { getRole, fn, ids } = require("../../config")

module.exports = {
    command: {
        name: "srole",
        description: "Set the roles and settings for the game!",
        options: [
            {
                type: "STRING",
                name: "gamemode",
                description: "Select the gamemode for this game.",
                required: true,
                choices: [
                    { name: "Quick", value: "quick" },
                    { name: "Sandbox", value: "sandbox" },
                    { name: "Custom", value: "custom" },
                    { name: "Chain Reaction", value: "chainreaction" },
                    { name: "Pure Random", value: "random" },
                    { name: "Ranked", value: "ranked" },
                ],
            },
            {
                type: "STRING",
                name: "roles",
                description: "List the roles for the game, separated by spaces.",
                required: false,
            },
            // {
            //     type: "STRING",
            //     name: "hideondeath",
            //     description: "Should players roles be hidden on death? (Default: false)",
            //     required: false,
            //     choices: [
            //         { name: "True", value: "true" },
            //         { name: "False", value: "false" },
            //     ],
            // },
            {
                type: "STRING",
                name: "hideroles",
                description: "Should the rolelist be hidden? (Default: false)",
                required: false,
                choices: [
                    { name: "True", value: "true" },
                    { name: "False", value: "false" },
                ],
            },
        ],
        defaultPermission: false,
    },
    permissions: {
        game: [
            { id: ids.narrator, type: "ROLE", permission: true }, // @Narrator
            { id: ids.mini, type: "ROLE", permission: true }, // @Narrator Trainee
            { id: "892046210536468500", type: "ROLE", permission: false }, // @Player
        ],
    },
    server: ["game"],
    run: async (interaction, client) => {
        let gamemode = interaction.options.getString("gamemode")
        let roles = interaction.options.getString("roles")
        let hideOnDeath = false
        //let hideOnDeath = interaction.options.getString("hideondeath") || false
        let hideRoles = interaction.options.getString("hideroles") || false

        if (hideOnDeath === "true") hideOnDeath = true
        if (hideRoles === "true") hideOnDeath = true
        if (hideOnDeath === "false") hideOnDeath = false
        if (hideRoles === "false") hideOnDeath = false

        console.log(hideOnDeath, hideRoles)

        let alive = interaction.guild.roles.cache.find((r) => r.name === "Alive")
        let mininarr = interaction.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        let narrator = interaction.guild.roles.cache.find((r) => r.name === "Narrator")
        let allPlayers = [],
            roleOptions = [],
            allChannels = []
        for (let i = 0; i < alive.members.size; i++) {
            let guy = interaction.guild.members.cache.find((m) => m.nickname === (i + 1).toString())
            if (!guy) return interaction.reply(`Player ${i} was not found!`)
            allPlayers.push(guy.id)
        }
        let exists = false
        let allchan = interaction.guild.channels.cache.filter((c) => c.name.startsWith("priv")).map((x) => x.id)
        for (let a = 0; a < allchan.length; a++) {
            let chan = interaction.guild.channels.cache.get(allchan[a])
            if (chan) {
                for (let b = 1; b <= alive.members.size; b++) {
                    let tt = interaction.guild.members.cache.find((m) => m.nickname === b.toString())
                    if (tt) {
                        if (chan.permissionsFor(tt).has(["VIEW_CHANNEL"])) {
                            exists = true
                        }
                    }
                }
            }
        }
        if (exists == true) {
            interaction.reply("A player has a channel occupied already! Use `+nmanual [player number] [role]` to remove them from their channel!")
            client.commands.get("playerinfo").run(interaction, [], client)
            return
        }

        await interaction.deferReply()

        let revealed = interaction.guild.roles.cache.find((r) => r.name === "Revealed")
        let bot = interaction.guild.roles.cache.find((r) => r.name === "Bots")
        let wwsChat = interaction.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let wwsVote = interaction.guild.channels.cache.find((c) => c.name === "ww-vote")
        let dayChat = interaction.guild.channels.cache.find((c) => c.name === "day-chat")
        let gamlobi = interaction.guild.channels.cache.find((c) => c.name === "game-lobby")
        let sib = interaction.guild.channels.cache.find((c) => c.name === "sibling-chat")
        let bandits = interaction.guild.channels.cache.find((c) => c.name === "bandits")
        let sl = interaction.guild.channels.cache.find((c) => c.name === `sect-members`)
        let zomb = interaction.guild.channels.cache.find((c) => c.name === "zombies")
        let excludes = db.get("excludes") || []

        let usedChannels = []
        db.set(`usedChannels`, usedChannels)

        let args = roles ? roles.split(" ") : []
        args.forEach((arg) => {
            args[args.indexOf(arg)] = arg.toLowerCase()
        })
        if (args.length != alive.members.size && gamemode == "custom") {
            return interaction.editReply("The number of roles do not match the number of players!")
        }

        let rolelist = []
        let randoms = ["rrv", "rv", "rsv", "rww", "rk", "random", "random-regular-villager", "random-voting", "random-strong-villager", "random-werewolf", "random-killer"]
        let random = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "cupid", "cursed", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch", "president", "detective", "forger", "fortune-teller", "gunner", "jailer", "medium", "seer", "alpha-werewolf", "guardian-wolf", "junior-werewolf", "kitten-wolf", "nightmare-werewolf", "shadow-wolf", "werewolf", "werewolf-berserk", "wolf-pacifist", "wolf-seer", "wolf-shaman", "sorcerer", "alchemist", "arsonist", "bomber", "cannibal", "corruptor", "illusionist", "serial-killer", "zombie", "fool", "headhunter"]
        let rrv = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch"]
        let rsv = ["detective", "forger", "fortune-teller", "gunner", "jailer", "medium", "seer"]
        let rww = ["alpha-werewolf", "guardian-wolf", "junior-werewolf", "kitten-wolf", "nightmare-werewolf", "shadow-wolf", "werewolf", "werewolf-berserk", "wolf-pacifist", "wolf-seer", "wolf-shaman"]
        let rk = ["alchemist", "arsonist", "bomber", "cannibal", "corruptor", "illusionist", "serial-killer"]
        let rv = ["fool", "headhunter"]
        let seerdet = ["seer", "detective"]
        let auraspirit = ["aura-seer", "spirit-seer"]
        let beastbunny = ["beast-hunter"] // , "easter-bunny"]
        let jailerwitch = ["jailer", "witch"]
        let mortrrv = ["mortician", "rrv"]
        let alphashaman = ["alpha-werewolf", "wolf-shaman"]
        let skcanni = ["serial-killer", "cannibal"]
        let foolhh = ["fool", "headhunter"]
        let foolhhrv = foolhh.concat("rv")
        let ftprog = ["fortune-teller", "prognosticator"]
        let dcrk = ["dreamcatcher", "rk"]
        let docbg = ["doctor", "bodyguard"]
        let gunnermarks = ["gunner", "marksman"]
        let cupidgr = ["cupid"] //, "grave-robber"]
        let banned = ["Bandit", "Accomplice", "Sect Leader", "Grave Robber", "Baker", "Astral Wolf", "Easter Bunny", "Vigilante", "Split Wolf", "Preacher", "Wolf Trickser", "Ghost Lady", "Evil Detective"]

        random = shuffle(random)
        rrv = shuffle(rrv)
        rsv = shuffle(rsv)
        rww = shuffle(rww)
        rk = shuffle(rk)
        rv = shuffle(rv)

        banned.forEach((role) => {
            role = role.toLowerCase().replace(/ /g, "-")
            random = pull(random, role)
            rrv = pull(rrv, role)
            rsv = pull(rsv, role)
            rww = pull(rww, role)
            rk = pull(rk, role)
            rv = pull(rv, role)
        })

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
                ["Aura Seer", "Wolf Seer", "Doctor", "Beast Hunter", "Aura Seer", "Wolf Shaman", "Gunner", rv[0], "Witch", "Bomber", "Medium", "Seer", "Alpha Werewolf", "Cursed", "Avenger", "Werewolf"],
                ["Aura Seer", "Wolf Seer", "Doctor", "Priest", "Tough Guy", alphashaman[0], "Marksman", foolhh[0], jailerwitch[0], skcanni[0], "Medium", seerdet[0], "Junior Werewolf", "Cursed", "Beast Hunter", "Werewolf"],
                ["Aura Seer", "Wolf Seer", "Doctor", "Priest", "Detective", "Wolf Shaman", "Gunner", foolhh[0], "Jailer", "Arsonist", "Medium", "Seer", "Alpha Werewolf", "Cursed", "Bodyguard", "Werewolf"],
            ]
        } else if (gamemode == "chainreaction") {
            roleOptions = [["avenger", "witch", "avenger", "detective", "avenger", "witch", "avenger", "corruptor", "fool", "avenger", "avenger", "aura", "illusionist", "avenger", "fool", "avenger", "medium"]]
        } else if (gamemode == "random") {
            roleOptions = [["random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random", "random"]]
        } else if (gamemode == "ranked") {
            if (alive.members.size < 9) {
                rww.splice(rww.indexOf("Shadow Wolf"), 1)
                rww.splice(rww.indexOf("Werewolf Berserk"), 1)
                rww.splice(rww.indexOf("Junior Werewolf"), 1)
                rww.splice(rww.indexOf("Guardian Wolf"), 1)
            }

            roleOptions = [
                ["Aura Seer", "rww", "rrv", "Doctor", "Detective", "Wolf Seer", "Marksman", "Headhunter", "Junior Werewolf", "Medium", "Jailer", "Arsonist", "rrv", "rww", "Priest", "rrv"],
                ["Aura Seer", "rww", "rrv", "Doctor", "Detective", "Wolf Seer", "Marksman", "Headhunter", "Junior Werewolf", "Medium", "Witch", "Cannibal", "rrv", "rww", "Priest", "rrv"],
                ["Detective", "Wolf Seer", "rrv", "Bodyguard", "Spirit Seer", "Wolf Shaman", "Gunner", "rv", "Nightmare Werewolf", "Medium", "Aura Seer", "Jailer", "Arsonist", "Corruptor", "Beast Hunter", "Priest", "Alpha Werewolf"],
                ["Detective", "Wolf Seer", "rrv", "Bodyguard", "Spirit Seer", "Wolf Shaman", "Gunner", "rv", "Nightmare Werewolf", "Medium", "Aura Seer", "Jailer", "Illusionist", "Cannibal", "Beast Hunter", "Priest", "Alpha Werewolf"],
            ]
        } else if (gamemode == "sandbox") {
            shuffle(auraspirit)
            shuffle(docbg)
            shuffle(rrv)
            shuffle(beastbunny)
            shuffle(gunnermarks)

            shuffle(cupidgr)
            roleOptions = [
                [auraspirit[0], "alpha-werewolf", docbg[0], "rrv", beastbunny[0], "wolf-seer", gunnermarks[0], foolhhrv[0], ftprog[0], dcrk[0], "medium", "seer", "werewolf-berserk", "rrv", "rww", cupidgr[0]],
                ["aura-seer", "alpha-werewolf", "bodyguard", "rrv", mortrrv[0], "wolf-seer", "gunner", "rv", "jailer", "hacker", "medium", "seer", "shadow-wolf", "rrv", "rww", "cupid"],
            ]
        } else if (gamemode == "custom") {
            excludes.forEach((role) => {
                role = role.replace(/ /g, "-")
                random = pull(random, role)
                rrv = pull(rrv, role)
                rsv = pull(rsv, role)
                rww = pull(rww, role)
                rk = pull(rk, role)
                rv = pull(rv, role)
            })
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
                return interaction.editReply(`Unable to find the ${x} role!`)
            }
            if (!role.description) {
                cancel = true
                return interaction.editReply(`The information for the ${x} role is missing! Please report this using \`+bug\``)
            }
            if (banned.includes(role.name)) {
                cancel = true
                return interaction.editReply(`The ${role.name} role is currently not available`)
            }
            if (adddc) dcMessage.push(`${fn.emote(`${role.name}`, client)} ${role.name}`)
        })
        if (cancel) return interaction.editReply("srole canceled")
        shuffle(finalRoleList)
        let sorcChats = []
        for (let k = 0; k < alive.members.size; k++) {
            let theirRole = finalRoleList[k]
            let role = getRole(theirRole)
            rolelist.push(theirRole)
            let guy = interaction.guild.members.cache.find((x) => x.nickname == `${k + 1}`)
            db.delete(`suicided_${guy.id}`)
            let lol = await interaction.guild.channels.create(`priv-${role.name.replace(" ", "-")}`, {
                parent: "892046231516368906",
            })
            lol.permissionOverwrites.create(interaction.guild.id, {
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
            if (role.name === "Zombie") {
                db.set(`bittenAt_${guy.id}`, 0)
            }
            if (role.name == "President") {
                guy.roles.add(revealed)
                setTimeout(() => {
                    dayChat.send(`${fn.getEmoji("president", client)} Player **${guy.nickname} ${guy.user.username}** is the **President**!`)
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
                let bandits = interaction.guild.channels.cache.filter((c) => c.name.startsWith("bandits"))
                let qah = 1
                bandits.forEach(async (e) => {
                    let occupied = false
                    for (let jj = 1; jj < 17; jj++) {
                        let gyu = interaction.guild.members.cache.find((m) => m.nickname === jj.toString())
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
                        if (qah == bandits.map((x) => x.id).length) {
                            let t = await interaction.guild.channels.create("bandits", {
                                parent: "892046231516368906",
                            })
                            t.permissionOverwrites.create(guy.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                            })
                            t.permissionOverwrites.create(interaction.guild.id, {
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
                let sect = interaction.guild.channels.cache.filter((c) => c.name.startsWith("sect-members"))
                let qah = 1
                sect.forEach(async (e) => {
                    let occupied = false
                    for (let jj = 1; jj < 17; jj++) {
                        let gyu = interaction.guild.members.cache.find((m) => m.nickname === jj.toString())
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
                        if (qah == sect.map((x) => x.id).length) {
                            let t = await interaction.guild.channels.create("sect-members", {
                                parent: "892046231516368906",
                            })
                            t.permissionOverwrites.create(guy.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                            })
                            t.permissionOverwrites.create(interaction.guild.id, {
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
            await lol.send(`** **\n\n***__Do not do any actions until the Narrator says that night 1 has started!__***`)
            db.set(`role_${guy.id}`, theirRole)

            db.delete(`atag_${guy.id}`)
            db.delete(`jwwtag_${guy.id}`)
            db.delete(`mouth_${guy.id}`)
        }

        if (allWolves.length > 0) {
            wwsChat.send(allWolves.join("\n"))
            sorcChats.forEach((x) => x.send(allWolves.join("\n")))
        }

        let roleMsg = `${gamemode.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())} Game:\n${shuffle(dcMessage).join("\n")}\n${excludes.size > 0 ? `Excluded roles: ${excludes.map((x) => (getRole(x).name ? getRole(x).name : "")).join(", ")}` : ""}`
        if (hideRoles) roleMsg = "Role list is hidden"
        let dcSent = await dayChat.send(roleMsg)
        dcSent.pin()
        console.log(roleMsg)
        dayChat.permissionOverwrites.edit(alive, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
        })
        client.commands.get("playerinfo").run(interaction, args, client)
        interaction.editReply("If everything looks correct, use `+startgame` to start the game!")
        db.set(`gamePhase`, -1)
        db.set(`gamemode`, gamemode)
    },
}
