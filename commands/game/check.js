const db = require("quick.db")
const { soloKillers, roles, getRole, fn, ids } = require("../../config")

module.exports = {
    name: "check",
    description: "Check players during the night. This command works for every seer in game.",
    usage: `${process.env.PREFIX}check <player> [<player>]`,
    gameOnly: true,
    run: async (message, args, client) => {
        let shaman = message.guild.channels.cache.filter((c) => c.name === "priv-wolf-shaman").map((x) => x.id)
        let illu = message.guild.channels.cache.filter((c) => c.name === "priv-illusionist").map((x) => x.id)
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        if (message.channel.name == "priv-aura-seer") {
            let gamePhase = await db.fetch(`gamePhase`)
            if (gamePhase % 3 != 0) return await message.channel.send("It's day! You can check during nights only!")
            if (!args[0]) return message.channel.send("Who want to check? Insert the player number next time.")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            if (!guy.roles.cache.has(ids.alive) || !ownself.roles.cache.has(ids.alive)) return await message.reply("You or the person you are checking is not alive.")
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You are in control of them, why would you ever want to waste their ability?`)
            if (guy == ownself) return message.channel.send("Checking yourself? Trust issues, hah! lol")
            let ability = await db.fetch(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `auraCheck_${dc.chan.id}` : `auraCheck_${message.channel.id}`}`)
            if (ability == "yes") return await message.reply(`You have already used your ability for tonight!`)
            let role = await db.fetch(`role_${guy.id}`)
            let aura = getRole(role).aura

            for (let i = 0; i < illu.length; i++) {
                let disguised = db.get(`disguised_${illu[i]}`) || []
                if (disguised.length != 0) {
                    if (disguised.includes[args[0]]) {
                        aura == "Unknown"
                    }
                }
            }

            for (let i = 0; i < shaman.length; i++) {
                let disguised = db.get(`shaman_${shaman[i]}`) || ""
                if (disguised == args[0]) {
                    aura = "Evil"
                }
            }
            db.set(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `auraCheck_${dc.chan.id}` : `auraCheck_${message.channel.id}`}`, "yes")
            message.channel.send(`You checked **${args[0]} ${guy.user.username} (${aura})**`)
        } else if (message.channel.name == "priv-seer") {
            let gamePhase = await db.fetch(`gamePhase`)
            if (gamePhase % 3 != 0) return await message.channel.send("It's day! You can check during nights only!")
            if (!args[0]) return message.channel.send("Who you want to check? Insert the player number next time.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You are in control of them, why would you ever want to waste their ability?`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (!guy) return message.reply("The player is not in game! Mention the correct player number.")
            else if (guy == ownself) {
                return message.channel.send("Checking yourself? Trust issues, hah! lol")
            } else if (!guy.roles.cache.has(ids.alive) || !ownself.roles.cache.has(ids.alive)) return await message.channel.send("You or the person you are checking is not alive.")
            let checked = await db.fetch(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `seer_${dc.chan.id}` : `seer_${message.channel.id}`}`)
            if (checked == "yes") return await message.channel.send("You already used your ability for tonight!")
            let role = await db.fetch(`role_${guy.id}`)

            for (let i = 0; i < illu.length; i++) {
                let disguised = db.get(`disguised_${illu[i]}`) || []
                if (disguised.length != 0) {
                    if (disguised.includes[args[0]]) {
                        role == "Illusionist"
                    }
                }
            }

            for (let i = 0; i < shaman.length; i++) {
                let disguised = db.get(`shaman_${shaman[i]}`) || ""
                if (disguised == args[0]) {
                    role = "Wolf Shaman"
                }
            }

            message.channel.send(`You checked **${args[0]} ${guy.user.username} (${role})**!`)
            db.set(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `seer_${dc.chan.id}` : `seer_${message.channel.id}`}`, "yes")
        } else if (message.channel.name == "priv-detective") {
            let gamePhase = await db.fetch(`gamePhase`)
            if (gamePhase % 3 != 0) return await message.channel.send("It's day! You can check during nights only!")

            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0])
            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1])
            if (typeof dc !== "undefined" && (guy1.nickname == db.get(`hypnotized_${dc.tempchan}`) || guy2.nickname == db.get(`hypnotized_${dc.tempchan}`))) return message.channel.send(`You are in control of them, why would you ever want to waste their ability?`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (args.length != 2 || guy1 == guy2) return await message.channel.send("Honey, as Detective you need to select 2 players to compare.")

            if (!guy1 || !guy2) return await message.reply("The player is not in game! Mention the correct player number.")
            else if (guy1 == ownself || guy2 == ownself) {
                return message.channel.send("Checking with yourself? Trust issues, hah! lol")
            }
            if (!guy1.roles.cache.has(ids.alive) || !guy2.roles.cache.has(ids.alive) || !ownself.roles.cache.has(ids.alive)) {
                return await message.channel.send("You or the person you are checking is not alive.")
            }

            let ability = await db.fetch(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `detCheck_${dc.chan.id}` : `detCheck_${message.channel.id}`}`)
            if (ability == "yes") return await message.reply(`You have already used your ability for tonight!`)

            let role1 = await db.fetch(`role_${guy1.id}`)
            let role2 = await db.fetch(`role_${guy2.id}`)
            let team1 = roles.get(role1).team
            let team2 = roles.get(role2).team

            for (let i = 0; i < illu.length; i++) {
                let disguised = db.get(`disguised_${illu[i]}`) || []
                if (disguised.length != 0) {
                    if (disguised.includes[args[0]]) {
                        team1 == "Solo"
                    }
                }
            }

            for (let i = 0; i < illu.length; i++) {
                let disguised = db.get(`disguised_${illu[i]}`) || []
                if (disguised.length != 0) {
                    if (disguised.includes[args[0]]) {
                        team2 == "Solo"
                    }
                }
            }

            for (let i = 0; i < shaman.length; i++) {
                let disguised = db.get(`shaman_${shaman[i]}`) || ""
                if (disguised == args[0]) {
                    team1 = "Werewolf"
                }
            }

            for (let i = 0; i < shaman.length; i++) {
                let disguised = db.get(`shaman_${shaman[i]}`) || ""
                if (disguised == args[1]) {
                    team2 = "Werewolf"
                }
            }

            let result = ""
            if (team1 == "Solo" || team2 == "Solo") {
                result = "different teams"
            } else if (team1 == team2) {
                result = "the same team"
            } else {
                result = "different teams"
            }
            message.channel.send(`**${args[0]} ${guy1.user.username}** and **${args[1]} ${guy2.user.username}** have ${result}!`)
            db.set(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `detCheck_${dc.chan.id}` : `detCheck_${message.channel.id}`}`, "yes")
        } else if (message.channel.name == "priv-wolf-seer") {
            let gamePhase = await db.fetch(`gamePhase`)
            if (gamePhase % 3 != 0) return await message.channel.send("It's day! You can check during nights only!")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You are in control of them, why would you ever want to waste their ability?`)
            let ability = await db.fetch(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `wwseer_${dc.chan.id}` : `wwseer_${message.channel.id}`}`)
            if (ability == "yes") return await message.channel.send("You have already used your ability for tonight!")
            if (message.member.roles.cache.has(dead.id)) return await message.channel.send("Yes. Checking while dead. Dude, you can't even tell the wolves your check.")
            if (message.member == guy || !guy) return await message.channel.send("The player is not in game! Mention the correct player number.")
            if (guy.roles.cache.has(dead.id)) return await message.channel.send("Sure, why not? Checking a dead player hah.")
            let role = await db.fetch(`role_${guy.id}`)
            let roles = role.toLowerCase()
            if (roles.includes("wolf") || role == "Sorcerer") return await message.channel.send("Ah yes. Why are you checking teammate though?")
            let ye = "no"
            for (let i = 1; i <= alive.members.size + dead.members.size; i++) {
                console.log(i)
                let tt = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
                let h = message.guild.members.cache.find((m) => m.nickname === i.toString())
                if (h.roles.cache.has(alive.id)) {
                    let rolet = await db.fetch(`role_${h.id}`)
                    console.log(rolet)
                    let roleh = rolet.toLowerCase()
                    console.log(roleh)
                    console.log(roleh.includes("wolf") && h != tt)
                    if (roleh.includes("wolf") && h != tt) {
                        ye = "yes"
                    }
                }
            }
            if (ye != "yes") return await message.channel.send("You cannot check being the last wolf alive.")
            let wwchat = message.guild.channels.cache.find((c) => c.name == "werewolves-chat")

            for (let i = 0; i < illu.length; i++) {
                let disguised = db.get(`disguised_${illu[i]}`) || []
                if (disguised.length != 0) {
                    if (disguised.includes[args[0]]) {
                        role == "Illusionist"
                    }
                }
            }

            message.channel.send(`You checked **${args[0]} ${guy.user.username} (${role})**!${soloKillers.includes(role) ? " As a werewolf, you cannot kill this player at night." : ""}`)
            wwchat.send(`The Wolf Seer checked **${args[0]} ${guy.user.username} (${role})**!`)
            db.set(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `wwseer_${dc.chan.id}` : `wwseer_${message.channel.id}`}`, "yes")
        } else if (message.channel.name == "priv-sorcerer") {
            let ability = await db.fetch(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `sorcerer_${dc.chan.id}` : `sorcerer_${message.channel.id}`}`)
            let gamePhase = await db.fetch(`gamePhase`)
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            if (typeof dc !== "undefined" && guy.nickname == db.get(`hypnotized_${dc.tempchan}`)) return message.channel.send(`You are in control of them, why would you ever want to waste their ability?`)
            if (!guy || guy == ownself) return await message.channel.send("Checking with yourself? Trust issues, hah! lol")
            if (!guy.roles.cache.has(alive.id) || !ownself.roles.cache.has(alive.id)) return await message.channel.send("You cannot check dead people.")
            if (gamePhase % 3 != 0) return await message.channel.send("It's day! You can check during the nights only!")
            if (ability == "yes") return await message.channel.send("You have already used your ability for tonight!")
            let rol = await db.fetch(`role_${guy.id}`)
            let role = rol.toLowerCase()
            if (role.includes("wolf")) return await message.channel.send("Why checking a wolf, there are plenty others?")

            for (let i = 0; i < illu.length; i++) {
                let disguised = db.get(`disguised_${illu[i]}`) || []
                if (disguised.length != 0) {
                    if (disguised.includes[args[0]]) {
                        role == "Illusionist"
                    }
                }
            }

            message.channel.send("You checked **" + args[0] + " " + guy.user.username + " (" + role + ")**! ")
            db.set(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `sorcerer_${dc.chan.id}` : `sorcerer_${message.channel.id}`}`, "yes")
        } else if (message.channel.name == "priv-spirit-seer") {
            let gamePhase = db.get(`gamePhase`)
            let guy1 = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            let guy2 = message.guild.members.cache.find((m) => m.nickname === args[1]) || message.guild.members.cache.find((m) => m.id === args[1]) || message.guild.members.cache.find((m) => m.user.username === args[1]) || message.guild.members.cache.find((m) => m.user.tag === args[1])
            let ownself = message.guild.members.cache.find((m) => m.nickname === message.member.nickname)
            if (typeof dc !== "undefined" && (guy1.nickname == db.get(`hypnotized_${dc.tempchan}`) || guy2.nickname == db.get(`hypnotized_${dc.tempchan}`))) return message.channel.send(`You are in control of them, why would you ever want to waste their ability?`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot check being dead.")
            else if (gamePhase % 3 != 0) return message.channel.send("It's day! You can check during the nights only!")
            else if (args.length > 2) return message.channel.send("You can check spirits of atmost 2 players.")
            else if (args.length < 1) return message.channel.send("Specify atleast 1 player to see the spirits.")
            let check = []
            for (let i = 0; i < args.length; i++) {
                if (i == 0) {
                    if (!guy1 || guy1.id == message.author.id) return message.reply("The player is not in game! Mention the correct player number.")
                    if (!guy1.roles.cache.has(alive.id)) return message.channel.send("You cannot check a dead player's spirit!")
                    check.push(guy1.nickname)
                } else {
                    if (!guy2 || guy2.id == message.author.id) return message.reply("The player is not in game! Mention the correct player number.")
                    if (!guy2.roles.cache.has(alive.id)) return message.channel.send("You cannot check a dead player's spirit!")
                    check.push(guy2.nickname)
                }
            }
            db.set(`${db.get(`role_${ownself.id}`) == "Dreamcatcher" ? `spirit_${dc.chan.id}` : `spirit_${message.channel.id}`}`, check)
            message.react(fn.getEmoji("sscheck", client)).catch(()=>{})
        }
    },
}
