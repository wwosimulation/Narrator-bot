const shuffle = require("shuffle-array")
const Discord = require("discord.js")
const db = require("quick.db")
const pull = require("array-pull")
const { getRole, fn } = require("../../config.js")

module.exports = {
  name: "srole2",
  gameOnly: true,
  narratorOnly: true,
  run: async (message, args, client) => {
    const emote = (name) => {
      name.replace("-", " ")
      return client.guilds.cache.get("465795320526274561").emojis.cache.find((e) => e.name.toLowerCase() === name.replace(" ", "_").toLowerCase())
    }
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
    let random = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "cupid", "cursed", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch", "president", "detective", "forger", "fortune-teller", "gunner", "jailer", "medium", "seer", "alpha-werewolf", "guardian-wolf", "junior-werewolf", "kitten-wolf", "nightmare-werewolf", "shadow-wolf", "werewolf", "werewolf-berserk", "wolf-pacifist", "wolf-seer", "wolf-shaman", "sorcerer", "alchemist", "arsonist", "bandit", "bomber", "cannibal", "corruptor", "illusionist", "sect-leader", "serial-killer", "zombie", "fool", "headhunter"]
    let rrv = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch"]
    let rsv = ["detective", "forger", "fortune-teller", "gunner", "jailer", "medium", "seer"]
    let rww = ["alpha-werewolf", "guardian-wolf", "junior-werewolf", "kitten-wolf", "nightmare-werewolf", "shadow-wolf", "werewolf", "werewolf-berserk", "wolf-pacifist", "wolf-seer", "wolf-shaman"]
    let rk = ["alchemist", "arsonist", "bandit", "bomber", "cannibal", "corruptor", "illusionist", "sect-leader", "serial-killer", "zombie"]
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
      let sd = shuffle(seerdet)
      let jw = shuffle(jailerwitch)
      let as = shuffle(alphashaman)
      let sc = shuffle(skcanni)
      rv = shuffle(rv)
      roleOptions = [
        ["Aura Seer", "Medium", "Jailer", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", rv[0], "Bodyguard", "Gunner", "Wolf Shaman", "Aura Seer", "Illusionist", "Cursed", "Wolf Seer", "Priest"],
        ["Aura Seer", "Medium", "Witch", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", rv[0], "Beast Hunter", "Gunner", "Wolf Shaman", "Aura Seer", "Bomber", "Cursed", "Wolf Seer", "Avenger"],
        ["Aura Seer", "Medium", jw[0], "Werewolf", "Doctor", as[0], sd[0], rv[0], "Beast Hunter", "Marksman", "Junior Werewolf", "Tough Guy", sc[0], "Cursed", "Wolf Seer", "Priest"],
        ["Aura Seer", "Medium", "Witch", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", rv[0], "Cupid", "Gunner", "Wolf Shaman", "Detective", "Cannibal", "Cursed", "Wolf Seer", "Avenger"],
        ["Aura Seer", "Medium", "Jailer", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", rv[0], "Bodyguard", "Gunner", "Junior Werewolf", "Detective", "Arsonist", "Cursed", "Wolf Seer", "Priest"],
        ["Aura Seer", "Medium", "Jailer", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", rv[0], "Bodyguard", "Gunner", "Wolf Shaman", "Mayor", "Corruptor", "Cursed", "Wolf Seer", "Avenger"],
      ]
    } else if (gamemode == "ranked") {
      if (alive.members.size < 9) {
        rww.splice(rww.indexOf("Shadow Wolf"), 1)
        rww.splice(rww.indexOf("Werewolf Berserk"), 1)
        rww.splice(rww.indexOf("Junior Werewolf"), 1)
        rww.splice(rww.indexOf("Guardian Wolf"), 1)
      }

      roleOptions = [
        ["Aura Seer", rww[Math.floor(Math.random() * rww.length)], rrv[Math.floor(Math.random() * rrv.length)], "Doctor", rrv[Math.floor(Math.random() * rrv.length)], "Wolf Seer", "Marksman", "Headhunter", "Junior Werewolf", "Medium", "Jailer", "Arsonist", "Detective", rww[Math.floor(Math.random() * rww.length)], "Priest", rrv[Math.floor(Math.random() * rrv.length)]],
        ["Spirit Seer", rww[Math.floor(Math.random() * rww.length)], rrv[Math.floor(Math.random() * rrv.length)], "Doctor", rrv[Math.floor(Math.random() * rrv.length)], "Wolf Seer", "Gunner", "Fool", "Junior Werewolf", "Medium", "Witch", "Cannibal", "Detective", rww[Math.floor(Math.random() * rww.length)], "Priest", rrv[Math.floor(Math.random() * rrv.length)]],
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
      if (alcrk == "rk") alcrk = shuffle(rk)
      if (juniorrww == "rww") juniorrww = shuffle(rww)
      roleOptions.push([auraspirit[0], "alpha-werewolf", docbg[0], rrv[0], beastbunny[0], "wolf-seer", gunnermarks[0], rv[0], jailerftwitch[0], alcrk[0], "medium", "seer", pacishadownmber[0], rrv[0], juniorrww[0], cupidgr[0]])
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
    finalRoleList.forEach((x) => {
      let role = getRole(x)
      if (!role || role.name == "Unknown Role") {
        cancel = true
        return message.channel.send(`Unable to find the ${x} role!`)
      }
      if(["zombie", "bandit", "accomplice"].includes(role.name)) {
        cancel = true 
        return message.channel.send(`The ${role.name} role is currently not available`)
      }
    })
    if (cancel) return message.channel.send("srole canceled")
    shuffle(finalRoleList)
    for (let k = 0; k < alive.members.size; k++) {
      let theirRole = finalRoleList[k]
      let role = getRole(theirRole)
      rolelist.push(theirRole)
      let guy = message.guild.members.cache.find((x) => x.nickname == `${k + 1}`)
      dcMessage.push(`${emote(role.name)} ${role.name}`)
      let lol = await message.guild.channels.create(`priv-${theirRole.replace(" ", "-")}`, {
        parent: "748959630520090626",
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: guy.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
          },
          {
            id: narrator.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"],
          },
          {
            id: mininarr.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"],
          },
        ],
      })

      allChannels.push(lol)
      if (role.name.toLowerCase().includes("wolf")) {
        wwsChat.updateOverwrite(guy.id, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
          READ_MESSAGE_HISTORY: true,
        })
        allWolves.push(`**${guy.nickname} ${guy.user.username}** is the ${role.name}!`)
      } else if (role.name == "Sorcerer") {
        wwchat.updateOverwrite(guy.id, {
          SEND_MESSAGES: false,
          VIEW_CHANNEL: true,
          READ_MESSAGE_HISTORY: true,
        })
        allWolves.push(`**${guy.nickname} ${guy.user.username}** is the ${role.name}!`)
      }
      if (role.name == "President") {
        guy.roles.add(revealed)
        setTimeout(() => {
          dayChat.send(`<:president:583672720932208671> Player **${guy.nickname} ${guy.user.username}** is the **President**!`)
        }, 15000)
      }

      if (role.name.toLowerCase().includes("zombie")) {
        zomb.updateOverwrite(guy.id, {
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
            e.updateOverwrite(guy.id, {
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true,
              READ_MESSAGE_HISTORY: true,
            })
          }
          if (occupied == true) {
            if (qah == bandits.keyArray("id").length) {
              let t = await message.guild.channels.create("bandits", {
                parent: "606250714355728395",
                permissionOverwrites: [
                  {
                    id: guy.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                  },
                  {
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"],
                  },
                  {
                    id: narrator.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"],
                  },
                  {
                    id: mininarr.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"],
                  },
                ],
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
    }

    let dcSent = await dayChat.send(gamemode.includes("hide") ? "Role list is hidden" : `${gamemode.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())} Game:\n${shuffle(dcMessage).join("\n")}`)
    dcSent.pin()
    dayChat.updateOverwrite(alive, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: true,
      READ_MESSAGE_HISTORY: true,
    })
    client.commands.get("playerinfo").run(message, args, client)
    message.channel.send("If everything looks correct, use `+startgame` to start the game!")
  },
}
