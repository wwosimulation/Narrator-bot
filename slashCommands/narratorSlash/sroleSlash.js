const shuffle = require("shuffle-array")
const db = require("quick.db")
const pull = require("array-pull")
const { getRole, getEmoji, fn, ids } = require("../../config")

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
    narratorOnly: true,
    run: async (interaction, client) => {
        // ---------- OPTIONS ----------
        let gamemode = interaction.options.getString("gamemode")
        let roles = interaction.options.getString("roles")
        let hideroles = interaction.options.getString("hideroles")

        // ---------- DISCORD CHANNELS AND ROLES ----------
        let alive = interaction.guild.roles.cache.find((r) => r.name === "Alive")
        let narrator = interaction.guild.roles.cache.find((r) => r.name === "Narrator")
        let mininarr = interaction.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
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

        // ---------- GAME RELATED ----------
        let rolelist = []
        let players = []
        let excludes = db.get("excludes") || []
        let banned = ["Violinist", "Wolf Summoner", "Analyst", "Mortician", "Flagger", "Locksmith"]
        let randoms = ["rrv", "rv", "rsv", "rww", "rk", "random", "random-regular-villager", "random-voting", "random-strong-villager", "random-werewolf", "random-killer"]
        let random = Object.keys(require("../../config/src/descriptions.js"))?.map(a => a.replace(/\s/g, "-")).filter(a => !a.includes("random"))
        let rrv = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "mad-scientist", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch", "forger", "trapper"]
        let rsv = ["detective", "fortune-teller", "ritualist", "gunner", "jailer", "medium", "seer", "analyst", "warden", "vigilante"]
        let rww = random.filter(a => a.toLowerCase().includes("wolf") && a !== "werewolf-fan")
        let rk = ["alchemist", "arsonist", "bomber", "bandit", "cannibal", "corruptor", "dreamcatcher", "evil-detective", "illusionist", "serial-killer", "sect-leader", "zombie", "jack"]
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
        let cupidgr = ["cupid", "grave-robber"]

        // get all the channels
        let channels = interaction.guild.channels.cache.filter((c) => c.name.startsWith("priv-") && c.parentId === "892046231516368906")
        if (channels.size > 0) return interaction.reply(`${getEmoji("error", client)} Please delete the following channels, and use this command again\n\nChannels to delete: ${channels.map((c) => `<#${c.id}>`).join("\n")}`)

        // check if mode is custom AND includes invalid roles
        if (gamemode === "custom") {
            let customRoles = roles.split(" ")
            if (customRoles.length !== alive.members.size) return interaction.reply(`${getEmoji("error", client)} The number of roles do not match the number of players in game!`)

            customRoles.forEach((role) => {
                let roleData = getRole(role)
                if (!roleData || roleData.name === "Unknown Role") return interaction.reply(`${getEmoji("error", client)} Role \`${role}\` could not be found!`)
                if (!roleData.description) return interaction.reply(`${getEmoji("error", client)} The description for the \`${roleData.name}\` role is missing!`)
                //if (banned.includes(roleData.name)) return interaction.reply(`The ${roleData.name} role is currently not available`)
            })
        }

        if (alive.members.size === 0) return await interaction.reply("Lol there are no players lmao")

        let oriMsg = await interaction.reply({ content: "Loading roles...", fetchReply: true })

        // loop through each player and set their correct nickname
        alive.members
            .sort((a, b) => Number(b.nickname) - Number(a.nickname))
            .map((a) => a)
            .forEach((player, i) => {
                if (player.nickname !== i + 1) player.setNickname(`${i + 1}`)
                players.push(player.id)
                db.set(`player_${player.id}`, { id: player.id, username: player.user.username })
            })

        db.set(`players`, players)

        if (gamemode == "ranked") excludes = ["grave-robber", "villager", "mayor", "pacifist", "seer-apprentice", "werewolf", "kitten-wolf", "wolf-pacifist"]

        random = pull(random, ...excludes, ...banned)
        rrv = pull(rrv, ...excludes, ...banned)
        rsv = pull(rsv, ...excludes, ...banned)
        rww = pull(rww, ...excludes, ...banned)
        rk = pull(rk, ...excludes, ...banned)
        rv = pull(rv, ...excludes, ...banned)

        let roleOptions = []

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
            let gameOptions = {
                killers: {
                    roles: [alive.members.size < 7 ? rww.filter(r => !["shadow-wolf", "sorcerer", "split-wolf"].includes(r)) : rww, alive.members.size >= 8 ? rk : rk.filter(a => !["bomber", "arsonist", "cannibal"].includes(a))].join(",").split(","),
                    min: Math.floor(alive.members.size / 4),
                    max: Math.floor(alive.members.size / 2) - Math.round(alive.members.size * 0.16),
                    maxSoloKillers: alive.members.size > 12 ? 2 : 1,
                },
                voters: {
                    roles: rv,
                    min: alive.members.size >= 8 ? 1 : 0,
                    max: alive.members.size > 12 ? 2 : alive.members.size >= 8 ? 1 : 0
                },
                strongVillagers: {
                    roles: rsv.filter(a => alive.members.size >= 8 ? a : !["medium", "ritualist", "gunner", "vigilante", "fortune-teller"].includes(a)),
                    min: Math.ceil(alive.members.size / 6),
                    max: Math.ceil(alive.members.size / 2.5) - Math.round(alive.members.size * 0.16)
                },
                others: {
                    roles: random.filter(p => !rsv.includes(p) && !rv.includes(p) && !rww.includes(p) && !rk.includes(p)).filter(r => alive.members.size <= 8 ? r !== "Cupid" : r).filter(r => alive.members.size <= 12 ? r !== "President" : r)
                }
            }
            
            let kkllers = Math.floor(Math.random() * (gameOptions.killers.max + 1 - gameOptions.killers.min)) + gameOptions.killers.min
            let kvoters = Math.floor(Math.random() * (gameOptions.voters.max + 1 - gameOptions.voters.min)) + gameOptions.voters.min
            let kSVills = Math.floor(Math.random() * (gameOptions.strongVillagers.max + 1 - gameOptions.strongVillagers.min)) + gameOptions.strongVillagers.min
            let kothers = alive.members.size - kkllers - kvoters - kSVills
            console.log(kkllers, kvoters, kSVills, kothers)
            if (alive.members.size >= 6 && kkllers === 1) kvoters += 1
            
            let mappedOptions = {
                0: gameOptions.killers,
                1: gameOptions.voters,
                2: gameOptions.strongVillagers,
                3: gameOptions.others,
            }
            roleOptions = [[]];
            let b = [];
            for (let i = 0; i < 4; i++) {
                let type = [kkllers, kvoters, kSVills, kothers][i]
                let roles = mappedOptions[i].roles
                let a = 0
                while (a < type) {
                    let c = roles[Math.floor(Math.random() * roles.length)]
                    if (c === "seer-apprentice" && !roleOptions[0].includes("seer") && !roleOptions[0].includes("aura-seer") && !roleOptions[0].includes("spirit-seer") && !roleOptions[0].includes("detective") && !!roleOptions[0].includes("sheriff")) continue;
                    if (c === "jailer" && roleOptions[0].includes("warden")) continue;
                    if (c === "warden" && roleOptions[0].includes("jailer")) continue;
                    if (c === "warden" && roleOptions[0].includes("warden")) continue;
                    if (c === "jailer" && roleOptions[0].includes("jailer")) continue;
                    if (c === "president" && roleOptions[0].includes("president")) continue;
                    if (c === "priest" && !roleOptions[0].join(" ").toLowerCase().includes("wolf")) c = "marksman"
                    roleOptions[0].push(c)
                    b.push(c)
                    a++
                }
            }
            
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
            roleOptions.push(roles.split(" "))
        }

        shuffle(roleOptions)
        rolelist = roleOptions[0].splice(0, db.get(`players`).length)

        let dcMessage = []

        rolelist.forEach((role, i) => {
            if (gamemode === "random") role = "random"
            if (role == "rk") {
                shuffle(rk)
                role = rk[0]
                rolelelist[i] = role
                dcMessage.push(`${getEmoji(`random_killer`, client)} Random Killer`)
            } else if (role == "rrv") {
                shuffle(rrv)
                role = rrv[0]
                rolelist[i] = role
                dcMessage.push(`${getEmoji(`random_regular_villager`, client)} Random Regular Villager`)
            } else if (role == "rsv") {
                shuffle(rsv)
                role = rsv[0]
                rolelist[i] = role
                dcMessage.push(`${getEmoji(`random_strong_villager`, client)} Random Strong Villager`)
            } else if (role == "rv") {
                shuffle(rv)
                role = rv[0]
                rolelist[i] = role
                dcMessage.push(`${getEmoji(`random_voting`, client)} Random Voting`)
            } else if (role == "rww") {
                shuffle(rww)
                role = rww[0]
                rolelist[i] = role
                dcMessage.push(`${getEmoji(`random_werewolf`, client)} Random Werewolf`)
            } else if (role == "random") {
                shuffle(random)
                role = random[0]
                rolelist[i] = role
                dcMessage.push(`${getEmoji(`random`, client)} Random`)
            } else {
                dcMessage.push(`${getEmoji(getRole(role).name.toLowerCase().replace(/\s/g, "_").replace(/\-/g, "_"), client)} ${getRole(role).name}`)
            }
        })

        shuffle(rolelist)

        for (let index = 0; index < rolelist.length; index++) {
            let role = rolelist[index]
            let player = db.get(`players`)[index]
            let roleData = getRole(role)
            db.set(`player_${player}.role`, roleData.name)
            db.set(`player_${player}.team`, roleData.team)
            db.set(`player_${player}.aura`, roleData.aura || "Unknown")

            let guy = await interaction.guild.members.fetch(player)

            let channel = await interaction.guild.channels.create(`priv-${roleData.name.toLowerCase().replace(/\s/g, "-")}`, {
                parent: "892046231516368906",
            })

            db.set(`player_${player}.channel`, channel.id)

            await channel.permissionOverwrites.create(interaction.guild.id, {
                VIEW_CHANNEL: false,
            })

            await channel.permissionOverwrites.create(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            })

            await channel.permissionOverwrites.create(narrator.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true, MANAGE_CHANNELS: true, MENTION_EVERYONE: true, ATTACH_FILES: true })

            await channel.permissionOverwrites.create(narrator.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true, MANAGE_CHANNELS: true, MENTION_EVERYONE: true, ATTACH_FILES: true })

            await channel.send(`${roleData.description}`)

            await channel.send(`** **\n\n***__Do not do any actions until the Narrator says that night 1 has started!__***`)
        }

        await oriMsg.edit("If everything looks correct, use `+startgame` to start the game!")

        client.commands.get("playerinfo").run(oriMsg, [], client)

        db.set(`gamePhase`, -1)

        db.set(`gamemode`, gamemode)

        let roleMsg = `${gamemode.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())} Game:\n${shuffle(dcMessage).join("\n")}\n${excludes.size > 0 ? `Excluded roles: ${excludes.map((x) => (getRole(x).name ? getRole(x).name : "")).join(", ")}` : ""}`

        if (hideroles) roleMsg = "Role list is hidden"

        await dayChat.permissionOverwrites.edit(alive.id, { SEND_MESSAGES: false, READ_MESSAGE_HISTORY: true, VIEW_CHANNEL: true })

        let dcSent = await dayChat.send(roleMsg)

        await dcSent.pin()
    },
}
