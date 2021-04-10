const shuffle = require("shuffle-array");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "srole",
    gameOnly: true,
    run: async (message, args, client) => {
    function random(x) {
      return Math.floor(Math.random() * x.length)
    }
    if (message.guild.id != "472261911526768642") return; 
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let mininarr = message.guild.roles.cache.find(
      r => r.name === "Narrator Trainee"
    );
    let narrator = message.guild.roles.cache.find(r => r.name === "Narrator");
    let bot = message.guild.roles.cache.find(r => r.name === "Bots")
    let wwsChat = message.guild.channels.cache.find(
      c => c.name === "werewolves-chat"
    );
    let dayChat = message.guild.channels.cache.find(c => c.name === "day-chat");
    let gamlobi = message.guild.channels.cache.find(
      c => c.name === "game-lobby"
    );
    let sib = message.guild.channels.cache.find(c => c.name === "sibling-chat")
    
    let bandits = message.guild.channels.cache.find(c => c.name === "bandits")
    let sl = message.guild.channels.cache.find(c => c.name === `sect-members`)
    let zomb = message.guild.channels.cache.find(c => c.name === "zombies")
    db.set(`${message.guild.id}_usedChannels`, [])
    let usedChannels = []

    if (
      !message.member.roles.cache.has(mininarr.id) &&
      !message.member.roles.cache.has(narrator.id)
    )
      return;
    args.forEach(arg => {
      args[args.indexOf(arg)] = arg.toLowerCase()
    })
    if (args[0] == "quick") {
        let allplayers = []
        for (let x = 0 ; x < alive.members.size ; x++) {
            let guy = message.guild.members.cache.find(m => m.nickname === (x+1).toString())
            if (!guy) return message.channel.send(`Player ${x+1} could not be found!`)
            allplayers.push(guy.id)
        }
        
        let seerdet = ["Seer", "Detective"]
        let jailerwitch = ["Jailer", "Witch"]
        let alphashaman = ["Alpha Werewolf", "Wolf Shaman"]
        let skcanni = ["Illusionist", "Cannibal"]
        let foolhh = ["Fool", "Headhunter"]
        
        let sd = shuffle(seerdet)
        let jw = shuffle(jailerwitch)
        let as = shuffle(alphashaman)
        let sc = shuffle(skcanni)
        let fh = shuffle(foolhh)
      
        let roles = [
          ["Aura Seer", "Medium", "Jailer", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", fh[0], "Bodyguard", "Gunner", "Wolf Shaman", "Aura Seer", "Illusionist", "Cursed", "Wolf Seer", "Priest"],
          ["Aura Seer", "Medium", "Witch", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", fh[0], "Beast Hunter", "Gunner", "Wolf Shaman", "Aura Seer", "Bomber", "Cursed", "Wolf Seer", "Avenger"],
          ["Aura Seer", "Medium", jw[0], "Werewolf", "Doctor", as[0], sd[0], fh[0], "Beast Hunter", "Marksman", "Junior Werewolf", "Tough Guy", sc[0], "Cursed", "Wolf Seer", "Priest"],
          ["Aura Seer", "Medium", "Witch", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", fh[0], "Cupid", "Gunner", "Wolf Shaman", "Detective", "Cannibal", "Cursed", "Wolf Seer", "Avenger"],
          ["Aura Seer", "Medium", "Jailer", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", fh[0], "Bodyguard", "Gunner", "Junior Werewolf", "Detective", "Arsonist", "Cursed", "Wolf Seer", "Priest"],
          ["Aura Seer", "Medium", "Jailer", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", fh[0], "Bodyguard", "Gunner", "Wolf Shaman", "Mayor", "Corruptor", "Cursed", "Wolf Seer", "Avenger"]
        ]
        
        shuffle(roles)
        
        let newrole = []
        let gr = ''
        for (let k = 0 ; k < alive.members.size ; k++) {
          newrole.push(roles[0][k])
          gr += `${client.emojis.cache.find(e => e.name === roles[0][k].toLowerCase().replace(" ", "_"))} ${k+1}. ${roles[0][k]}\n`
        }

        let daychat = message.guild.channels.cache.find(c => c.name === "day-chat")
        daychat.send(gr).then(msg => msg.pin())
        
        shuffle(newrole)
        
        let allchan = []
        let spechan = []
        
        for (let k = 0 ; k < newrole.length ; k++) {
            
            let chan = message.guild.channels.cache.filter(c => c.name === newrole[k].toLowerCase().replace(" ", "-")).keyArray("id")
            chan.forEach(e => allchan.push(e))
            spechan.push(chan)
          
        }
        
        allchan.sort(function (a, b) { return a - b })
      
        for (let k = 0 ; k < allchan.length ; k++) {
          
          if (allchan[k] == allchan[k + 1]) {
          allchan.splice(k + 1, 1)
          k = k - 1
            
        }
          
        }
        allplayers.forEach(async e => {
            
            let guy = message.guild.members.cache.get(e)
            let role = newrole[allplayers.indexOf(e)]
            let seechan = spechan[allplayers.indexOf(e)][0]
            
            if (allchan.indexOf(seechan) == "-1") {
                let tehstart = 0
                while (allchan.indexOf(seechan) == "-1") {
                    tehstart++
                    seechan = spechan[allplayers.indexOf(e)][tehstart]
                    if (!seechan) {
                        let uwu = await message.guild.channels.create(`priv-${role.toLowerCase().replace(" ", "-")}`, {
                            parent: "748959630520090626",
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: ["VIEW_CHANNEL"]
                                },
                                {
                                    id: narrator.id,
                                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "MANAGE_CHANNELS"]
                                },
                                {
                                    id: mininarr.id,
                                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "MANAGE_CHANNELS"]
                                }
                            ]
                        })
                        await uwu.send(`${db.get(`roleinfo_${role.toLowerCase()}`)}`).then(msg => msg.pin())
                        usedChannels.push(uwu.id)
                        seechan = uwu.id
                    }
                }
            }
            let thechan = message.guild.channels.cache.get(seechan)
            usedChannels.push(thechan.id)
            db.set(`role_${guy.id}`, role)
            allchan.splice(allchan.indexOf(seechan), 1)
            thechan.updateOverwrite(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true
            })
            let wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
            if (role.toLowerCase().includes("wolf")) {
                wwchat.updateOverwrite(guy.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                })
                wwchat.send(`**${guy.nickname} ${guy.user.username}** is the ${role}!`)
            } else if (role == "Sorcerer") {
                wwchat.updateOverwrite(guy.id, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                })
                wwchat.send(`**${guy.nickname} ${guy.user.username}** is the ${role}!`)
            }
            
        })
      
        
      setTimeout(() => {
          daychat.send(`Night 1 has started ${alive}!`)
          client.commands.get("playerinfo").run(message, args, client)
          client.commands.get("startgame").run(message, args, client)
      }, 3000)
    } else if (args[0] == "sandbox") {
      message.channel.send("Sandbox hasn't been implemented yet, use the sandbox list with -srole custom")
    } else if (args[0] == "ranked") {
      let rrv = ["Aura Seer", "Avenger", "Beast Hunter", "Bodyguard", "Doctor", "Flower Child", "Grumpy Grandma", "Loudmouth", "Marksman", "Priest", "Red Lady", "Sheriff", "Spirit Seer", "Tough Guy", "Villager", "Witch"]
      let rww = ["Alpha Werewolf", "Guardian Wolf", "Junior Werewolf", "Nightmare Werewolf", "Shadow Wolf", "Werewolf Berserk", "Wolf Pacifist", "Wolf Seer", "Wolf Shaman"]
      let rv = ["Fool", "Headhunter"]

      if (alive.members.size < 9) {
        rww.splice(rww.indexOf("Shadow Wolf"), 1)
        rww.splice(rww.indexOf("Werewolf Berserk"), 1)
        rww.splice(rww.indexOf("Junior Werewolf"), 1)
        rww.splice(rww.indexOf("Guardian Wolf"), 1)
      }
      
      let rolelist1 = ["Aura Seer", rww[Math.floor(Math.random() * rww.length)], rrv[Math.floor(Math.random() * rrv.length)], "Doctor", rrv[Math.floor(Math.random() * rrv.length)], "Wolf Seer", "Marksman", "Headhunter", "Junior Werewolf", "Medium", "Jailer", "Arsonist", "Detective", rww[Math.floor(Math.random() * rww.length)], "Priest", rrv[Math.floor(Math.random() * rrv.length)]]
      let rolelist2 = ["Spirit Seer", rww[Math.floor(Math.random() * rww.length)], rrv[Math.floor(Math.random() * rrv.length)], "Doctor", rrv[Math.floor(Math.random() * rrv.length)], "Wolf Seer", "Gunner", "Fool", "Junior Werewolf", "Medium", "Witch", "Cannibal", "Detective", rww[Math.floor(Math.random() * rww.length)], "Priest", rrv[Math.floor(Math.random() * rrv.length)]]
      let roles = [rolelist1, rolelist2]
      let rolelist = roles[Math.floor(Math.random() * 2)]
      function emote(nama) {
        return client.guilds.cache.get('465795320526274561').emojis.cache.find(e => e.name === nama.replace(" ", "_")))
      }
      dayChat.send(
        `RANKED GAME:\n
        ${emote(rolelist[0].toLowerCase())} 1. ${rolelist[0]}
        ${emote('random-werewolf')} 2. Random Werewolf
        ${emote('random_regular_villager')} 3. Random Regular Villager
        ${emote('doctor')} 4. Doctor
        ${emote('random_regular_villager')} 5. Random Regular Villager
        ${emote('wolf_seer')} 6. Wolf Seer
        ${emote(rolelist[6].toLowerCase())} 7. ${rolelist[6]}
        ${emote(rolelist[7].toLowerCase())} 8. ${rolelist[7]}
        ${emote('junior_werewolf')} 9. Junior Werewolf
        ${emote('medium')} 10. Medium
        ${emote(rolelist[10].toLowerCase())} 11. ${rolelist[10]}
        ${emote(rolelist[11].toLowerCase())} 12. ${rolelist[11]}
        ${emote(rolelist[12])} 13. ${rolelist[12]}
        ${emote('random_regular_villager')} 14. Random Regular Villager
        ${emote('priest')} 15. Priest
        ${emote('random_regular_villager')} 16. Random Regular Villager`
        )
      let newrole = []
      for (let k = 0 ; k < alive.members.size ; k++) {
        newrole.push(rolelist[k].toLowerCase())
      }
      shuffle(newrole)
        for (let j = 0 ; j < alive.members.size ; j++) {
          let guy = message.guild.members.cache.find(m => m.nickname === (j+1).toString())
          let lol = await message.guild.channels.create(`priv-${newrole[j].replace(' ', '-')}`, {
            parent: '748959630520090626',
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"]
              }, {
                id: guy.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
              }, {
                id: narrator.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"]
              },
              {
                id: mininarr.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"]
              }
            ]
          })
          
          if (newrole[j].toLowerCase().includes("wolf")) {
            wwsChat.updateOverwrite(guy.id, {
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true,
              READ_MESSAGE_HISTORY: true
            })
          }

          await lol.send(db.get(`roleinfo_${newrole[j].toLowerCase()}`))
          let um = await lol.send(`${alive}`)
          await um.delete({ timeout: 3000 })
          db.set(`role_${guy.id}`, newrole[j])        
        }
        setTimeout(function () {
          client.commands.get("playerinfo").run(message, args, client) 
          client.commands.get("startgame").run(message, args, client)
        }, 5000)

    } else if (args[0].includes("custom")) {
      let rolelist = []
      let randoms = ["rrv", "rv", "rsv", "rww", "rk", "random", "random-regular-villager", "random-voting", "random-strong-villager", "random-werewolf", "random-killer"]
      let random = [
        "aura-seer", "avenger", "beast-hunter", "bodyguard", 
        "cupid", "cursed", "doctor", "flower-child", 
        "grave-robber", "grumpy-grandma", "loudmouth", 
        "marksman", "mayor", "pacifist", "priest", 
        "red-lady", "seer-apprentice", "sheriff", "spirit-seer", 
        "tough-guy", "villager", "witch", "president",
        "detective", "forger", "fortune-teller", 
        "gunner", "jailer", "medium", "seer", 
        "alpha-werewolf", "guardian-wolf", "junior-werewolf",
        "kitten-wolf", "nightmare-werewolf", "shadow-wolf",
        "werewolf", "werewolf-berserk", "wolf-pacifist", 
        "wolf-seer", "wolf-shaman", "sorcerer", 
        "alchemist", "arsonist", "bandit", "bomber", 
        "cannibal", "corruptor", "illusionist", 
        "sect-leader", "serial-killer", "zombie", "fool",
        "headhunter"]
      let rrv = ["aura-seer", "avenger", "beast-hunter", "bodyguard", "doctor", "flower-child", "grave-robber", "grumpy-grandma", "loudmouth", "marksman", "mayor", "pacifist", "priest", "red-lady", "seer-apprentice", "sheriff", "spirit-seer", "tough-guy", "villager", "witch"]
      let rsv = ["detective", "forger", "fortune-teller", "gunner", "jailer", "medium", "seer"]
      let rww = ["alpha-werewolf", "guardian-wolf", "junior-werewolf", "kitten-wolf", "nightmare-werewolf", "shadow-wolf", "werewolf", "werewolf-berserk", "wolf-pacifist", "wolf-seer", "wolf-shaman"]
      let rk = ["alchemist", "arsonist", "bandit", "bomber", "cannibal", "corruptor", "illusionist", "sect-leader", "serial-killer", "zombie"]
      let rv = ["fool", "headhunter"]
      for (let i = 1 ; i < args.length ; i++) {
        if (!randoms.includes(args[i])) {
          let chan = message.guild.channels.cache.find(c => c.name === `priv-${args[i]}`)
          if (!chan) return message.channel.send(`Channel ${args[i]} was not found!`)
        }
      }
      for (let i = 1 ; i <= alive.members.size ; i++) {
        let guy = message.guild.members.cache.find(m => m.nickname === i.toString())
        if (!guy) return message.channel.send(`Player ${i} could not be found!`)
      }

      if (args.length - 1 != alive.members.size) {
        return message.channel.send("The number of roles do not match the number of players!")
      }
      
      // checking if any player has a channel
      let exists = false
      let allchan =  message.guild.channels.cache.filter(c => c.name.startsWith("priv"));
      for (let a = 0 ; a < allchan.keyArray("id").length ; a++) {
        let chan = message.guild.channels.cache.get(allchan.keyArray("id")[a])
        if (chan) {
          for (let b = 1 ; b <= alive.members.size ; b++) {
            let tt = message.guild.members.cache.find(m => m.nickname === b.toString())
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
        return ;
      }
      
      let roles = []
      
      for (let i = 1 ; i < args.length ; i++) {
        rolelist.push(args[i])
      }
      rolelist = rolelist.join("\n")
      rolelist = rolelist.replace(/\nrrv/g, "\nrandom-regular-villager")
      rolelist = rolelist.replace(/\nrv/g, "\nrandom-voting")
      rolelist = rolelist.replace(/\nrsv/g, "\nrandom-strong-villager")
      rolelist = rolelist.replace(/\nrww/g, "\nrandom-werewolf")
      rolelist = rolelist.replace(/\nrk/g, "\nrandom-killer")
      message.channel.send(rolelist)
      rolelist = rolelist.split("\n")
      
      for (let i = 1 ; i < args.length ; i++) {
        if (args[i].toLowerCase() == "president") {
          random.splice(random.indexOf("President"), 1)
        }
        if (args[i].toLowerCase() == "cupid") {
          random.splice(random.indexOf("cupid"), 1)
        }
        if (args[i].toLowerCase() == "jailer") {
          random.splice(random.indexOf("jailer"), 1)
          rsv.splice(random.indexOf("jailer"), 1)
        }
        if (args[i].toLowerCase() == "sect-leader") {
          random.splice(random.indexOf("sect-leader"), 1)
          rk.splice(random.indexOf("sect-leader"), 1)
        }
        
      }
      
      for (let i = 1 ; i < args.length ; i++) {
        
        let excludes = db.get(`excludes`) || []
        // rrv
        if (["rrv", "random-regular-villager"].includes(args[i])) {
          
          excludes.forEach(role => {
            let indexrole = rrv.indexOf(role)
            if (indexrole > -1) {
              rrv.splice(indexrole, 1)
            }
          })
          let torole = rrv[Math.floor(Math.random() * rrv.length)]
          args[i] = torole
        }
        
        //rsv
        if (["rsv", "random-strong-villager"].includes(args[i])) {
          
          excludes.forEach(role => {
            let indexrole = rsv.indexOf(role)
            if (indexrole > -1) {
              rsv.splice(indexrole, 1)
            }
          })
          let torole = rsv[Math.floor(Math.random() * rsv.length)]    
          if (torole == "jailer") {
            rsv.splice(rsv.indexOf(torole), 1)
          }
          args[i] = torole
        }
        
       //rww
        if (["rww", "random-werewolf"].includes(args[i])) {
          
          excludes.forEach(role => {
            let indexrole = rww.indexOf(role)
            if (indexrole > -1) {
              rww.splice(indexrole, 1)
            }
          })
          let torole = rww[Math.floor(Math.random() * rww.length)]
          args[i] = torole
        }
        
        //rk
        if (["rk", "random-killer"].includes(args[i])) {
          
          excludes.forEach(role => {
            let indexrole = rk.indexOf(role)
            if (indexrole > -1) {
              rk.splice(indexrole, 1)
            }
          })
          let torole = random[Math.floor(Math.random() * random.length)]    
          if (torole == "sect-leader") {
            rk.splice(rk.indexOf(torole), 1)
          }
          args[i] = torole
        }
        
        //rv
        if (["rv", "random-voting"].includes(args[i])) {
            
            excludes.forEach(role => {
            let indexrole = rv.indexOf(role)
            if (indexrole > -1) {
              rv.splice(indexrole, 1)
            }
          })
          let torole = rv[Math.floor(Math.random() * rv.length)]
          args[i] = torole
        }
        
        //general
        if (["random"].includes(args[i])) {
          
            excludes.forEach(role => {
            let indexrole = random.indexOf(role)
            if (indexrole > -1) {
              random.splice(indexrole, 1)
            }
          })
          let torole = random[Math.floor(Math.random() * random.length)]
          if (["president", "cupid", "jailer", "sect-leader"].includes(torole)) {
            random.splice(random.indexOf(torole), 1)
            if (torole == "Jailer") {
              rsv.splice(rsv.indexOf(torole), 1)
            }
            if (torole == "sect-leader") {
              rk.splice(rk.indexOf(torole), 1)
            }
          }
          args[i] = torole
        }
        
        roles.push(args[i])
      }
      let channeloccupied
      shuffle(roles)
      let embed = new Discord.MessageEmbed().setTitle(`Roles for ${alive.members.size} players!`).setColor("#008800")
      let allusers = []
      for (let i = 1 ; i <= alive.members.size ; i++) {
        let guy = message.guild.members.cache.find(m => m.nickname === i.toString())
        allusers.push(guy.id)
      }
      console.log(allusers)
      let allchannels = []
      for (let i = 0 ; i < roles.length ; i++) {
        let role = message.guild.channels.cache.filter(c => c.name === `priv-${roles[i]}`).keyArray("id")
        allchannels.push(role)
      }

      let allwolves = []
      for (let i = 0 ; i < allusers.length ; i++) {
        let content = roles[i]
        if (content.includes("-")) {
          content = content.replace(
            /(\w+)-(\w+)/g,
            (_, m1, m2) =>
              `${m1[0].toUpperCase()}${m1
                .slice(1)
                .toLowerCase()} ${m2[0].toUpperCase()}${m2
                .slice(1)
                .toLowerCase()}`
          );
        } else {
          content = `${roles[i][0].toUpperCase()}${roles[i].slice(1).toLowerCase()}`
        }
        embed.addField(`${i+1} is`, content, true)
        
        let guy = message.guild.members.cache.get(allusers[i])
        db.set(`role_${guy.id}`, content)
          
          let a = await message.guild.channels.create(`priv-${roles[i]}`, {
            parent: '748959630520090626',
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"]
              }, {
                id: guy.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
              }, {
                id: narrator.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"]
              },
              {
                id: mininarr.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"]
              }
            ]
          })
          await a.send(db.get(`roleinfo_${roles[i].replace("-", " ")}`))
        
        if (roles[i].toLowerCase().includes("wolf")) {
          wwsChat.updateOverwrite(guy.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
          })
          
          allwolves.push(`**${client.guilds.cache.get("465795320526274561").emojis.cache.find(emoji => emoji.name === roles[i].replace(/-/g, "_"))} ${i+1}. is ${content}**!`)
        }
        
        if (content == "President") {
          setTimeout(() => {
            dayChat.send(`<:president:583672720932208671> Player **${guy.nickname} ${guy.user.username}** is the **President**!`)
            dayChat.send(`${alive}`)
          }, 15000)
        }
        
        if (content == "Bandit") {
          let bandits = message.guild.channels.cache.filter(c => c.name.startsWith("bandits"))
          let qah = 1
          bandits.forEach(async e => {
            let occupied = false
            for (let jj = 1 ; jj < 17 ; jj++) {
              let gyu = message.guild.members.cache.find(m => m.nickname === jj.toString())
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
                READ_MESSAGE_HISTORY: true
              })
            }
            if (occupied == true) {
              if (qah == bandits.keyArray("id").length) {
                let t = await message.guild.channels.create("bandits", {
                  parent: "606250714355728395",
                  permissionOverwrites: [
                    {
                      id: guy.id,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                    }, 
                    {
                      id: message.guild.id,
                      deny: ["VIEW_CHANNEL"]
                    },
                    {
                      id: narrator.id,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"]
                    },
                    {
                      id: mininarr.id,
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_CHANNELS", "MENTION_EVERYONE", "ATTACH_FILES"]
                    }
                  ]
                })
                let a = await t.send(`${alive}`)
                setTimeout(() => {
                  a.delete()
                }, 3000)
              }
            }
          })
        }
        db.set(`atag_${guy.id}`, null)
        db.set(`jwwtag_${guy.id}`, null)
        db.set(`mouth_${guy.id}`, null)

        
      }
      if (allwolves.length > 1) {
        wwsChat.send(allwolves.join("\n"))
      }
      
      let emorole = ""
      if (args[0].includes("customhid")) {
        emorole = "Role list is hidden"
      } else {
        rolelist.forEach(role => {
          let makeitsimple
          if (role.includes("-")) {
            let uyeuh = role.split("-")
            uyeuh.forEach(e => {uyeuh[uyeuh.indexOf(e)] = `${e[0].toUpperCase()}${e.slice(1).toLowerCase()}`})
            makeitsimple = uyeuh.join(" ")
          } else {
            makeitsimple = `${role[0].toUpperCase()}${role.slice(1).toLowerCase()}`
          }
          let emoji = client.guilds.cache.get("465795320526274561").emojis.cache.find(e => e.name === role.replace(/-/g, "_")) || ""
          emorole += `${emoji} ${rolelist.indexOf(role)+1}. ${makeitsimple}\n`
          rolelist[rolelist.indexOf(role)] = `nono${role}`
        })
        let excludes = db.get(`excludes`) || []
        let allexc = []
        if (excludes.length > 0) {
          excludes.forEach(ex => {
            let duh
            if (ex.includes("-")) {
              duh = ex.split("-")
              duh.forEach(e => {
                duh[duh.indexOf(e)] = `${e[0].toUpperCase()}${e.slice(1).toLowerCase()}`
              })
              allexc.push(duh.join(" "))
            } else {
              allexc.push(ex.replace(ex[0], ex[0].toUpperCase()))
            }
          })
          emorole += `\n_Roles excluded are: **${allexc.join("**, **")}**_`
        }
      }
      let lol = await dayChat.send(emorole)
      lol.pin()
   
    
      message.channel.send(embed)
      message.channel.send("I have executed the startgame command myself! You do not need to do it!")
      client.commands.get("startgame").run(message, args, client)
    }
    await client.channels.cache.find(c => c.id === '606123818305585167').send("Game is starting. You can no longer join. Feel free to spectate!")
    db.set("started", "yes")
  }
};
