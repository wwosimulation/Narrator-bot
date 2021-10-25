const db = require("quick.db")
const { getEmoji, fn, ids } = require("../../config")

module.exports = {
    name: "shoot",
    description: "Kill a player with your weapons!",
    usage: `${process.env.PREFIX}shoot [player]`,
    gameOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dc
        if (db.get(`role_${message.author.id}`) == "Dreamcatcher") dc = fn.dcActions(message, db, alive)
        if (message.channel.name == "priv-gunner") {
            if (!db.get(`bullets_${message.channel.id}`)) {
                db.set(`bullets_${message.channel.id}`, 1)
            }
            let bullets = db.get(`bullets_${message.channel.id}`) ? db.get(`bullets_${message.channel.id}`) : "None"
            if (bullets == "None") {
                db.set(`bullets_${message.channel.id}`, 2)
                bullets = db.get(`bullets_${message.channel.id}`)
            }
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let gamePhase = db.get(`gamePhase`)
            let dayCount = Math.floor(gamePhase / 3) + 1
            let voting = db.get(`commandEnabled`)
            console.log("tets")
            if (message.member.roles.cache.has(dead.id)) return message.channel.send("You cannot use the ability now!")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (gamePhase % 3 != 1) return message.channel.send("You can use your ability only during the day!")
            if (!guy || guy == message.member || !guy.roles.cache.has(alive.id)) return message.reply("The player is not in game! Mention the correct player number.")
            if (bullets > 0) {
                if (dayCount == 1) {
                    if (voting != "yes") return message.channel.send("You can shoot day 1 voting phase onwards.")
                }
                let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
                if (sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && db.get(`role_${guy.id}`) === "Sect Leader") return message.channel.send("You can not shoot the sect leader while you are a sect member!")
                let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
                for (let x = 0; x < cupid.length; x++) {
                    let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                    if (message.author.nickname === couple[0]) {
                        if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not shoot your lover!")
                    }
                    if (message.author.nickname === couple[1]) {
                        if (!sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not shoot your lover!")
                    }
                }
                if (db.get(`did_${message.channel.id}`) == dayCount) return message.channel.send("You can shoot once a day.")
                if (db.get(`role_${guy.id}`) == "President") return message.channel.send("You cannot shoot the President.")
                dayChat.send(`${getEmoji("bullet", client)} **${message.member.nickname} ${message.author.username} (Gunner)** shot **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
                message.member.roles.add(revealed.id)
                guy.roles.add(dead.id)
                guy.roles.remove(alive.id)
                db.subtract(`bullets_${message.channel.id}`, 1)
                db.set(`did_${message.channel.id}`, dayCount)
            }
        } else if (message.channel.name == "priv-jailer") {
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let jailedchat = message.guild.channels.cache.find((c) => c.name === "jailed-chat")
            let gamePhase = db.get(`gamePhase`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
            let jailed = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `jail_${dc.chan.id}` : `jail_${message.channel.id}`}`)
            let guy = message.guild.members.cache.find((m) => m.nickname === jailed)
            if (!guy.roles.cache.has(ids.alive)) return message.channel.send("The player is already dead.")
            let bullet = db.get(`bullet_jail`) ? db.get(`bullet_jail`) : 1
            if (gamePhase % 3 == 1) return message.channel.send("You cannot shoot during the day without jailing someone!")
            if (bullet == 0) return message.channel.send("You have already used your bullet.")
            if (fn.peaceCheck(message, db) === true) return message.channel.send({ content: "The Prognosticator activated their power last night. You can't kill anyone." })
            let sectMembers = message.guild.channels.cache.find((c) => c.name === "sect-members")
            if (sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && db.get(`role_${guy.id}`) === "Sect Leader") return message.channel.send("You can not shoot the sect leader while you are a sect member!")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
            for (let x = 0; x < cupid.length; x++) {
                let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                if (message.author.nickname === couple[0]) {
                    if (!sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not shoot your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not shoot your lover!")
                }
            }
            db.set(`bullet_jail`, 0)
            dayChat.send(`${getEmoji("bullet", client)} The Jailer executed their prisoner last night! **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** is dead!`)
            guy.roles.add(dead.id)
            guy.roles.remove(alive.id)
            jailedchat.permissionOverwrites.edit(guy.id, {
                SEND_MESSAGES: false,
            })
        } else if (message.channel.name == "priv-marksman") {
            let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let markActive = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `markActive_${dc.chan.id}` : `markActive_${message.channel.id}`}`) || false
            let mark = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `mark_${dc.chan.id}` : `mark_${message.channel.id}`}`)
            let arrows = db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `arrows_${dc.chan.id}` : `arrows_${message.channel.id}`}`) || 2
            let gamePhase = db.get(`gamePhase`)
            if (!db.get(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `arrows_${dc.chan.id}` : `arrows_${message.channel.id}`}`)) {
                db.set(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `arrows_${dc.chan.id}` : `arrows_${message.channel.id}`}`, 2)
            }
            if (mark != null) {
                let guy = message.guild.members.cache.find((m) => m.nickname === mark)
                if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You cannot use the ability now!")
                if (!guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
                if (markActive == false) return message.channel.send("You have just marked a player.")
                if (arrows < 1) return message.channel.send("You don't have any arrows left to shoot players!")
                if (gamePhase % 3 == 0 && fn.peaceCheck(message, db) === true) return message.channel.send({ content: "The Prognosticator activated their power last night. You can't kill anyone." })
                let sectMembers = message.guild.channels.cache.find((c) => c.name === "sect-members")
                if (sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && db.get(`role_${guy.id}`) === "Sect Leader") return message.channel.send("You can not shoot the leader of the sect if you are sected!")
                let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").map((x) => x.id)
                for (let x = 0; x < cupid.length; x++) {
                    let couple = db.get(`couple_${cupid[x]}`) || [0, 0]
                    if (message.author.nickname === couple[0]) {
                        if (!sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[1]) return message.channel.send("You can not shoot your lover!")
                    }
                    if (message.author.nickname === couple[1]) {
                        if (!sectMembers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && guy.nickname === couple[0]) return message.channel.send("You can not shoot your lover!")
                    }
                }
                let role = db.get(`role_${guy.id}`)
                db.subtract(`${db.get(`role_${message.author.id}`) == "Dreamcatcher" ? `arrows_${dc.chan.id}` : `arrows_${message.channel.id}`}`, 1)
                if (role.toLowerCase().includes("wolf") || role == "Fool" || role == "Headhunter" || role == "Serial Killer" || role == "Arsonist" || role == "Bomber" || role == "Bandit" || role == "Illusionist" || role == "Corruptor" || role == "Accomplice" || role == "Sorcerer" || role == "Zombie" || role == "Sect Leader" || role == "Cannibal" || role == "Alchemist" || role == "Hacker") {
                    guy.roles.add(dead.id)
                    guy.roles.remove(alive.id)
                    day.send(`${getEmoji("arrow", client)} The Marksman shot **${guy.nickname} ${guy.user.username} (${role})**!`)
                } else {
                    message.member.roles.add(dead.id)
                    message.member.roles.remove(alive.id)
                    day.send(`${getEmoji("arrow", client)} **${message.member.nickname} ${message.author.username} (Marksman)** tried shotting **${guy.nickname} ${guy.user.username}** but their shot backfired! **${guy.nickname} ${guy.user.username}** is a villager!`)
                }
            }
        }
    },
}
