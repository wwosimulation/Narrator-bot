const shuffle = require("shuffle-array");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "srole",
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

    if (
      !message.member.roles.cache.has(mininarr.id) &&
      !message.member.roles.cache.has(narrator.id)
    )
      return;
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
        let skcanni = ["Serial Killer", "Cannibal"]
        let foolhh = ["Fool", "Headhunter"]
        
        let sd = shuffle(seerdet)
        let jw = shuffle(jailerwitch)
        let as = shuffle(alphashaman)
        let sc = shuffle(skcanni)
        let fh = shuffle(foolhh)
      
        let roles = [
          ["Aura Seer", "Medium", "Jailer", "Werewolf", "Doctor", "Alpha Werewolf", "Seer", fh[0], "Bodyguard", "Gunner", "Wolf Shaman", "Aura Seer", "Serial Killer", "Cursed", "Wolf Seer", "Priest"],
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
          
          if (allchan[i] == allchan[i + 1]) {
          allchan.splice(i + 1, 1)
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
                        allchan.push(uwu.id)
                        seechan = uwu.id
                    }
                }
            }
            let thechan = message.guild.channels.cache.get(seechan)
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
    } else if (args[0] == "ranked") {
      let rrv = ["Aura Seer", "Avenger", "Beast Hunter", "Bodyguard", "Doctor", "Flower Child", "Grumpy Grandma", "Loudmouth", "Marksman", "Priest", "Red Lady", "Sheriff", "Spirit Seer", "Tough Guy", "Villager", "Witch"]
      let rww = ["Alpha Werewolf", "Guardian Wolf", "Junior Werewolf", "Nightmare Werewolf", "Shadow Wolf", "Werewolf Berserk", "Wolf Pacifist", "Wolf Seer", "Wolf Shaman"]
      let rv = ["Fool", "Headhunter"]

      let gfmh = [["Gunner", "Fool"], ["Marksman", "Headhunter"]]

      let d = gfmh[random(gfmh)]

      let fsse1 = [["Aura Seer", "Wolf Shaman", d[0], d[1]], ["Spirit Seer", "Nightmare Werewolf", "Gunner", rv[random(rv)]]]
      let fsse2 = fsse1[random(fsse1)]
      let eight = [d[1], "Random Voting"]
      if (fsse2.includes("Wolf Shaman")) {
        eight = eight[0]
      } else {
        eight = eight[1]
      }
      let sr = ["Sheriff", "Red Lady"]
      sr = sr[random(sr)]
      let nt = [["Flower Child", "Guardian Wolf"], [sr, "Wolf Pacifist"]]
      nt = nt[random(nt)]
      let fourteen = ["Junior Werewolf", "Shadow Wolf"]
      fourteen = fourteen[random(fourteen)]
      let ac = ["Arsonist", "Cannibal"]
      let sc = ["Serial Killer", "Corruptor"]
      let tt = [[ac[random(ac)], "Jailer"], [sc[random(sc)], "Witch"], ["Illusionist", "Forger"]]
      tt = tt[random(tt)]
      
      let rolelist = ["Detective", "Wolf Seer", "Doctor", rrv[random(rrv)], fsse2[0], fsse2[1], fsse2[2], fsse2[3], nt[0], nt[1], "Medium", tt[0], tt[1], fourteen[0], "Priest", rrv[random(rrv)]]
      function emote(nama) {
        return client.guilds.cache.get('465795320526274561').emojis.cache.find(e => e.name === nama)
      }
      dayChat.send(
        `RANKED GAME:\n
        ${emote('detective')} 1. Detective
        ${emote('wolf_seer')} 2. Wolf Seer
        ${emote('doctor')} 3. Doctor
        ${emote('random_regular_villager')} 4. Random Regular Villager
        ${emote(fsse2[0].replace(" ", "_").toLowerCase())} 5. ${fsse2[0]}
        ${emote(fsse2[1].replace(" ", "_").toLowerCase())} 6. ${fsse2[1]}
        ${emote(fsse2[2].replace(" ", "_").toLowerCase())} 7. ${fsse2[2]}
        ${emote(eight.replace(" ", "_").toLowerCase())} 8. ${eight}
        ${emote(nt[0].replace(" ", "_").toLowerCase())} 9. ${nt[0]}
        ${emote(nt[1].replace(" ", "_").toLowerCase())} 10. ${nt[1]}
        ${emote('medium')} 11. Medium
        ${emote(tt[0].replace(" ", "_").toLowerCase())} 12. ${tt[0]}
        ${emote(tt[1].replace(" ", "_").toLowerCase())} 13. ${tt[1]}
        ${emote(fourteen.replace(' ', '_').toLowerCase())} 14. ${fourteen}
        ${emote('priest')} 15. Priest
        ${emote('random_regular_villager')} 16. Random Regular Villager`
        )
      let newrole = []
      for (let k = 0 ; k < alive.members.size ; k++) {
        newrole.push(rolelist[k])
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

    } else if (args[0] == "custom") {
      for (let i = 1 ; i < args.length ; i++) {
        let chan = message.guild.channels.cache.find(c => c.name === `priv-${args[i]}`)
        if (!chan) return message.channel.send(`Channel ${args[i]} was not found!`)
      }
      for (let i = 1 ; i <= alive.members.size ; i++) {
        let guy = message.guild.members.cache.find(m => m.nickname === i.toString())
        if (!guy) return message.channel.send(`Player ${i} could not be found!`)
      }

      if (args.length - 1 != alive.members.size) {
        return message.channel.send("The number of roles do not match the number of players!")
      }
      let roles = []
      for (let i = 1 ; i < args.length ; i++) {
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
        let chan = message.guild.channels.cache.get(allchannels[i][i])

       if (!chan) {
          
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
        } else {
          chan.updateOverwrite(guy.id, {
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            VIEW_CHANNEL: true
          })
        }
        if (roles[i].toLowerCase().includes("wolf")) {
          wwsChat.updateOverwrite(guy.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
          })
        }
        db.set(`atag_${guy.id}`, null)
        db.set(`jwwtag_${guy.id}`, null)
        db.set(`mouth_${guy.id}`, null)
      }
      /*for (let i = 0 ; i < allusers.length ; i++) {
        let guy = message.guild.members.cache.get(allusers[i])
        let role = message.guild.channels.cache.filter(c => c.name === `priv-${roles[i]}`).keyArray("id")
        for (let j = 0 ; j < role.length ; j++) {
          let chan = message.guild.channels.cache.get(role[j])
          let channeloccupied = false
          for (k = 0 ; k < allusers.length ; k++) {
            let player = message.guild.members.cache.get(allusers[k])
            if (chan.permissionsFor(player).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
              console.log("yes")
              channeloccupied = true
              k = 99
            }
            if (channeloccupied == true && j == role.length - 1) {
              message.guild.channels.create(chan.name, {
                parent: '748959630520090626'
              })
            }
            if (channeloccupied == false && k == allusers.length - 1) {
              chan.updateOverwrite(guy.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
              })
              j = 99
            }
          }
        }
      }*/
      message.channel.send(embed)
    }
    await client.channels.cache.find(c => c.name === "game-warning").send("Game is starting. You can no longer join. Feel free to spectate!")
    db.set("started", "yes")
  }
};
