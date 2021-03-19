const Discord = require("discord.js")
const db = require("quick.db")

module.exports = {
    name: "win",
    run: async (message, args, client) => {
        let narrator = message.guild.roles.cache.get('606139219395608603')
        let mininarr = message.guild.roles.cache.find(r => r.name === "Narrator Trainee")
        let alive = message.guild.roles.cache.find(r => r.name === "Alive")
        let dead = message.guild.roles.cache.find(r => r.name === "Dead")
        let solokillers = ["Serial Killer", "Arsonist", "Bomber", "Cannibal", "Corruptor", "Illusionist", "Bandit", "Accomplice", "Sect Leader", "Zombie"]
        console.log("test")
        console.log(message.member.roles.cache.has(narrator))
        if (message.member.roles.cache.has(narrator.id) || message.member.roles.cache.has(mininarr.id)) {
        console.log("worked")
        if (alive.members.size != "0") return message.channel.send("To use this command, everyone must have the \"Dead\" role!")

        let allPlayers = []
        for (let i = 1 ; i <= dead.members.size ; i++) {
            let guy = message.guild.members.cache.find(m => m.nickname === i.toString())
            if (guy) {
                if (guy.roles.cache.has(dead.id)) {
                    allPlayers.push(guy.id)
                }
            }
        }
        console.log(allPlayers)
        let xp = 0
        let won = ""

        if (args[0].toLowerCase() == "couple") {
            xp = 95
            won = "cwin"
        } else if (args[0].toLowerCase() == "werewolf") {
            xp = 75
            won = "wwin"
        } else if (args[0].toLowerCase() == "village") {
            xp = 55
            won = "vwin"
        } else if (args[0].toLowerCase() == "fool") {
            xp = 150
            won = "svwin"
        } else if (args[0].toLowerCase() == "headhunter") {
            xp = 150
            won = "svwin"
        } else if (args[0].toLowerCase() == "solo") {
            xp = 175
            won = "skwin"
        } else if (args[0].toLowerCase() == "tie") {
            for (let i = 1 ; i <= dead.members.size ; i++) {
                let guy = message.guild.members.cache.find(m => m.nickname === i.toString())
                if (guy) {
                    let role = db.get(`role_${guy.id}`)
                    if (role.toLowerCase().includes("wolf")) {
                        db.add(`wlose_${guy.id}`, 1)
                    } else if (role == "Headhunter" || role == "Fool") {
                        db.add(`svlose_${guy.id}`, 1)
                    } else if (solokillers.includes(role)) {
                        db.add(`sklose_${guy.id}`, 1)
                    } else {
                        db.add(`vlose_${guy.id}`, 1)
                    }
                    if (guy.presence.status != "offline") {
                        db.add(`xp_${guy.id}`, 15)
                        guy.send(
                            new Discord.MessageEmbed()
                            .setTitle("Game Over - Tie")
                            .setDescription("Finished Game:\t\t15xp")
                            .setColor("#FF0000")
                            .setFooter("You lost!")
                        )
                    }
                }
            }
            return
        } else {
            return message.channel.send("Team not found! Available teams: `Couple` `Fool` `Headhunter` `Solo` `Village` `Werewolf`")
        }

        for (let i = 1 ; i < args.length ; i++) {
            let guy = message.guild.members.cache.find(m => m.nickname === args[i]) ||
                message.guild.members.cache.find(m => m.user.username == args[i]) ||
                message.guild.members.cache.get(args[i]) ||
                message.guild.members.cache.find(m => m.user.tag === args[i])
            if (!guy) return message.channel.send(`Player ${args[i]} could not be found!`)
        }

        for (let i = 1 ; i < args.length ; i++) {
            let guy = message.guild.members.cache.find(m => m.nickname === args[i]) ||
                message.guild.members.cache.find(m => m.user.username == args[i]) ||
                message.guild.members.cache.get(args[i]) ||
                message.guild.members.cache.find(m => m.user.tag === args[i])
            if (guy) {
                allPlayers[allPlayers.indexOf(guy.id)] = null
                if (!db.get(`xpreq_${guy.id}`)) {
                    db.set(`xpreq_${guy.id}`, 1000)
                }
                let content = ""
                db.add(`${won}_${guy.id}`, 1)
                db.add(`xp_${guy.id}`, xp)
                db.add(`winstreak_${guy.id}`, 1)
                let t = await guy.send(
                    new Discord.MessageEmbed()
                    .setTitle("Game ended")
                    .setColor("#008800")
                    .setDescription(`Win as ${args[0]}:\t\t${xp}xp`)
                ).catch(e => message.channel.send("I could not send the details to " + guy.user.tag + "!"))
                setTimeout(async () => {
                    if (guy.presence.status !== 'offline')
                    await t.edit(
                        new Discord.MessageEmbed()
                        .setTitle("Game ended")
                        .setColor("#008800")
                        .setDescription(`Win as ${args[0]}:\t\t${xp}xp\nFinished Game:\t\t15xp`)
                    )
                    db.add(`xp_${guy.id}`, 15)
                    content += "Finished Game:\t15xp\n"
                }, 1000)
                setTimeout(async () => {
                    if (db.get(`winstreak_${guy.id}`) > 1) {
                        await t.edit(
                            new Discord.MessageEmbed()
                            .setTitle("Game ended")
                            .setColor("#008800")
                            .setDescription(`Win as ${args[0]}:\t\t${xp}xp\n${content}Win Streak:\t\t25xp`)
                        )
                        db.add(`xp_${guy.id}`, 25)
                    }
                }, 2000)
            }
        }

        // giving xp to dead players
        console.log(allPlayers)
        for (let i = 0 ; i < allPlayers.length ; i++) {
            let guy = message.guild.members.cache.get(allPlayers[i])
            if (guy) {
                if (guy.presence.status !== "offline" ) {
                    if (!db.get(`xpreq_${guy.id}`)) {
                        db.set(`xpreq_${guy.id}`, 1000)
                    }
                    guy.send(
                        new Discord.MessageEmbed()
                        .setTitle("Game Ended")
                        .setColor("#880000")
                        .setDescription("Finished Game:\t\t15xp")
                    ).catch(e => message.channel.send(`I could not send the details to ${guy.user.tag}`))
                    db.add(`xp_${guy.id}`, 15)
                }
                let role = db.get(`role_${guy.id}`)
                let lovers = message.guild.channels.cache.find(c => c.name === "lovers")
                if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL"])) {
                    db.add(`close_${guy.id}`, 1)
                } else if (db.get(`role_${guy.id}`).toLowerCase().includes("wolf") || db.get(`role_${guy.id}`) == "Sorcerer") {
                    if (db.get(`role_${guy.id}`) != "Lone Wolf") {
                        db.add(`wlose_${guy.id}`, 1)
                    } else {
                        db.add(`sklose_${guy.id}`, 1)
                    }
                } else if (db.get(`role_${guy.id}`) == "Fool" || db.get(`role_${guy.id}`) == "Headhunter") {
                    db.add(`svlose_${guy.id}`, 1)
                } else if (role == "Serial Killer" || role == "Bandit" || role == "Accomplice" || role == "Arsonist" || role == "Bomber" || role == "Cannibal" || role == "Corruptor" || role == "Sect Leader" || role == "Zombie" || role == "Illusinoist") {
                    db.add(`sklose_${guy.id}`, 1)
                } else {
                    db.add(`vlose_${guy.id}`, 1)
                }
            }
        }

        // in case if anyone levels up
        for (let o = 1 ; o <= 16; o++) {
            let guy = message.guild.members.cache.find(m => m.nickname === o.toString())
            if (guy) {
                let xp = db.get(`xp_${guy.id}`)
                let xpreq = db.get(`xpreq_${guy.id}`)
                if (xp > xpreq) {
                    db.add(`lootbox_${guy.id}`, 1)
                    db.add(`xpreq_${guy.id}`, xpreq * 3 + (xpreq / 2))
                    db.add(`level_${guy.id}`, 1)
                    guy.send(`Congrats! You have reached level ${db.get(`level_${guy.id}`)}!\n\nYou have recieved a lootbox. To open it, do \`+use lootbox\`.`)
                }
            }
        }
    }
    }
}
