const Discord = require("discord.js")
const db = require("quick.db")
const {fn, xp, roles} = require("../../config.js")

module.exports = {
  name: "win",
  gameOnly: true,
  narratorOnly: true,
  run: async (message, args, client) => {
    if(args.length < 2) message.channel.send(`Please specify the winning team and its players!\n\`\`\`${process.env.PREFIX}win <team> <players>\`\`\``)
    let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
    if (alive.members.size != "0") return message.channel.send('To use this command, everyone must have the "Dead" role! Use `+suicideall` if you need to kill everyone at once.')
    let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
    let soloKillers = roles.filter(x => x.soloKiller)
    

    let allPlayers = []
    for (let i = 1; i <= dead.members.size; i++) {
      let guy = message.guild.members.cache.find((m) => m.nickname === i.toString())
      if (guy) {
        if (guy.roles.cache.has(dead.id)) {
          allPlayers.push(guy.id)
        }
      }
    }
    console.log(allPlayers)
    let giveXP = 0
    let won = ""
    let winTeam = args[0].toLowerCase()
    giveXP = xp.team[winTeam]
    if(!giveXP) return message.channel.send("XP data not found for that team")

    let embed = new Discord.MessageEmbed().setColor("#008800")
    

    if (args[0].toLowerCase() == "couple") {
      won = "cwin"
    } else if (args[0].toLowerCase() == "werewolf") {
      won = "wwin"
    } else if (args[0].toLowerCase() == "village") {
      won = "vwin"
    } else if (args[0].toLowerCase() == "fool") {
      won = "svwin"
    } else if (args[0].toLowerCase() == "headhunter") {
      won = "svwin"
    } else if (args[0].toLowerCase() == "solo") {
      won = "skwin"
    } else if (args[0].toLowerCase() == "tie") {
      for (let i = 1; i <= dead.members.size; i++) {
        let guy = message.guild.members.cache.find((m) => m.nickname === i.toString())
        if (guy) {
          let role = db.get(`role_${guy.id}`)
          if (role.toLowerCase().includes("wolf")) {
            db.add(`wlose_${guy.id}`, 1)
          } else if (role == "Headhunter" || role == "Fool") {
            db.add(`svlose_${guy.id}`, 1)
          } else if (config. solokillers.includes(role)) {
            db.add(`sklose_${guy.id}`, 1)
          } else {
            db.add(`vlose_${guy.id}`, 1)
          }
          db.set(`winstreak_${guy.id}`, 0)
          if (guy.presence.status != "offline") {
            db.add(`xp_${guy.id}`, xp.team.tie)
            guy.send(embed.setTitle("Game Over - Tie").setDescription("Finished Game: 15xp").setFooter("You lost!").setColor(0xff0000))
          }
        }
      }
      return
    }

    for (let i = 1; i < args.length; i++) {
      let guy = message.guild.members.cache.find((m) => m.nickname === args[i]) || message.guild.members.cache.find((m) => m.user.username == args[i]) || message.guild.members.cache.get(args[i]) || message.guild.members.cache.find((m) => m.user.tag === args[i])
      if (!guy) return message.channel.send(`Player ${args[i]} could not be found!`)
    }

    for (let i = 1; i < args.length; i++) {
      let guy = message.guild.members.cache.find((m) => m.nickname === args[i]) || message.guild.members.cache.find((m) => m.user.username == args[i]) || message.guild.members.cache.get(args[i]) || message.guild.members.cache.find((m) => m.user.tag === args[i])
      if (guy) {
        allPlayers[allPlayers.indexOf(guy.id)] = null
        if (!db.get(`xpreq_${guy.id}`)) {
          db.set(`xpreq_${guy.id}`, 1000)
        }
        let fwotd = db.get(`firstwinoftheday_${guy.id}`) || -1
        let today = new Date().getDate()
        let themsg = `Win as ${args[0]} ${xp}xp`
        db.add(`${won}_${guy.id}`, 1)
        db.add(`xp_${guy.id}`, xp)
        db.add(`winstreak_${guy.id}`, 1)
        let t = await guy.send(embed.setTitle("Game Over").setColor("#008800").setDescription(`Win as ${args[0]}: ${xp}xp`)).catch((e) => message.channel.send("I could not send the details to " + guy.user.tag + "!"))
        setTimeout(async () => {
          if (guy.presence.status !== "offline") await t.edit(embed.setTitle("Game Ended").setDescription(`${themsg}\nFinished Game: 15xp`))
          themsg += `\nFinished Game: 15xp`
          db.add(`xp_${guy.id}`, xp[finishGame])
        }, 1000)
        setTimeout(async () => {
          if (db.get(`winstreak_${guy.id}`) > 1) {
            await t.edit(embed.setTitle("Game Ended").setDescription(`${themsg}\nWin Streak: 25xp`))
            db.add(`xp_${guy.id}`, xp[winStreak])
            themsg += `\nWin Streak: ${xp[winStreak]}xp`
          }
        }, 2000)
        setTimeout(async () => {
          if (fwotd < today) {
            await t.edit(embed.setTitle("Game Ended").setDescription(`${themsg}\nFirst win of the day:\t${xp[firstWinOfTheDay]}xp`))
            db.add(`xp_${guy.id}`, xp[firstWinOfTheDay])
            db.set(`firstwinoftheday_${guy.id}`, today)
            themsg += `\nFirst win of the day:\t${xp[firstWinOfTheDay]}xp`
          }
        }, 3000)
      }
    }

    // giving giveXP to dead players
    console.log(allPlayers)
    for (let i = 0; i < allPlayers.length; i++) {
      let guy = message.guild.members.cache.get(allPlayers[i])
      if (guy) {
        db.set(`winstreak_${guy.id}`, 0)
        if (guy.presence.status !== "offline") {
          if (!db.get(`xpreq_${guy.id}`)) {
            db.set(`xpreq_${guy.id}`, 1000)
          }
          guy.send(embed.setTitle("Game Ended").setColor("#880000").setDescription("Finished Game: 15xp")).catch((e) => message.channel.send(`I could not send the details to ${guy.user.tag}`))
          db.add(`xp_${guy.id}`, 15)
        }
        let role = db.get(`role_${guy.id}`)
        let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
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
    for (let o = 1; o <= 16; o++) {
      let guy = message.guild.members.cache.find((m) => m.nickname === o.toString())
      if (guy) {
        fn.updateXP(guy.id, client)
      }
    }
    message.channel.send("Done!")
  },
}
