const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "shoot",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-gunner") {
            if (!db.get(`bullets_${message.channel.id}`)) {
                db.set(`bullets_${message.channel.id}`, 1)
            }
            let bullets = db.get(`bullets_${message.channel.id}`) ? db.get(`bullets_${message.channel.id}`) : "None"
            if (bullets == "None") {
                db.set(`bullets_${message.channel.id}`, 2)
                bullets = db.get(`bullets_${message.channel.id}`)
            }
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let dayCount = db.get(`dayCount`)
            let isDay = db.get(`isDay`)
            let voting = db.get(`commandEnabled`)
            console.log("tets")
            if (message.member.roles.cache.has(dead.id)) return message.channel.send("Shooting while dead just shows you how much IQ you have. Probably -200 and below.")
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])

            if (isDay != "yes") return message.channel.send("Uh no. Sleep is very important to you.")
            if (!guy || guy == message.member || !guy.roles.cache.has(alive.id)) return message.reply("Invalid target!")
            if (bullets > 0) {
                if (dayCount == 1) {
                    if (voting != "yes") return message.channel.send("You can only shoot when voting starts since this is Day 1.")
                }
                let sectMembers = message.guild.channels.cache.find((c) => c.name === "sect-members").members()
                if (sectMembers.find((m) => m.id === message.author.id) && db.get(`role_${guy.id}`) === "Sect Leader") return message.channel.send("You can not shoot the leader of the sect if you are sected!")
                let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").keyArray("id")
                for (let x = 0; x < cupid.length; x++) {
                    db.get(`couple_${cupid[x]}`)
                    if (message.author.nickname === couple[0]) {
                        if (!sectMembers.find((m) => m.id === message.author.id) && guy.nickname === couple[1]) return message.channel.send("You can not shoot your lover!")
                    }
                    if (message.author.nickname === couple[1]) {
                        if (!sectMembers.find((m) => m.id === message.author.id) && guy.nickname === couple[0]) return message.channel.send("You can not shoot your lover!")
                    }
                }
                if (db.get(`did_${message.channel.id}`) == dayCount) return message.channel.send("You already shot today. Get chill pill from dank memer man!")
                if (db.get(`role_${guy.id}`) == "President") return message.channel.send("Even if you are coupled or sected, you can't shoot the President!")
                dayChat.send(`${getEmoji("bullet", client)} **${message.member.nickname} ${message.author.username} (Gunner)** shot **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
                message.member.roles.add(revealed.id)
                guy.roles.add(dead.id)
                guy.roles.remove(alive.id)
                db.subtract(`bullets_${message.channel.id}`, 1)
                db.set(`did_${message.channel.id}`, dayCount)
            }
        } else if (message.channel.name == "priv-jailer") {
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let jailedchat = message.guild.channels.cache.find((c) => c.name === "jailed-chat")
            let isDay = db.get(`isDay`)
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You aren't alive")
            let jailed = db.get(`jail_${message.channel.id}`)
            let guy = message.guild.members.cache.find((m) => m.nickname === jailed)
            if (!guy.roles.cache.has(alive.id)) return message.channel.send("This player is already dead -_-")
            let bullet = db.get(`bullet_jail`) ? db.get(`bullet_jail`) : 1
            if (isDay == "yes") return message.channel.send("Nice, killing in the day when no one is jailed.")
            if (bullet == 0) return message.channel.send("You already used your bullet")
            let sectMembers = message.guild.channels.cache.find((c) => c.name === "sect-members").members()
            if (sectMembers.find((m) => m.id === message.author.id) && db.get(`role_${guy.id}`) === "Sect Leader") return message.channel.send("You can not shoot the leader of the sect if you are sected!")
            let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").keyArray("id")
            for (let x = 0; x < cupid.length; x++) {
                db.get(`couple_${cupid[x]}`)
                if (message.author.nickname === couple[0]) {
                    if (!sectMembers.find((m) => m.id === message.author.id) && guy.nickname === couple[1]) return message.channel.send("You can not shoot your lover!")
                }
                if (message.author.nickname === couple[1]) {
                    if (!sectMembers.find((m) => m.id === message.author.id) && guy.nickname === couple[0]) return message.channel.send("You can not shoot your lover!")
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
            let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let markActive = db.get(`markActive_${message.channel.id}`) || false
            let mark = db.get(`mark_${message.channel.id}`)
            let arrows = db.get(`arrows_${message.channel.id}`) || 2
            if (!db.get(`arrows_${message.channel.id}`)) {
                db.set(`arrows_${message.channel.id}`, 2)
            }
            if (mark != null) {
                let guy = message.guild.members.cache.find((m) => m.nickname === mark)
                if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You are dead. You can't shoot nucklehead")
                if (!guy.roles.cache.has(alive.id)) return message.channel.send("The player you are trying to kill is dead. Mark someone else dude.")
                if (markActive == false) return message.channel.send("You just marked a player. Chill dude")
                if (arrows < 1) return message.channel.send("You don't have any arrows left to shoot players!")
                let sectMembers = message.guild.channels.cache.find((c) => c.name === "sect-members").members()
                if (sectMembers.find((m) => m.id === message.author.id) && db.get(`role_${guy.id}`) === "Sect Leader") return message.channel.send("You can not shoot the leader of the sect if you are sected!")
                let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").keyArray("id")
                for (let x = 0; x < cupid.length; x++) {
                    db.get(`couple_${cupid[x]}`)
                    if (message.author.nickname === couple[0]) {
                        if (!sectMembers.find((m) => m.id === message.author.id) && guy.nickname === couple[1]) return message.channel.send("You can not shoot your lover!")
                    }
                    if (message.author.nickname === couple[1]) {
                        if (!sectMembers.find((m) => m.id === message.author.id) && guy.nickname === couple[0]) return message.channel.send("You can not shoot your lover!")
                    }
                }
                let role = db.get(`role_${guy.id}`)
                db.subtract(`arrows_${message.channel.id}`, 1)
                if (role.toLowerCase().includes("wolf") || role == "Fool" || role == "Headhunter" || role == "Serial Killer" || role == "Arsonist" || role == "Bomber" || role == "Bandit" || role == "Illusionist" || role == "Corruptor" || role == "Accomplice" || role == "Sorcerer" || role == "Zombie" || role == "Sect Leader" || role == "Cannibal" || role == "Alchemist") {
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
