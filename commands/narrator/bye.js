const db = require("quick.db")
const shuffle = require("shuffle-array")

module.exports = {
    name: "day",
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        // All the variables
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
        let narrator = message.guild.roles.cache.find((r) => r.name === "Narrator")
        let mininarr = message.guild.roles.cache.find((r) => r.name === "Narrator Trainee")
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let wwChat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat")
        let wwVote = message.guild.channels.cache.find((c) => c.name === "ww-vote")
        let jailed = message.guild.channels.cache.find((c) => c.name === "jailed-chat")
        let jailer = message.guild.channels.cache.filter((c) => c.name === "priv-jailer").keyArray("id")
        let sk = message.guild.channels.cache.filter((c) => c.name === "priv-serial-killer").keyArray("id")
        let alchemist = message.guild.channels.cache.filter((c) => c.name === "priv-alchemist").keyArray("id")
        let canni = message.guild.channels.cache.filter((c) => c.name === "priv-cannibal").keyArray("id")
        let hacker = message.guild.channels.cache.filter((c) => c.name === "priv-hacker").keyArray("id")
        let doc = message.guild.channels.cache.filter((c) => c.name === "priv-doctor").keyArray("id")
        let bg = message.guild.channels.cache.filter((c) => c.name === "priv-bodyguard").keyArray("id")
        let witch = message.guild.channels.cache.filter((c) => c.name === "priv-witch").keyArray("id")
        let bh = message.guild.channels.cache.filter((c) => c.name === "priv-beast-hunter").keyArray("id")
        let gg = message.guild.channels.cache.filter((c) => c.name === "priv-grumpy-grandma").keyArray("id")
        let med = message.guild.channels.cache.filter((c) => c.name === "priv-medium").keyArray("id")
        let day = db.get(`dayCount`)
        let arso = message.guild.channels.cache.filter((c) => c.name === "priv-arsonist").keyArray("id")
        let shunt = message.guild.channels.cache.filter((c) => c.name === "priv-sect-hunter").keyArray("id")
        let sel = message.guild.channels.cache.filter((c) => c.name === "priv-sect-leader").keyArray("id")
        let hh = message.guild.channels.cache.filter((c) => c.name === "priv-headhunter").keyArray("id")
        let kww = message.guild.channels.cache.filter((c) => c.name === "priv-kitten-wolf").keyArray("id")
        let illu = message.guild.channels.cache.filter((c) => c.name === "priv-illusionist").keyArray("id")
        let corr = message.guild.channels.cache.filter((c) => c.name === "priv-corruptor").keyArray("id")
        let cupid = message.guild.channels.cache.filter((c) => c.name === "priv-cupid").keyArray("id")
        let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
        let bandits = message.guild.channels.cache.filter((c) => c.name.startsWith("bandits")).keyArray("id")
        let bandit = message.guild.channels.cache.filter((c) => c.name === "priv-bandit").keyArray("id")
        let tg = message.guild.channels.cache.filter((c) => c.name === "priv-tough-guy").keyArray("id")
        let wwb = message.guild.channels.cache.filter((c) => c.name === "priv-werewolf-berserk").keyArray("id")
        let rl = message.guild.channels.cache.filter((c) => c.name === "priv-red-lady").keyArray("id")
        let forger = message.guild.channels.cache.filter((c) => c.name === "priv-forger").keyArray("id")
        let zombie = message.guild.channels.cache.filter((c) => c.name === "priv-zombie").keyArray("id")
        let zombies = message.guild.channels.cache.find((c) => c.name === "zombies")
        let sheriff = message.guild.channels.cache.filter((c) => c.name === "priv-sheriff").keyArray("id")
        let ss = message.guild.channels.cache.filter((c) => c.name === "priv-spirit-seer").keyArray("id")
        let cupidKilled = false
        let soloKillers = ["Bandit", "Corruptor", "Cannibal", "Illusionist", "Serial Killer", "Arsonist", "Bomber", "Alchemist", "Hacker"]
        let strongww = ["Werewolf", "Junior Werewolf", "Nightmare Werewolf", "Kitten Wolf", "Wolf Shaman", "Wolf Pacifist", "Shadow Wolf", "Guardian Wolf", "Werewolf Berserk", "Alpha Werewolf", "Wolf Seer", "Lone Wolf"]
        let village = ["Villager", "Doctor", "Bodyguard", "Tough Guy", "Red Lady", "Gunner", "Jailer", "Priest", "Marksman", "Seer", "Aura Seer", "Spirit Seer", "Seer Apprentice", "Detective", "Medium", "Mayor", "Witch", "Avenger", "Beast Hunter", "Pacifist", "Grumpy Grandma", "Cupid", "President", "Cursed", "Loudmouth", "Flower Child", "Sheriff", "Fortune Teller", "Forger", "Grave Robber", "Santa Claus", "Easter Bunny", "Sibling", "Drunk", "Mad Scientist", "Idiot", "Wise Man", "Doppelganger", "Naughty Boy", "Handsome Prince", "Sect Hunter"]
        let killedplayers = []
        let thekiller = []
        let hhtarget = []

        // checks if a team has won

        // changing perms for allplayers
        for (let x = 1; x < 17; x++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === x.toString())
            if (guy) {
                if (guy.roles.cache.has(alive.id)) {
                    let role = db.get(`role_${guy.id}`)
                    let allchans = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`)
                    allchans.forEach((chan) => {
                        if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            chan.permissionOverwrites.edit(guy.id, {
                                SEND_MESSAGES: true,
                                READ_MESSAGE_HISTORY: true,
                                VIEW_CHANNEL: true,
                            })
                        }
                    })
                }
            }
        }

        // setting the hh target
        for (let x = 0; x < hh.length; x++) {
            let target = db.get(`hhtarget_${hh[x]}`)
            if (target != null) {
                hhtarget.push(target)
            }
        }

        // getting ww attack
        /*let wvotes = []
    let wnum = []
    
    for (let i = 1 ; i <= alive.members.size + dead.members.size ; i++) {
      let tempguy = message.guild.roles.cache.find(m => m.nickname === i.toString())
      console.log("wwkill1")
      if (tempguy) {
        console.log("wwkill1")
        if (tempguy.roles.cache.has(alive.id)) {
          console.log("wwkill1")
          if (db.get(`role_${tempguy.id}`).toLowerCase().includes("wolf")) {
            console.log(db.get(`wolvesKill_${tempguy.id}`))
            wvotes.push(db.get(`wolvesKill_${tempguy.id}`))
            console.log("wwkill1")
            if (db.get(`role_${tempguy.id}`) == "Alpha Werewolf") {
              console.log("wwkill1")
              wvotes.push(db.get(`wolvesKill_${tempguy.id}`))
            }
          }
        }
      }
    }
    
    wvotes.sort((a, b) => a - b)
    console.log(wvotes)
    let tv = 0
    for (let i = 0 ; i < wvotes.length ; i++) {
      if (!wnum[tv]) {
        wnum[tv] = 0
      }
      wnum[tv]++
      for (let j = i ; j < wvotes.length ; j++) {
        if (wvotes[i] == wvotes[j]) { 
          wnum[tv]++
        } else {
          i = j-1
          j = 99
          tv++
        }
      }
    }


    console.log(wnum)
    args[0] = "0"
    if (wnum.length > 0) {
      let highest = Math.max(...wnum)
      args[0] = allkill[wnum.indexOf(highest)]
    } */

        // getting the forge shield and sword
        for (let i = 0; i < forger.length; i++) {
            let forg = message.guild.channels.cache.get(forger[i])
            let shield = db.get(`toGiveS_${forger[i]}`)
            let sword = db.get(`toGiveK_${forger[i]}`)
            if (shield != null) {
                let guy = message.guild.members.cache.find((m) => m.nickname === shield)
                let role = db.get(`role_${guy.id}`)
                let chan = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
                for (let j = 0; j < chan.length; j++) {
                    let tempchan = message.guild.channels.cache.get(chan[j])
                    if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        j = 99
                        if (guy.roles.cache.has(alive.id)) {
                            tempchan.send(`<:getshield:744536572556476507> You have recieved a shield from the Forger!`)
                            db.set(`given_${forg.id}`, true)
                            db.set(`toGiveS_${forg.id}`, null)
                            db.set(`shield_${tempchan.id}`, true)
                        }
                    }
                }
            }

            if (sword != null) {
                let guy = message.guild.members.cache.find((m) => m.nickname === sword)
                let role = db.get(`role_${guy.id}`)
                let chan = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
                for (let j = 0; j < chan.length; j++) {
                    let tempchan = message.guild.channels.cache.get(chan[j])
                    if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        j = 99
                        if (guy.roles.cache.has(alive.id)) {
                            tempchan.send(`<:getsword:744536585906683975> You have recieved a sword from the Forger! To use it, do \`+sword [player number]\`!`)
                            db.set(`given_${forg.id}`, true)
                            db.set(`toGiveK_${forg.id}`, null)
                            db.set(`sword_${tempchan.id}`, true)
                        }
                    }
                }
            }
        }

        // getting the kills from cannibal
        for (let i = 0; i < canni.length; i++) {
            let cannibal = message.guild.channels.cache.get(canni[i])

            let theCanni
            for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                let tempGu = message.guild.members.cache.find((m) => m.nickname === j.toString())
                if (tempGu) {
                    if (tempGu.roles.cache.has(alive.id)) {
                        theCanni = tempGu
                    }
                }
            }
            let eat = db.get(`eat_${canni[i]}`)
            if (eat == null) {
                let hunger = db.get(`hunger_${canni[i]}`)
                if (hunger < 5) {
                    db.add(`hunger_${canni[i]}`, 1)
                }
            } else {
                let hunger = db.get(`hunger_${canni[i]}`)
                for (let x = 1; x <= alive.members.size + dead.members.size; x++) {}
                for (let j = 0; j < eat.length; j++) {
                    let guy = message.guild.members.cache.find((m) => m.nickname === eat[j])
                    if (guy.roles.cache.has(alive.id)) {
                        let role = db.get(`role_${guy.id}`)
                        // beast hunter trap
                        for (let k = 0; k < bh.length; k++) {
                            let trap = db.get(`setTrap_${bh[k]}`)
                            let active = db.get(`trapActive_${bh[k]}`)
                            if (trap == eat[j] && active == true) {
                                for (let l = 1; l <= alive.members.size + dead.members.size; l++) {
                                    let bhc = message.guild.channels.cache.get(bh[k])
                                    let ithink = message.guild.members.cache.find((m) => m.nickname === l.toString())
                                    if (ithink.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                        if (ithink.roles.cache.has(alive.id)) {
                                            eat[j] = "0" // makes the cannibal's attack to the player none
                                            l = 99
                                            k = 99
                                            cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                            cannibal.send(`${alive}`)
                                            bhc.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                                            bhc.send(`${alive}`)
                                        }
                                    }
                                }
                            }
                        }

                        if (eat[j] != "0") {
                            // jailer's protection
                            if (jailed.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                                if (guy.roles.cache.has(alive.id)) {
                                    cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                    cannibal.send(`${alive}`)
                                    eat[j] = "0" // makes the cannibal's attack towards the player none
                                }
                            }
                        }

                        // doc's protection
                        if (eat[j] != "0") {
                            for (let k = 0; k < doc.length; k++) {
                                let protection = db.get(`heal_${doc[k]}`)
                                if (protection == eat[j]) {
                                    let doctor = message.guild.channels.cache.get(doc[k])
                                    cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                    cannibal.send(`${alive}`)
                                    doctor.send(`<:heal:744536259673718894> Your protection saved **${guy.nickname} ${guy.user.username}**!`)
                                    doctor.send(`${alive}`)
                                    eat[j] = "0"
                                }
                            }
                        }

                        // witch's potion

                        if (eat[j] != "0") {
                            for (let k = 0; k < witch.length; k++) {
                                let potion = db.get(`potion_${witch[k]}`)
                                if (potion == eat[j]) {
                                    let channe = message.guild.channels.cache.get(witch[k])
                                    channe.send(`<:potion:744536604252700766> Your potion saved **${guy.nickname} ${guy.user.username}**!`)
                                    channe.send(`${alive}`)
                                    cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                    cannibal.send(`${alive}`)
                                    eat[j] = "0"
                                }
                            }
                        }

                        // forger
                        if (eat[j] != "0") {
                            let chans = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
                            for (let k = 0; k < chans.length; k++) {
                                let tempchan = message.guild.channels.cache.get(chans[k])
                                if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    let shield = db.get(`shield_${tempchan.id}`)
                                    if (shield == true) {
                                        tempchan.send(`<:guard:744536167109886023> You were attacked but your shield saved you!`)
                                        tempchan.send(`${alive}`)
                                        cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                        cannibal.send(`${alive}`)
                                        eat[j] = "0"
                                        db.set(`shield_${tempchan.id}`, false)
                                    }
                                }
                            }
                        }
                        // bodyguard's protection
                        for (let k = 0; k < bg.length; k++) {
                            let protection = db.get(`guard_${bg[k]}`)
                            let lives = db.get(`lives_${bg[k]}`)
                            if (protection == eat[j]) {
                                let channe = message.guild.channels.cache.get(bg[k])
                                if (lives == 2) {
                                    db.subtract(`lives_${bg[k]}`, 1)
                                    eat[j] = "0"
                                    channe.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                    channe.send(`${alive}`)
                                    cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                    cannibal.send(`${alive}`)
                                } else if (lives == 1) {
                                    let player
                                    for (let o = 1; o <= alive.members.size + dead.members.size; o++) {
                                        player = message.guild.members.cache.find((m) => m.nickname === o.toString())
                                        if (channe.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"])) {
                                            if (player.roles.cache.has(alive.id)) {
                                                o = 99
                                                eat[j] = "0"
                                                player.roles.add(dead.id)
                                                player.roles.remove(alive.id)
                                                dayChat.send(`<:eat:744575270102630482> The hunngry Cannibal ate **${player.nickname} ${player.user.username} (Bodyguard)**!`)
                                                killedplayers.push(player.id)
                                                thekiller.push(theCanni.id)
                                            }
                                        }
                                    }
                                }
                            } else if (role == "Bodyguard") {
                                let channe = message.guild.channels.cache.get(bg[k])
                                if (channe.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    eat[j] = "0"
                                    let lives = db.get(`lives_${channe.id}`)
                                    if (lives == 2) {
                                        channe.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                        channe.send(`${alive}`)
                                        cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                        cannibal.send(`${alive}`)
                                    } else if (lives == 1) {
                                        dayChat.send(`<:eat:744575270102630482> The hunngry Cannibal ate **${guy.nickname} ${guy.user.username} (Bodyguard)**!`)
                                        guy.roles.add(dead.id)
                                        guy.roles.remove(alive.id)
                                        killedplayers.push(guy.id)
                                        thekiller.push(theCanni.id)
                                    }
                                }
                            }
                        }

                        // tough guy
                        if (eat[j] != "0") {
                            for (let o = 1; o <= alive.members.size + dead.members.size; o++) {
                                let theCanni = message.guild.members.cache.find((m) => m.nickname === o.toString())
                                if (theCanni) {
                                    if (cannibal.permissionsFor(theCanni).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                        if (theCanni.roles.cache.has(alive.id)) {
                                            if (db.get(`role_${message.guild.members.cache.find((m) => m.nickname === eat[j]).id}`) == "Tough Guy") {
                                                for (let x = 0; x < tg.length; x++) {
                                                    let iudi = message.guild.channels.cache.get(tg[x])
                                                    if (iudi.permissionsFor(message.guild.members.cache.find((m) => m.nickname === eat[j])).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                        cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                                        cannibal.send(`_ _\n<:tough_guy:606429479170080769> Player **${guy.nickname} ${guy.user.username}** is a tough guy! He now knows your role!`)
                                                        cannibal.send(`<&${alive}>`)

                                                        iudi.send(`<:guard:744536167109886023> You have been attacked by **${theCanni.nickname} ${theCanni.user.username} (Cannibal)**. You have been wounded and will die at the end of the day.`)
                                                        iudi.send(`${alive}`)
                                                        db.set(`wounded_${tg[x]}`, true)
                                                        eat[j] = "0"
                                                    }
                                                }
                                            } else {
                                                for (let p = 0; p < tg.length; p++) {
                                                    let chan = message.guild.channels.cache.get(tg[p])
                                                    let tough = db.get(`tough_${tg[p]}`)
                                                    if (tough == eat[j]) {
                                                        let theTg
                                                        for (let q = 1; q <= alive.members.size + dead.members.size; q++) {
                                                            let the = message.guild.members.cache.find((m) => m.nickname === q.toString())
                                                            if (the) {
                                                                if (the.roles.cache.has(alive.id)) {
                                                                    theTg = the
                                                                }
                                                            }
                                                        }
                                                        cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                                        cannibal.send(`_ _\n<:tough_guy:606429479170080769> Player **${theTg.nickname} ${theTg.user.username}** is a tough guy! He now knows your role!`)
                                                        cannibal.send(`${alive}`)
                                                        chan.send(`<:guard:744536167109886023> You were protecting **${guy.nickname} ${guy.user.username}** who has been attacked by **${theCanni.nickname} ${theCanni.user.username} (Cannibal)**. You have been wounded and will die at the end of the day.`)
                                                        chan.send(`${alive}`)
                                                        db.set(`wounded_${tg[p]}`, true)
                                                        eat[j] = "0"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // red lady
                        if (eat[j] != "0") {
                            if (role == "Red Lady") {
                                for (let k = 0; k < rl.length; k++) {
                                    let chan = message.guild.channels.cache.get(rl[k])
                                    if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"])) {
                                        let visit = db.get(`visit_${chan.id}`)
                                        if (visit) {
                                            chan.send(`<:guard:744536167109886023> Someone tried to kill you while you were away!`)
                                            chan.send(`${alive}`)
                                            cannibal.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                            cannibal.send(`${alive}`)
                                            eat[j] = "0"
                                        }
                                    }
                                }
                            }
                        }

                        // killing players
                        if (eat[j] != "0") {
                            dayChat.send(`<:eat:744575270102630482> The hungry Cannibal ate **${guy.nickname} ${guy.user.username} (${role})**!`)
                            if (role == "Cupid") {
                                cupidKilled = true
                            }
                            guy.roles.add(dead.id)
                            guy.roles.remove(alive.id)
                            killedplayers.push(guy.id)
                            thekiller.push(theCanni.id)
                        }
                    }
                    if (eat[j] == "0" || eat[j] != null) {
                        let hunger = db.get(`hunger_${canni[i]}`)
                        db.subtract(`hunger_${canni[i]}`, 1)
                    }
                }
            }
            db.add(`hunger_${canni[i]}`, 1)
            db.set(`eat_${canni[i]}`, null)
        }

        // getting all the kills from sk
        let kills = []
        for (let i = 0; i < sk.length; i++) {
            let toKill = db.get(`stab_${sk[i]}`)
            if (toKill == null) {
                kills.push("0")
            } else {
                kills.push(toKill)
            }
        }

        // getting on who is the sk
        let THESK

        // checking the defences against the player
        for (let i = 0; i < kills.length; i++) {
            let chan1 = message.guild.channels.cache.get(sk[i])
            let guy = message.guild.members.cache.find((m) => m.nickname === kills[i])
            for (let x = 1; x <= alive.members.size + dead.members.size; x++) {
                let tempguy = message.guild.members.cache.find((m) => m.nickname === x.toString())
                if (tempguy) {
                    if (chan1.permissionsFor(tempguy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        THESK = tempguy
                    }
                }
            }
            if (kills[i] != "0" && guy.roles.cache.has(alive.id)) {
                let toKillRole = db.get(`role_${guy.id}`)

                // checking if the beast hunter's trap is active and on the player
                if (kills[i] != "0") {
                    for (let j = 0; j < bh.length; j++) {
                        let trap = db.get(`setTrap_${bh[j]}`)
                        let active = db.get(`trapActive_${bh[j]}`)
                        for (let m = 1; m <= alive.members.size + dead.members.size; m++) {
                            let hhhhh = message.guild.members.cache.find((me) => me.nickname === m.toString())
                            let chan = message.guild.channels.cache.get(bh[j])
                            if (chan.permissionsFor(hhhhh).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                m = 99
                                if (!hhhhh.roles.cache.has(alive.id)) {
                                    trap = null
                                    active = false
                                }
                            }
                        }
                        if (trap == kills[i] && active == true) {
                            kills[i] = "0" // makes the serial killer's attack towards the player none
                            let toSend = message.guild.channels.cache.get(bh[j])
                            toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                            toSK.send(`${alive}`)
                            toSend.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                            toSend.send(`${alive}`)
                            db.set(`setTrap_${bh[j]}`, null)
                            db.set(`trapActive_${bh[j]}`, false)
                            j = 99
                        }
                    }
                }

                // checks if the user being killed is jailed
                if (kills[i] != "0") {
                    if (jailed.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                        let jailerGuy = message.guild.channels.cache.find((c) => c.name === "priv-jailer")
                        for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                            let isJailer = message.guild.members.cache.find((m) => m.nickname === j.toString())
                            if (jailerGuy.permissionsFor(isJailer).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                j = 99
                                if (isJailer.roles.cache.has(alive.id)) {
                                    toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                    toSK.send(`${alive}`)
                                    kills[i] = "0" // makes the serial killer's attack towards the player none
                                }
                            }
                        }
                    }
                }

                if (kills[i] != "0") {
                    // checking if the doc's protection exists
                    for (let j = 0; j < doc.length; j++) {
                        let protection = db.get(`heal_${doc[j]}`)
                        if (protection == guy.nickname) {
                            kills[i] = "0" // makes the serial killer's attack towards the player none
                            toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                            toSK.send(`${alive}`)
                            let toSend = message.guild.channels.cache.get(doc[j])
                            toSend.send(`${alive}`)
                            toSend.send(`<:heal:744536259673718894> Your protection saved **${guy.nickname} ${guy.user.username}**!`)
                            j = 99
                        }
                    }
                }

                // checking if the witch's potion is on the player
                if (kills[i] != "0") {
                    for (let j = 0; j < witch.length; j++) {
                        let potion = db.get(`potion_${witch[j]}`)
                        if (potion == kills[i]) {
                            kills[i] = "0" // makes the serial killer's attack towards the player none
                            db.set(`potion_${witch[j]}`, null)
                            db.set(`witchAbil_${witch[j]}`, 1)
                            let toSend = message.guild.channels.cache.get(witch[j])
                            toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                            toSK.send(`${alive}`)
                            toSend.send(`<:potion:744536604252700766> Your potion saved **${guy.nickname} ${guy.user.username}**!`)
                            toSend.send(`${alive}`)
                            j = 99
                        }
                    }
                }

                // checking if the forger's shield is on the player
                // forger
                let chans = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${guy.id}`).toLowerCase().replace(" ", "-")}`).keyArray("id")
                for (let k = 0; k < chans.length; k++) {
                    let tempchan = message.guild.channels.cache.get(chans[k])
                    if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        let shield = db.get(`shield_${tempchan.id}`)
                        if (shield == true) {
                            tempchan.send(`<:guard:744536167109886023> You were attacked but your shield saved you!`)
                            tempchan.send(`${alive}`)
                            toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                            toSK.send(`${alive}`)
                            kills[i] = "0"
                            db.set(`shield_${tempchan.id}`, false)
                        }
                    }
                }

                // checking if the bodyguard's protection is on the player
                if (kills[i] != "0") {
                    for (let j = 0; j < bg.length; j++) {
                        let chan = message.guild.channels.cache.get(bg[j])
                        let lives = db.get(`lives_${chan.id}`)
                        let guard = db.get(`guard_${chan.id}`)
                        if (guard == kills[i]) {
                            if (lives == 2) {
                                chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                chan.send(`${alive}`)
                                toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                toSK.send(`${alive}`)
                                kills[i] = "0"
                                db.subtract(`lives_${chan.id}`, 1)
                            } else {
                                kills[i] = "0"
                                for (let k = 1; k <= 16; k++) {
                                    let tempbg = message.guild.members.cache.find((m) => m.nickname === k.toString())
                                    if (tempbg) {
                                        if (tempbg.roles.cache.has(alive.id)) {
                                            if (chan.permissionsFor(tempbg).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                dayChat.send(`<:serial_killer_knife:774088736861978666> The Serial Killer stabbed **${tempbg.nickname} ${tempbg.user.username} (Bodyguard)**!`)
                                                tempbg.roles.add(dead.id)
                                                tempbg.roles.remove(alive.id)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // serial killer attacking bodyguard
                if (kills[i] != "0") {
                    let role = db.get(`role_${guy.id}`)
                    if (role == "Bodyguard") {
                        for (let j = 0; j < bg.length; j++) {
                            let chan = message.guild.channels.cache.get(bg[j])
                            if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                if (guy.roles.cache.has(alive.id)) {
                                    let lives = db.get(`lives_${chan.id}`)
                                    if (lives == 2) {
                                        chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                        chan.send(`${alive}`)
                                        toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                        toSK.send(`${alive}`)
                                        db.subtract(`lives_${chan.id}`, 1)
                                        kills[i] = "0"
                                    }
                                }
                            }
                        }
                    }
                }

                // tough guy protections
                if (kills[i] != "0") {
                    for (let j = 0; j < tg.length; j++) {
                        let chan = message.guild.channels.cache.get(tg[j])
                        let tough = db.get(`tough_${chan.id}`)
                        if (tough == kills[i]) {
                            for (let k = 1; k <= 16; k++) {
                                let thetg = message.guild.members.cache.find((m) => m.nickname === k.toString())
                                if (thetg) {
                                    if (thetg.roles.cache.has(alive.id)) {
                                        if (chan.permissionsFor(thetg).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                            k = 99
                                            chan.send(`<:guard:744536167109886023> You were protecting **${guy.nickname} ${guy.user.username}** who was attacked by **${THESK.nickname} ${THESK.user.username} (Serial Killer)**! You will die at the end of the day!`)
                                            chan.send(`${alive}`)
                                            toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                            toSK.send(`_ _\n\n<:tough_guy:606429479170080769> Player **${thetg.nickname} ${thetg.user.username}** is a **Tough Guy**! He now knows your role!`)
                                            toSK.send(`${alive}`)
                                            kills[i] = "0"
                                            db.set(`wounded_${chan.id}`, true)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (kills[i] != "0") {
                    if (db.get(`role_${guy.id}`) == "Tough Guy") {
                        for (let j = 0; j < tg.length; j++) {
                            let chan = message.guild.channels.cache.get(tg[j])
                            if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "SEND_MESSAGES"])) {
                                chan.send(`<:guard:744536167109886023> You have been attacked by **${THESK.nickname} ${THESK.user.username} (Serial Killer)**! You will die at the end of the day!`)
                                chan.send(`${alive}`)
                                toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                toSK.send(`_ _\n\n<:tough_guy:606429479170080769> Player **${guy.nickname} ${guy.user.username}** is a **Tough Guy**! He now knows your role!`)
                                toSK.send(`${alive}`)
                                db.set(`wounded_${chan.id}`, true)
                                kills[i] = "0"
                            }
                        }
                    }
                }

                // red lady protection
                if (kills[i] != "0") {
                    if (db.get(`role_${guy.id}`) == "Red Lady") {
                        for (let j = 0; j < rl.length; j++) {
                            let chan = message.guild.channels.cache.get(rl[j])
                            if (chan.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                if (db.get(`visit_${chan.id}`)) {
                                    chan.send(`<:guard:744536167109886023> Someone tried attacking you while you were away!`)
                                    chan.send(`${alive}`)
                                    toSK.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                    toSK.send(`${alive}`)
                                    kills[i] = "0"
                                }
                            }
                        }
                    }
                }

                // serial killer attacking
                if (kills[i] != "0") {
                    let role = db.get(`role_${guy.id}`)
                    dayChat.send(`<:serial_killer_knife:774088736861978666> The Serial Killer stabbed **${guy.nickname} ${guy.user.username} (${role})**!`)
                    if (role == "Cupid") {
                        cupidKilled = true
                    }
                    guy.roles.add(dead.id)
                    guy.roles.remove(alive.id)
                    killedplayers.push(guy.id)
                    thekiller.push(THESK.id)
                }
            }
        }

        // bandit killing for real

        let frenzy = false

        for (let a = 0; a < wwb.length; a++) {
            if (db.get(`frenzy_${wwb[a]}`) == true) {
                frenzy = true
                db.set(`frenzy_${wwb[a]}`, false)
            }
        }
        // getting the kills from ww
        let wwKill = args[0]
        let guy = message.guild.members.cache.find((m) => m.nickname == args[0])
        let role
        if (wwKill != "0" && frenzy == true) {
            let kills = []
            role = db.get(`role_${guy.id}`)
            if (guy.roles.cache.has(alive.id)) {
                kills.push(guy)
            }

            // doc
            for (let a = 0; a < doc.length; a++) {
                if (db.get(`heal_${doc[a]}`) == guy.nickname) {
                    for (let b = 1; b < alive.members.size + dead.members.size; b++) {
                        let dt = message.guild.members.cache.find((m) => m.nickname === b.toString())
                        if (dt.roles.cache.has(alive.id)) {
                            if (message.guild.channels.cache.get(doc[a]).permissionsFor(dt).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                kills.push(dt)
                            }
                        }
                    }
                }
            }

            // witch
            for (let a = 0; a < witch.length; a++) {
                if (db.get(`potion_${witch[a]}`) == guy.nickname) {
                    for (let b = 1; b < alive.members.size + dead.members.size; b++) {
                        let dt = message.guild.members.cache.find((m) => m.nickname === b.toString())
                        if (dt.roles.cache.has(alive.id)) {
                            if (message.guild.channels.cache.get(witch[a]).permissionsFor(dt).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                kills.push(dt)
                            }
                        }
                    }
                }
            }

            // tough guy
            if (role == "Tough Guy") {
                kills[0] = "0"
                kills.push(guy)
            }

            // bodyguard
            if (role == "Bodyguard") {
                kills[0] = "0"
                kills.push(guy)
            }

            // beast hunter
            for (let a = 0; a < bh.length; a++) {
                let trap = db.get(`setTrap_${bh[a]}`)
                let active = db.get(`trapActive_${bh[a]}`)
                if (trap == guy.nickname && active == true) {
                    for (let b = 1; b < alive.members.size + dead.members.size; b++) {
                        let dt = message.guild.members.cache.find((m) => m.nickname === b.toString())
                        if (dt.roles.cache.has(alive.id)) {
                            if (message.guild.channels.cache.get(bh[a]).permissionsFor(dt).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                if (dt.nickname == guy.nickname) {
                                    kills[0] = "0"
                                    kills.push(dt)
                                } else {
                                    kills.push(dt)
                                }
                            }
                        }
                    }
                }
            }

            // jailer
            if (jailed.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                for (let b = 1; b < alive.members.size + dead.members.size; b++) {
                    let dt = message.guild.members.cache.find((m) => m.nickname === b.toString())
                    if (dt.roles.cache.has(alive.id)) {
                        if (db.get(`role_${guy.id}`) == "Jailer") {
                            kills.push(dt)
                        }
                    }
                }
            }

            // bg guard
            for (let a = 0; a < bg.length; a++) {
                if (db.get(`guard_${bg[a]}`) == guy.nickname) {
                    for (let b = 1; b < alive.members.size + dead.members.size; b++) {
                        let dt = message.guild.members.cache.find((m) => m.nickname === b.toString())
                        if (dt.roles.cache.has(alive.id)) {
                            if (message.guild.channels.cache.get(bg[a]).permissionsFor(dt).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                kills.push(dt)
                            }
                        }
                    }
                }
            }

            // tg
            for (let a = 0; a < tg.length; a++) {
                if (db.get(`tough_${tg[a]}`) == guy.nickname) {
                    for (let b = 1; b < alive.members.size + dead.members.size; b++) {
                        let dt = message.guild.members.cache.find((m) => m.nickname === b.toString())
                        if (dt.roles.cache.has(alive.id)) {
                            if (message.guild.channels.cache.get(tg[a]).permissionsFor(dt).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                kills.push(dt)
                            }
                        }
                    }
                }
            }

            if (kills[0] != "0") {
                wwKill = "0"
                dayChat.send(`<:werewolf:475776038727581697> The Werewolves killed **${guy.nickname} ${guy.user.username} (${role})**!`)
                if (role == "Cupid") {
                    cupidKilled = true
                }
                guy.roles.add(dead.id)
                guy.roles.remove(alive.id)
                killedplayers.push(guy.id)
                thekiller.push("Werewolf")
            }
            for (let a = 1; a < kills.length; a++) {
                dayChat.send(`<:frenzy:744573088204718412> The Werewolf frenzy killed **${kills[a].nickname} ${kills[a].user.username} (${db.get(`role_${kills[a].id}`)})**!`)
                kills[a].roles.add(dead.id)
                kills[a].roles.remove(alive.id)
                killedplayers.push(kills[a].id)
                thekiller.push("Werewolf")
            }
        }
        if (wwKill != "0" && frenzy == false) {
            console.log("It is not 0 (1)")
        }
        if (guy && guy.roles.cache.has(alive.id)) {
            role = db.get(`role_${guy.id}`)
            // checking if the wolves tried attacking solo killers or wise man
            if (wwKill != "0") {
                console.log("It is not 0 (2)")
                if (role == "Serial Killer" || role == "Arsonist" || role == "Bomber" || role == "Wise Man" || role == "Corruptor" || role == "Bandit" || role == "Cannibal" || role == "Alchemist" || role == "Illusionist" || role == "Hacker") {
                    wwKill = "0"
                    wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                }
            }

            // checking the beast hunter's trap
            if (wwKill != "0") {
                console.log("It is not 0 (3)")
                for (let j = 0; j < bh.length; j++) {
                    let THEBH
                    let trap = db.get(`setTrap_${bh[j]}`)
                    let active = db.get(`trapActive_${bh[j]}`)
                    for (let m = 1; m <= alive.members.size + dead.members.size; m++) {
                        let hhhhh = message.guild.members.cache.find((me) => me.nickname === m.toString())
                        let chan = message.guild.channels.cache.get(bh[j])
                        if (chan.permissionsFor(hhhhh).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            m = 99
                            if (!hhhhh.roles.cache.has(alive.id)) {
                                trap = null
                                active = false
                            } else {
                                THEBH = hhhhh
                            }
                        }
                    }
                    let allwolves = []
                    if (trap == args[0] && active == true) {
                        wwKill = "0" // makes the werewolves' attack towards the player none
                        db.set(`trapActive_${bh[j]}`, false)
                        db.set(`setTrap_${bh[j]}`, null)
                        j = 99
                        for (let k = 1; k <= alive.members.size + dead.members.size; k++) {
                            let usefull = message.guild.members.cache.find((m) => m.nickname === k.toString())
                            let rrrr = db.get(`role_${usefull.id}`)
                            if (rrrr.toLowerCase().includes("wolf") && usefull.roles.cache.has(alive.id)) {
                                allwolves.push(rrrr)
                            }
                        }
                    }
                    allwolves.sort((a, b) => strongww.indexOf(a) - strongww.indexOf(b))
                    for (let l = 1; l <= alive.members.size + dead.members.size; l++) {
                        let shush = message.guild.members.cache.find((m) => m.nickname === l.toString())
                        let ro = db.get(`role_${shush.id}`)
                        if (ro == allwolves[0]) {
                            wwKill = "0" // makes the werewolves' attack towards the player none
                            dayChat.send(`<:trap:744535154927861761> The Beast Hunter's trap killed **${shush.nickname} ${shush.user.username} (${ro})**!`)
                            shush.roles.add(dead.id)
                            shush.roles.remove(alive.id)
                            killedplayers.push(shush.id)
                            thekiller.push(THEBH.id)
                        }
                    }
                }
            }

            // checking if the player is jailed or not
            if (wwKill != "0" && jailed.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                console.log("It is not 0 (4)")
                let jailerGuy = message.guild.channels.cache.find((c) => c.name === "priv-jailer")
                for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                    let isJailer = message.guild.members.cache.find((m) => m.nickname === j.toString())
                    if (jailerGuy.permissionsFor(isJailer).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        j = 99
                        if (isJailer.roles.cache.has(alive.id)) {
                            wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                            wwChat.send(`${alive}`)
                            wwKill = "0" // makes the werewolves' attack towards the player none
                        }
                    }
                }
            }

            // checking if the doc's protection exists
            if (wwKill != "0") {
                console.log("It is not 0 (5)")
                for (let j = 0; j < doc.length; j++) {
                    let protection = db.get(`heal_${doc[j]}`)
                    if (protection == guy.nickname) {
                        wwKill = "0" // makes the werewolves' attack towards the player none
                        wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                        wwChat.send(`${alive}`)
                        let toSend = message.guild.channels.cache.get(doc[j])
                        toSend.send(`<:heal:744536259673718894> Your protection saved **${guy.nickname} ${guy.user.username}**!`)
                        toSend.send(`${alive}`)
                        j = 99
                    }
                }
            }

            // checking the witch's potion
            if (wwKill != "0") {
                console.log("It is not 0 (6)")
                for (let j = 0; j < witch.length; j++) {
                    let potion = db.get(`potion_${witch[j]}`)
                    if (potion == guy.nickname) {
                        wwKill = "0" // makes the werewolves' attack towards the player none
                        db.set(`potion_${witch[j]}`, null)
                        db.set(`witchAbil_${witch[j]}`, 1)
                        let toSend = message.guild.channels.cache.get(witch[j])
                        wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                        wwChat.send(`${alive}`)
                        toSend.send(`<:potion:744536604252700766> Your potion saved **${guy.nickname} ${guy.user.username}**!`)
                        toSend.send(`${alive}`)
                        j = 99
                    }
                }
            }

            if (wwKill != "0") {
                let chans = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
                for (let k = 0; k < chans.length; k++) {
                    let tempchan = message.guild.channels.cache.get(chans[k])
                    if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        let shield = db.get(`shield_${tempchan.id}`)
                        if (shield == true) {
                            tempchan.send(`<:guard:744536167109886023> You were attacked but your shield saved you!`)
                            tempchan.send(`${alive}`)
                            wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                            wwChat.send(`${alive}`)
                            wwKill = "0"
                            db.set(`shield_${tempchan.id}`, false)
                        }
                    }
                }
            }

            // checking the bodyguard's protection
            if (wwKill != "0") {
                console.log("It is not 0 (7)")
                for (let j = 0; j < bg.length; j++) {
                    let guard = db.get(`guard_${bg[j]}`)
                    let lives = db.get(`lives_${bg[j]}`) || 2
                    if (guard == wwKill) {
                        let thecha = message.guild.channels.cache.get(bg[j])
                        if (lives == 2) {
                            wwKill = "0" // makes the werewolves' attack towards the player none
                            thecha.send("<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.")
                            thecha.send(`${alive}`)
                            wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                            wwChat.send(`${alive}`)
                            db.set(`lives_${bg[j]}`, 1)
                        } else if (lives == 1) {
                            wwKill = "0" // makes the werewolves' attack towards the player none
                            for (let k = 1; k <= alive.members.size + dead.members.size; k++) {
                                let lol = message.guild.members.cache.find((m) => m.nickname === k.toString())
                                if (thecha.permissionsFor(lol).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    dayChat.send(`<:werewolf:475776038727581697> The Werewolves killed **${lol.nickname} ${lol.user.username} (Bodyguard)**!`)
                                    k = 99
                                    lol.roles.add(dead.id)
                                    lol.roles.remove(alive.id)
                                    killedplayers.push(lol.id)
                                    thekiller.push("Werewolf")
                                    db.set(`guard_${thecha.id}`, null)
                                }
                            }
                        }
                    } else if (role == "Bodyguard") {
                        for (let k = 0; k < bg.length; k++) {
                            let thecha = message.guild.channels.cache.get(bg[k])
                            if (thecha.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                if (!db.get(`lives_${bg[k]}`) || db.get(`lives_${bg[k]}`) == 2) {
                                    wwKill = "0"
                                    thecha.send("<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.")
                                    thecha.send(`${alive}`)
                                    wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                    wwChat.send(`${alive}`)
                                    db.set(`lives_${bg[k]}`, 1)
                                    k = 89
                                }
                            }
                        }
                    }
                }
            }

            // tough guy
            if (wwKill != "0") {
                console.log("Tough test 1")
                let allwolves = []
                let wolvesID = []

                for (let x = 1; x <= alive.members.size + dead.members.size; x++) {
                    console.log("Tough test 2")
                    let tempguy = message.guild.members.cache.find((m) => m.nickname === x.toString())
                    if (tempguy) {
                        console.log("Tough test 3")
                        if (tempguy.roles.cache.has(alive.id)) {
                            console.log("Tough test 4")
                            if (db.get(`role_${tempguy.id}`).toLowerCase().includes("wolf")) {
                                console.log("Tough test 5")
                                allwolves.push(db.get(`role_${tempguy.id}`))
                                wolvesID.push(tempguy.id)
                            }
                        }
                    }
                }

                allwolves.sort((a, b) => strongww.indexOf(a) - strongww.indexOf(b))
                for (let k = 0; k < wolvesID.length; k++) {
                    console.log("Tough test 6")
                    if (db.get(`role_${wolvesID[k]}`) == allwolves[0]) {
                        console.log("Tough test 7")
                        let thewolf = message.guild.members.cache.get(wolvesID[k])
                    }
                }
                // if wolves attacked the tough guy
                if (role == "Tough Guy") {
                    console.log("Tough test 8")
                    let tgc
                    for (let k = 0; k < tg.length; k++) {
                        console.log("Tough test 9")
                        let tempchan = message.guild.channels.cache.get(tg[k])
                        if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            console.log("Tough test 10")
                            tgc = tempchan
                        }
                    }
                    for (let k = 0; k < wolvesID.length; k++) {
                        if (db.get(`role_${wolvesID[k]}`) == allwolves[0]) {
                            console.log("Tough test 11")
                            let thewolf = message.guild.members.cache.get(wolvesID[k])
                            tgc.send(`<:tough_guy:606429479170080769> You have been attacked by **${thewolf.nickname} ${thewolf.user.username} (${db.get(`role_${thewolf.id}`)})**. You have been wounded and will die at the end of the day.`)
                            tgc.send(`${alive}`)
                            db.set(`wounded_${tgc.id}`, true)
                            let gr = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${thewolf.id}`).toLowerCase().replace(" ", "-")}`).keyArray("id")
                            for (let a = 0; a < gr.length; a++) {
                                let thechan = message.guild.channels.cache.get(gr[a])
                                if (thechan.permissionsFor(thewolf).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    console.log("Tough test 12")
                                    a = 99
                                    for (let b = 1; b < 17; b++) {
                                        let thtg = message.guild.members.cache.find((m) => m.nickname === b.toString())
                                        if (thtg && thtg.roles.cache.has(alive.id) && tgc.permissionsFor(thtg).has(["READ_MESSAGE_HISTORY", "VIEW_CHANNEL"])) {
                                            wwKill = "0"
                                            thechan.send(`_ _\n<:tough_guy:606429479170080769> Player **${thtg.nickname} ${thtg.user.username}** is a tough guy! He now knows your role!`)
                                            thechan.send(`${alive}`)
                                            wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                            wwChat.send(`${alive}`)
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // otherwise check if the wolves killed the player that the Tough guy protected
                    for (let k = 0; k < tg.length; k++) {
                        console.log("Shadow nub 1")
                        let theChannel = message.guild.channels.cache.get(tg[k])
                        let tough = db.get(`tough_${tg[k]}`)
                        if (tough == args[0]) {
                            console.log("Shadow nub 2")
                            for (let l = 1; l <= 16; l++) {
                                let tempguy = message.guild.members.cache.find((m) => m.nickname === l.toString())
                                if (tempguy && theChannel.permissionsFor(tempguy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    if (tempguy.roles.cache.has(alive.id)) {
                                        console.log("Shadow nub 3")
                                        l = 99
                                        for (let n = 0; n < wolvesID.length; n++) {
                                            if (db.get(`role_${wolvesID[n]}`) == allwolves[0]) {
                                                console.log("Shadow nub 4")
                                                let thewolf = message.guild.members.cache.get(wolvesID[n])
                                                theChannel.send(`You have been attacked by **${thewolf.nickname} ${thewolf.user.username} (${db.get(`role_${thewolf.id}`)})**. You have been wounded and will die at the end of the day.`)
                                                theChannel.send(`${alive}`)
                                                db.set(`wounded_${theChannel.id}`, true)
                                                let gr = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${thewolf.id}`).toLowerCase().replace(" ", "-")}`).keyArray("id")
                                                for (let a = 0; a < gr.length; a++) {
                                                    let thechan = message.guild.channels.cache.get(gr[a])
                                                    if (thechan.permissionsFor(thewolf).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                        console.log("Shadow nub 5")
                                                        a = 99
                                                        wwKill = "0"
                                                        thechan.send(`_ _\n**${guy.nickname} ${guy.user.username}** is a tough guy! He now knows your role!`)
                                                        thechan.send(`${alive.id}`)
                                                        wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                                        wwChat.send(`${alive}`)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // red lady protection
            if (wwKill != "0") {
                if (role == "Red Lady") {
                    for (let z = 0; z < rl.length; z++) {
                        let chan = message.guild.channels.cache.get(rl[z])
                        if (chan.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            if (db.get(`visit_${chan.id}`)) {
                                wwKill = "0"
                                wwChat.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be killed!`)
                                wwChat.send(`${alive}`)
                                chan.send(`<:guard:744536167109886023> Someone tried to kill you while you were away!`)
                                chan.send(`${alive}`)
                            }
                        }
                    }
                }
            }

            // killing the player
            if (wwKill != "0") {
                console.log("It is not 0 (8)")
                if (role == "Cursed") {
                    let allcursed = message.guild.channels.cache.filter((c) => c.name === "priv-cursed").keyArray("id")
                    for (let z = 0; z < allcursed.length; z++) {
                        let thecurse = message.guild.channels.cache.get(allcursed[z])
                        if (thecurse.permissionsFor(guy).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL"])) {
                            z = 99
                            let t = await message.guild.channels.create("priv-werewolf", {
                                parent: "748959630520090626",
                            })
                            t.permissionOverwrites.create(guy.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true,
                            })
                            t.permissionOverwrites.create(message.guild.id, {
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
                            await t.send(db.get(`roleinfo_werewolf`))
                            await t.send("You have been bitten! You are a werewolf now!")
                            thecurse.permissionOverwrites.edit(guy.id, {
                                SEND_MESSAGES: false,
                                VIEW_CHANNEL: false,
                                READ_MESSAGE_HISTORY: false,
                            })
                        }
                        wwChat.send(`**${guy.nickname} ${guy.user.username}** was cursed and has been converted into a werewolf!`)
                        wwChat.permissionOverwrites.edit(guy.id, {
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true,
                            VIEW_CHANNEL: true,
                        })
                    }
                } else {
                    dayChat.send(`<:werewolf:475776038727581697> The Werewolves killed **${guy.nickname} ${guy.user.username} (${role})**!`)
                    if (role == "Cupid") {
                        cupidKilled = true
                    }
                    guy.roles.add(dead.id)
                    guy.roles.remove(alive.id)
                    killedplayers.push(guy.id)
                    thekiller.push("Werewolf")
                }
            }
        }
        //console.log("Ok so the ww kill is passed")

        // red lady visting
        for (let i = 0; i < rl.length; i++) {
            let chan = message.guild.channels.cache.get(rl[i])
            let visit = db.get(`visit_${chan.id}`)
            if (visit != null) {
                for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                    let tehGuy = message.guild.members.cache.find((m) => m.nickname === j.toString())
                    if (tehGuy) {
                        if (tehGuy.roles.cache.has(alive.id)) {
                            if (chan.permissionsFor(tehGuy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                let guy = message.guild.members.cache.find((m) => m.nickname === visit)
                                let role = db.get(`role_${guy.id}`)
                                if (role.toLowerCase().includes("wolf") || role == "Serial Killer" || role == "Sorcerer" || role == "Arsonist" || role == "Bomber" || role == "Cannibal" || role == "Corruptor" || role == "Illusionist" || role == "Sect Leader" || role == "Zombie" || role == "Bandit" || role == "Accomplice") {
                                    dayChat.send(`**${tehGuy.nickname} ${tehGuy.user.username} (Red Lady)** visited an evil player and died!`)
                                    tehGuy.roles.add(dead.id)
                                    tehGuy.roles.remove(alive.id)
                                }
                            }
                        }
                    }
                }
            }
        }

        //console.log("Hello there Janet")
        //console.log("Oh hi there Bandit Conversion is ok")

        dayChat.send(`Day ${day + 1} has started! Get ready to discuss!`)
        db.add(`dayCount`, 1)
        db.set(`isDay`, "yes")

        console.log("Ok so it is day")
        // lock werewolves from their chat
        for (let i = 1; i <= alive.members.size + dead.members.size; i++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === i.toString())
            let role = db.get(`role_${guy.id}`).toLowerCase()
            if (role.includes("wolf")) {
                wwChat.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: false,
                })
            }
        }
        console.log("Nice! I have locked players from ww chat")

        // remove werewolf votes
        await wwVote.bulkDelete((await message.channel.messages.fetch({ limit: 100 })).filter((m) => !m.pinned))

        // medium reviving
        for (let i = 0; i < med.length; i++) {
            let reviving = db.get(`revive_${med[i]}`)
            db.set(`revive_${med[i]}`, null)
            if (reviving) {
                let guy = message.guild.members.cache.find((m) => m.nickname === reviving)
                dayChat.send(`<:revived:744571959550935184> The Medium revived **${guy.nickname} ${guy.user.username}**!`)
                guy.roles.add(alive.id)
                guy.roles.remove(dead.id)
                db.set(`med_${med[i]}`, "yes")
            }
        }

        //console.log("Oki, i have completed reviving players")

        // grumpy grandma muting

        for (let i = 0; i < gg.length; i++) {
            let mute = db.get(`mute_${gg[i]}`)
            if (mute) {
                let guy = message.guild.members.cache.find((m) => m.nickname === mute)
                dayChat.send(`<:ggmute:766684344647417936> The Grumpy Grandma muted **${guy.nickname} ${guy.user.username}**!`)
                dayChat.permissionOverwrites.edit(guy.id, {
                    SEND_MESSAGES: false,
                })
            }
        }

        //console.log("Shut up you stupid pests, i am trying to sleep over here. Can't a granny get some rest?")
        // sect leader converting
        let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
        setTimeout(async () => {
            for (let q = 0; q < sel.length; q++) {
                let sl = message.guild.channels.cache.get(sel[q])
                if (sl) {
                    let sect = db.get(`sect_${sl.id}`) || "0"
                    guy = message.guild.members.cache.find((m) => m.nickname === sect)
                    let leader
                    for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                        let lol = message.guild.members.cache.find((m) => m.nickname === j.toString())
                        if (sl.permissionsFor(lol).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            leader = lol
                        }
                    }

                    if (sect != "0") {
                        if (guy) {
                            role = db.get(`role_${guy.id}`)
                            for (let j = 0; j < hh.length; hh++) {
                                let target = db.get(`hhtarget_${hh[j]}`)
                                if (target == guy.nickname) {
                                    role = "targetofhh"
                                }
                            }
                            if (leader) {
                                //return; // I FOUND THE PROBLEM
                                if (leader.roles.cache.has(alive.id) && guy.roles.cache.has(alive.id)) {
                                    if (role.toLowerCase().includes("wolf") || role == "Arsonist" || role == "Zombie" || role == "Bandit" || role == "Accomplice" || role == "Sorcerer" || role == "Serial Killer" || role == "Corruptor" || role == "Illusinist" || role == "Cannibal" || role == "targetofhh" || role == "Cursed" || role == "Doppelganger" || role == "Alchemist" || role == "Grave Robber") {
                                        sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                        sl.send(`${alive}`)
                                        sect = "0"
                                    } else {
                                        let thechan = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")

                                        // protection from non-village
                                        for (let l = 0; l < thechan.length; l++) {
                                            if (db.get(`bitten_${thechan[l]}`) == true) {
                                                sect = "0"
                                                sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                sl.send(`${alive}`)
                                            } else if (strongww.includes(role) || role == "Cursed" || soloKillers.includes(role) || role == "Sorcerer" || role == "Zombie" || role == "Doppelganger" || role == "Accomplice" || message.guild.channels.cache.get("682617467767357453").permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                sl.send(`${alive}`)
                                                sect = "0"
                                            }
                                        }

                                        // protection from bh
                                        if (sect != "0") {
                                            for (let l = 0; l < bh.length; l++) {
                                                let trap = db.get(`setTrap_${bh[l]}`)
                                                let active = db.get(`trapActive_${bh[l]}`)
                                                for (let m = 1; m <= alive.members.size + dead.members.size; m++) {
                                                    let hhhhh = message.guild.members.cache.find((me) => me.nickname === m.toString())
                                                    let chan = message.guild.channels.cache.get(bh[l])
                                                    if (chan.permissionsFor(hhhhh).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                        m = 99
                                                        if (!hhhhh.roles.cache.has(alive.id)) {
                                                            trap = null
                                                            active = false
                                                        }
                                                    }
                                                }
                                                if (trap == guy.nickname && active == true) {
                                                    sect = "0" // makes the serial killer's attack towards the player none
                                                    let toSend = message.guild.channels.cache.get(bh[l])
                                                    sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                    sl.send(`${alive}`)
                                                    toSend.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                                                    toSend.send(`${alive}`)
                                                    db.set(`setTrap_${bh[l]}`, null)
                                                    db.set(`trapActive_${bh[l]}`, false)
                                                    j = 99
                                                }
                                            }
                                        }

                                        // protection from being jailed
                                        if (sect != "0") {
                                            for (let k = 0; k < thechan.length; k++) {
                                                if (jailed.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                                                    k = 99
                                                    sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                    sl.send(`${alive}`)
                                                    sect = "0"
                                                }
                                            }
                                        }

                                        // protection from being healed by doctor
                                        if (sect != "0") {
                                            for (let o = 0; o < doc.length; o++) {
                                                let protection = db.get(`heal_${doc[o]}`)
                                                if (protection == guy.nickname) {
                                                    sect = "0" // makes the serial killer's attack towards the player none
                                                    sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                    sl.send(`${alive}`)
                                                    let toSend = message.guild.channels.cache.get(doc[o])
                                                    toSend.send(`${alive}`)
                                                    toSend.send(`<:heal:744536259673718894> Your protection saved **${guy.nickname} ${guy.user.username}**!`)
                                                    o = 99
                                                }
                                            }
                                        }

                                        // protection from potion by witch
                                        if (sect != "0") {
                                            for (let o = 0; o < witch.length; o++) {
                                                let potion = db.get(`potion_${witch[o]}`)
                                                if (potion == guy.nickname) {
                                                    sect = "0" // makes the serial killer's attack towards the player none
                                                    db.set(`potion_${witch[o]}`, null)
                                                    db.set(`witchAbil_${witch[o]}`, 1)
                                                    let toSend = message.guild.channels.cache.get(witch[o])
                                                    sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                    sl.send(`${alive}`)
                                                    toSend.send(`<:potion:744536604252700766> Your potion saved **${guy.nickname} ${guy.user.username}**!`)
                                                    toSend.send(`${alive}`)
                                                    o = 99
                                                }
                                            }
                                        }

                                        if (sect != "0") {
                                            let chans = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
                                            for (let k = 0; k < chans.length; k++) {
                                                let tempchan = message.guild.channels.cache.get(chans[k])
                                                if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                    let shield = db.get(`shield_${tempchan.id}`)
                                                    if (shield == true) {
                                                        tempchan.send(`<:guard:744536167109886023> You were attacked but your shield saved you!`)
                                                        tempchan.send(`${alive}`)
                                                        sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                        sl.send(`${alive}`)
                                                        sect = "0"
                                                        db.set(`shield_${tempchan.id}`, false)
                                                    }
                                                }
                                            }
                                        }

                                        // protection from guard by bodyguard
                                        if (sect != "0") {
                                            for (let o = 0; o < bg.length; o++) {
                                                let toSend = message.guild.channels.cache.get(bg[o])
                                                let lives = db.get(`lives_${bg[o]}`)
                                                let guard = db.get(`lives_${bg[o]}`)

                                                if (guard == guy.nickname) {
                                                    let thecha = message.guild.channels.cache.get(bg[o])
                                                    if (lives == 2) {
                                                        sect = "0" // makes the serial killer's attack towards the player none
                                                        thecha.send("<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.")
                                                        thecha.send(`${alive}`)
                                                        sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                        sl.send(`${alive}`)
                                                        db.subtract(`lives_${bg[o]}`, 1)
                                                    }
                                                } else if (role == "Bodyguard") {
                                                    for (let p = 0; p < bg.length; p++) {
                                                        let thecha = message.guild.channels.cache.get(bg[p])
                                                        if (thecha.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                            p = 89
                                                            if (db.get(`lives_${bg[p]}`) == 2) {
                                                                sect = "0" // makes the serial killer's attack towards the player none
                                                                thecha.send("<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.")
                                                                thecha.send(`${alive}`)
                                                                sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                                sl.send(`${alive}`)
                                                                db.subtract(`lives_${bg[p]}`, 1)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        // red lady
                                        if (sect != "0") {
                                            if (db.get(`role_${guy.id}`) == "Red Lady") {
                                                for (let k = 0; k < rl.length; k++) {
                                                    let chan = message.guild.channels.cache.get(rl[k])
                                                    if (chan.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                        if (db.get(`visit_${chan.id}`)) {
                                                            sl.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
                                                            sl.send(`${alive}`)
                                                            sect = "0"
                                                            chan.send(`<:guard:744536167109886023> Somebody tried to attack you while you were away!`)
                                                            chan.send(`${alive}`)
                                                        }
                                                    }
                                                }
                                            }

                                            if (sect != "0") {
                                                sected.permissionOverwrites.edit(guy.id, {
                                                    VIEW_CHANNEL: true,
                                                    READ_MESSAGE_HISTORY: true,
                                                })
                                                sected.send(`${alive}\n${guy.user.username} is now a sect member`)
                                                let thechan = message.guild.channels.cache.filter((c) => c.name === `priv-${db.get(`role_${guy.id}`).toLowerCase().replace(" ", "-")}`).keyArray("id")
                                                for (let k = 0; k < thechan.length; k++) {
                                                    let chan = message.guild.channels.cache.get(thechan[k])
                                                    if (chan.permissionsFor(guy).has(["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL"])) {
                                                        chan.send(`You have been converted by the Sect Leader! The leader is **${leader.nickname} ${leader.user.username}**!`)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, 3500)

        //console.log("btw, i am sect leader not SEXT leader")
        // sect hunter killing

        setTimeout(async () => {
            for (let i = 0; i < shunt.length; i++) {
                let hunt = db.get(`hunt_${shunt[i]}`) || "0"
                let schan = message.guild.channels.cache.get(shunt[i])
                let guy = message.guild.members.cache.find((m) => m.nickname === hunt)
                let sected = message.guild.channels.cache.get("682617467767357453")
                let leader
                if (hunt != "0") {
                    for (let k = 1; k <= 16; k++) {
                        let tempguy = message.guild.members.cache.find((m) => m.nickname === k.toString())
                        if (tempguy) {
                            if (tempguy.roles.cache.has(alive.id)) {
                                if (schan.permissionsFor(tempguy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"])) {
                                    let role = db.get(`role_${guy.id}`)
                                    if (guy.roles.cache.has(alive.id)) {
                                        if (role == "Sect Leader" || sected.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                            dayChat.send(`<:arrow:744571940374708234> The Sect Hunter killed **${guy.nickname} ${guy.user.username} (${role})**`)
                                            guy.roles.add(dead.id)
                                            guy.roles.remove(alive.id)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, 3750)
        //console.log("time to f*** you up sect")

        // allowing players to speak in #day-chat
        // dayChat.permissionOverwrites.edit(alive.id, {
        //   SEND_MESSAGES: true,
        // })

        // drunk not being able to speak
        for (let i = 1; i <= alive.members.size + dead.members.size; i++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === i.toString())
            if (guy) {
                let role = db.get(`role_${guy.id}`)
                if (role == "Drunk") {
                    dayChat.permissionOverwrites.edit(guy.id, {
                        SEND_MESSAGES: false,
                    })
                }
            }
        }

        // corruptor glitch
        for (let a = 0; a < corr.length; a++) {
            let corruptor = message.guild.channels.cache.get(corr[a])
            let glitch = db.get(`corrupt_${corr[a]}`)
            // let's check if the corruptor is alive at first :>
            let thecorrtocorr
            for (let x = 1; x <= alive.members.size + dead.members.size; x++) {
                let maybecorr = message.guild.members.cache.find((m) => m.nickname === x.toString())
                if (maybecorr) {
                    if (corruptor.permissionsFor(maybecorr).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        thecorrtocorr = maybecorr
                        x = 99
                    }
                }
            }
            if (thecorrtocorr) {
                if (thecorrtocorr.roles.cache.has(alive.id)) {
                    if (glitch != null) {
                        let corrupted = message.guild.members.cache.find((m) => m.nickname === glitch)
                        let corrrole = db.get(`role_${corrupted.id}`)
                        if (corrupted.roles.cache.has(alive.id)) {
                            // beast hunter trap
                            for (let b = 0; b < bh.length; b++) {
                                let chan = message.guild.channels.cache.get(bh[b])
                                let trap = db.get(`setTrap_${bh[b]}`)
                                let active = db.get(`trapActive_${bh[b]}`)
                                if (trap == glitch && active == true) {
                                    for (let c = 1; c <= alive.members.size + dead.members.size; c++) {
                                        let player = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                        if (chan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                            c = 99
                                            b = 99
                                            if (player.roles.cache.has(alive.id)) {
                                                chan.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                                                chan.send(`${alive}`)
                                                corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be corrupted!`)
                                                corruptor.send(`${alive}`)
                                                glitch = "0"
                                            }
                                        }
                                    }
                                }
                            }

                            // jailer
                            if (glitch != "0") {
                                if (jailed.permissionsFor(corrupted).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                                    for (let b = 1; b <= alive.members.size + dead.members.size; b++) {
                                        let player = message.guild.members.cache.find((m) => m.nickname === b.toString())
                                        if (db.get(`role_${player.id}`) == "Jailer") {
                                            b = 99
                                            if (player.roles.cache.has(alive.id)) {
                                                corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be corrupted!`)
                                                corruptor.send(`${alive}`)
                                                glitch = "0"
                                            }
                                        }
                                    }
                                }
                            }

                            // doctor
                            if (glitch != "0") {
                                for (let b = 0; b < doc.length; b++) {
                                    let heal = db.get(`heal_${doc[b]}`)
                                    if (doc == glitch) {
                                        let chan = message.guild.channels.cache.get(doc[b])
                                        corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be glitched!`)
                                        corruptor.send(`${alive}`)
                                        chan.send(`<:heal:744536259673718894> Your protection saved **${corrupted.nickname} ${corrupted.user.username}**!`)
                                        chan.send(`${alive}`)
                                        glitch = "0"
                                        b = 99
                                    }
                                }
                            }

                            // witch
                            if (glitch != "0") {
                                for (let b = 0; b < witch.length; b++) {
                                    console.log(b, witch, witch[b])
                                    let potion = db.get(`potion_${witch[b]}`)
                                    if (potion == glitch) {
                                        db.set(`potion_${witch[b]}`, null)
                                        db.set(`witchAbil_${witch[b]}`, "yes")
                                        let chan = message.guild.channels.cache.get(witch[b])
                                        chan.send(`<:potion:744536604252700766> Your potion saved **${corrupted.nickname} ${corrupted.user.username}**!`)
                                        chan.send(`${alive}`)
                                        corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be glitched!`)
                                        corruptor.send(`${alive}`)
                                        glitch = "0"
                                        b = 99
                                    }
                                }
                            }

                            if (glitch != "0") {
                                let chans = message.guild.channels.cache.filter((c) => c.name === `priv-${corrrole.toLowerCase().replace(" ", "-")}`).keyArray("id")
                                for (let k = 0; k < chans.length; k++) {
                                    let tempchan = message.guild.channels.cache.get(chans[k])
                                    if (tempchan.permissionsFor(corrupted).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                        let shield = db.get(`shield_${tempchan.id}`)
                                        if (shield == true) {
                                            tempchan.send(`<:guard:744536167109886023> You were attacked but your shield saved you!`)
                                            tempchan.send(`${alive}`)
                                            corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be glitched!`)
                                            corruptor.send(`${alive}`)
                                            glitch = "0"
                                            db.set(`shield_${tempchan.id}`, false)
                                        }
                                    }
                                }
                            }

                            // bodyguard with 1 life
                            if (glitch != "0") {
                                if (corrrole == "Bodyguard") {
                                    for (let b = 0; b < bg.length; b++) {
                                        let chan = message.guild.channels.cache.get(bg[b])
                                        if (chan.permissionsFor(corrupted).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                            if (db.get(`lives_${chan.id}`) == 2) {
                                                b = 99
                                                glitch = "0"
                                                chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                                chan.send(`${alive}`)
                                                corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be glitched!`)
                                                corruptor.send(`${alive}`)
                                                db.subtract(`guard_${chan.id}`, 1)
                                            }
                                        }
                                    }
                                }
                            }

                            // bodyguard protect
                            if (glitch != "0") {
                                for (let b = 0; b < bg.length; b++) {
                                    let chan = message.guild.channels.cache.get(bg[b])
                                    let lives = db.get(`lives_${chan.id}`)
                                    let guard = db.get(`guard_${chan.id}`)
                                    if (guard == glitch) {
                                        if (lives == 2) {
                                            b = 99
                                            glitch = "0"
                                            chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                            chan.send(`${alive}`)
                                            corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be glitched!`)
                                            corruptor.send(`${alive}`)
                                            db.subtract(`guard_${chan.id}`, 1)
                                        } else if (lives == 1)
                                            for (let k = 1; k < 17; k++) {
                                                let teguy = message.guild.members.cache.find((m) => m.nickname === k.toString())
                                                if (teguy) {
                                                    if (teguy.roles.cache.has(alive.id)) {
                                                        if (chan.permissionsFor(teguy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                            db.set(`corrupt_${corruptor.id}`)
                                                            corrupted = teguy
                                                        }
                                                    }
                                                }
                                            }
                                    }
                                }
                            }
                        }

                        // tough guy guard
                        for (let b = 0; b < tg.length; b++) {
                            let chan = message.guild.channels.cache.get(tg[b])
                            let protect = db.get(`tough_${chan.id}`)
                            for (let c = 1; c < 17; c++) {
                                let temguy = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                if (temguy) {
                                    if (temguy.roles.cache.has(alive.id)) {
                                        if (chan.permissionsFor(temguy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                            if (protect == corrupted.nickname || corrupted == temguy) {
                                                db.set(`corrupt_${corruptor.id}`, temguy.nickname)
                                                corrupted = temguy
                                                if (protect == corrupted.nickname) {
                                                    chan.send(`You were protecting **${corrupted.nickname} ${corrupted.user.username}** who were attacked by **${thecorrtocorr.nickname} ${thecorrtocorr.user.username} (Corruptor)**! You will die at the end of the day`)
                                                } else {
                                                    chan.send(`You were attacked by **${thecorrtocorr.nickname} ${thecorrtocorr.user.username} (Corruptor)**! You will die at the end of the day!`)
                                                }
                                                chan.send(`${alive}`)
                                                corruptor.send(`<:tough_guy:606429479170080769> Player **${corrupted.nickname} ${corrupted.user.username}** is a **Tough Guy**! They now know your role!`)
                                                db.set(`wounded_${chan.id}`, true)
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // red lady
                        if (glitch != "0") {
                            if (corrrole == "Red Lady") {
                                for (let b = 0; b < rl.length; b++) {
                                    let chan = message.guild.channels.cache.get(rl[b])
                                    if (chan.permissionsFor(corrupted).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                        if (db.get(`visit_${chan.id}`)) {
                                            glitch = "0"
                                            chan.send(`<:guard:744536167109886023> Someone tried to kill you while you were away!`)
                                            chan.send(`${alive}`)
                                            corruptor.send(`<:guard:744536167109886023> Player **${corrupted.nickname} ${corrupted.user.username}** could not be corrupted!`)
                                            corruptor.send(`${alive}`)
                                        }
                                    }
                                }
                            }
                        }

                        // corrupting the player
                        if (glitch != "0") {
                            corruptor.send(`<:corrupt:745632706838396989> Player **${corrupted.nickname} ${corrupted.user.username}** has successfully been corrupted!`)
                            dayChat.permissionOverwrites.edit(corrupted.id, {
                                SEND_MESSAGES: false,
                            })
                            let allchan = message.guild.channels.cache.filter((c) => c.name === `priv-${corrrole.replace(" ", "-").toLowerCase()}`).keyArray("id")
                            for (let b = 0; b < allchan.length; b++) {
                                let chan = message.guild.channels.cache.get(allchan[b])
                                if (chan.permissionsFor(corrupted).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    chan.send(`<:corrupt:745632706838396989> You have been glitched! No one will hear you scream! You cannot vote or use your abilities today and will die at the end of the day.`)
                                    chan.send(`${alive}`)
                                    chan.permissionOverwrites.edit(corrupted, {
                                        SEND_MESSAGES: false,
                                    })
                                }
                            }
                            for (let b = 0; b < rl.length; b++) {
                                let rlchan = message.guild.channels.cache.get(rl[b])
                                if (db.get(`visit_${rlchan.id}`) == glitch) {
                                    for (let c = 1; c < 17; c++) {
                                        let rlguy = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                        if (rlguy) {
                                            if (rlguy.roles.cache.has(alive.id)) {
                                                if (rlchan.permissionsFor(rlguy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                    corruptor.send(`<:corrupt:745632706838396989> Player **${rlguy.nickname} ${rlguy.user.username}** has successfully been corrupted!`)
                                                    rlchan.permissionOverwrites.edit(rlguy.id, {
                                                        SEND_MESSAGES: false,
                                                    })
                                                    rlchan.send(`<:corrupt:745632706838396989> You have been glitched! No one will hear you scream! You cannot vote or use your abilities today and will die at the end of the day.`)
                                                    rlchan.send(`${alive}`)
                                                    db.set(`rlcorrupted_${rlguy.nickname}`, true)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // alchemist
        for (let a = 0; a < alchemist.length; a++) {
            let chan = message.guild.channels.cache.get(alchemist[a])
            let redpotion = db.get(`redpotion_${chan.id}`)
            let blackpotion = db.get(`blackpotion_${chan.id}`)

            if (redpotion) {
                let guy = message.guild.members.cache.find((m) => m.nickname === redpotion)
                if (guy) {
                    if (guy.roles.cache.has(alive.id)) {
                        let alrole = db.get(`role_${guy.id}`)
                        let allch = message.guild.channels.cache.filter((c) => c.name === `priv-${alrole.toLowerCase().replace(" ", "-")}`)

                        allch.forEach((lol) => {
                            if (lol.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                lol.send(`<:redp:821920816596910100> The Alchemist has sent you a potion. Sadly, you cannot make out the colour... you might die at the end of the day.`)
                                lol.send(`${alive}`)
                            }
                        })
                    }
                }
            }

            if (blackpotion) {
                let guy = message.guild.members.cache.find((m) => m.nickname === blackpotion)
                if (guy) {
                    if (guy.roles.cache.has(alive.id)) {
                        let alrole = db.get(`role_${guy.id}`)
                        let allch = message.guild.channels.cache.filter((c) => c.name === `priv-${alrole.toLowerCase().replace(" ", "-")}`)
                        allch.forEach((lol) => {
                            if (lol.permissionsFor(guy).has(["VIEW_CHANNEL", "SEND_MESSAGES"])) {
                                // beast hunter
                                for (let b = 0; b < bh.length; b++) {
                                    let bchan = message.guild.channels.cache.get(bh[b])
                                    let trap = db.get(`setTrap_${bchan.id}`)
                                    let active = db.get(`trapActive_${bchan.id}`)
                                    if (trap == blackpotion && active == true) {
                                        bchan.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                                        bchan.send(`${alive}`)
                                        chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username} could not be poisoned this night!`)
                                        chan.send(`${alive}`)
                                        blackpotion = "0"
                                        db.delete(`blackpotion_${chan.id}`)
                                        db.set(`setTrap_${bchan.id}`, null)
                                        db.set(`setTrap_${bchan.id}`, false)
                                    }
                                }

                                // doctor
                                if (blackpotion != "0") {
                                    for (let b = 0; b < doc.length; b++) {
                                        let bchan = message.guild.channels.cache.get(doc[b])
                                        if (db.get(`heal_${bchan.id}`) == blackpotion) {
                                            bchan.send(`<:heal:744536259673718894> Your protection saved **${guy.nickname} ${guy.user.username}**!`)
                                            bchan.send(`${alive}`)
                                            chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username} could not be poisoned this night!`)
                                            chan.send(`${alive}`)
                                            db.delete(`blackpotion_${chan.id}`)
                                            blackpotion = "0"
                                        }
                                    }
                                }

                                // witch
                                if (blackpotion != "0") {
                                    for (let b = 0; b < witch.length; b++) {
                                        let bchan = message.guild.channels.cache.get(witch[b])
                                        if (db.get(`potion_${bchan.id}`) == blackpotion) {
                                            bchan.send(`<:potion:744536604252700766> Your potion saved **${guy.nickname} ${guy.user.username}**!`)
                                            bchan.send(`${alive}`)
                                            chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username} could not be poisoned this night!`)
                                            chan.send(`${alive}`)
                                            blackpotion = "0"
                                            db.delete(`blackpotion_${chan.id}`)
                                            db.set(`potion_${bchan.id}`, null)
                                            db.set(`witchAbil_${bchan.id}`, 1)
                                        }
                                    }
                                }

                                // forger
                                if (blackpotion != "0") {
                                    let rpiu = message.guild.channels.cache.filter((c) => c.name === `priv-${alrole.toLowerCase().replace(" ", "-")}`)
                                    rpiu.forEach((bchan) => {
                                        if (bchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                            if (db.get(`shield_${bchan.id}`) == true) {
                                                bchan.send(`<:potion:744536604252700766> Your shield saved your life!`)
                                                bchan.send(`${alive}`)
                                                chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username} could not be poisoned this night!`)
                                                chan.send(`${alive}`)
                                                blackpotion = "0"
                                                db.delete(`blackpotion_${chan.id}`)
                                                db.set(`shield_${bchan.id}`, null)
                                            }
                                        }
                                    })
                                }

                                // bg
                                if (blackpotion != "0") {
                                    for (let b = 0; b < bg.length; b++) {
                                        let bchan = message.guild.channels.cache.get(bg[b])
                                        let lives = db.get(`lives_${bchan.id}`)
                                        let guard = db.get(`guard_${bchan.id}`)
                                        if (guard == blackpotion || alrole == "Bodyguard") {
                                            if (alrole == "Bodyguard") {
                                                if (lives == 2) {
                                                    if (bchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                        bchan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                                        bchan.send(`${alive}`)
                                                        chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username} could not be poisoned this night!`)
                                                        chan.send(`${alive}`)
                                                        blackpotion = "0"
                                                        db.delete(`blackpotion_${chan.id}`)
                                                        db.set(`lives_${bchan.id}`, 1)
                                                    }
                                                }
                                            } else if (guard == blackpotion) {
                                                if (lives == 2) {
                                                    bchan.send(`<:potion:744536604252700766> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                                    bchan.send(`${alive}`)
                                                    chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username} could not be poisoned this night!`)
                                                    chan.send(`${alive}`)
                                                    blackpotion = "0"
                                                    db.delete(`blackpotion_${chan.id}`)
                                                    db.set(`lives_${bchan.id}`, 1)
                                                } else if (lives == 1) {
                                                    for (let c = 1; c < 17; c++) {
                                                        let alchd = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                                        if (alchd) {
                                                            if (alchd.roles.cache.has(alive.id)) {
                                                                if (bchan.permissionsFor(alchd).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                                    blackpotion = alchd.nickname
                                                                    guy = alchd
                                                                    lol = bchan
                                                                    db.set(`blackpotion_${chan.id}`, alchd.nickname)
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // tg
                                if (blackpotion != "0") {
                                    for (let b = 0; b < tg.length; b++) {
                                        let bchan = message.guild.channels.cache.get(tg[b])
                                        let guard = db.get(`tough_${tg[b]}`)
                                        if (guard == blackpotion || alrole == "Tough Guy") {
                                            if (alrole == "Tough Guy") {
                                                blackpotion = "0"
                                                db.delete(`blackpotion_${chan.id}`)
                                                if (bchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                    for (let c = 1; c < 17; c++) {
                                                        let theal = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                                        if (theal) {
                                                            if (theal.roles.cache.has(alive.id)) {
                                                                if (chan.permissionsFor(theal).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                                    bchan.send(`You were attacked by **${theal.nickname} ${theal.user.username} (Alchemist)**! You will die at the end of the day!`)
                                                                    bchan.send(`${alive}`)
                                                                    chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username}** could not be poisoned this night!`)
                                                                    chan.send(`_ _\n\n<:tough_guy:606429479170080769> Player **${guy.nickname} ${guy.user.username}** is a **Tough Guy**. He know knows your role!`)
                                                                    chan.send(`${alive}`)
                                                                    db.set(`wounded_${bchan.id}`, true)
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            } else if (guard == blackpotion) {
                                                blackpotion = "0"
                                                db.delete(`blackpotion_${chan.id}`)
                                                let theal
                                                let thetg
                                                for (let c = 1; c < 17; c++) {
                                                    let maybeal = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                                    if (maybeal) {
                                                        if (maybeal.roles.cache.has(alive.id)) {
                                                            if (bchan.permissionsFor(maybeal).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                                thetg = maybeal
                                                            } else if (chan.permissionsFor(maybeal).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                                theal = maybeal
                                                            }
                                                        }
                                                    }
                                                }
                                                if (theal && thetg) {
                                                    bchan.send(`You were protecting **${guy.nickname} ${guy.user.username}** who was attacked by **${theal.nickname} ${theal.user.username} (Alchemist)**! You will die at the end of the day!`)
                                                    bchan.send(`${alive}`)
                                                    chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username}** could not be poisoned this night!`)
                                                    chan.send(`_ _\n\n<:tough_guy:606429479170080769> Player **${thetg.nickname} ${thetg.user.username}** is a **Tough Guy**. He know knows your role!`)
                                                    chan.send(`${alive}`)
                                                    db.set(`wounded_${bchan.id}`, true)
                                                }
                                            }
                                        }
                                    }
                                }

                                // rl
                                if (blackpotion != "0") {
                                    for (let b = 0; b < rl.length; b++) {
                                        let bchan = message.guild.channels.cache.get(rl[b])
                                        if (db.get(`visit_${bchan.id}`)) {
                                            chan.send(`<:guard:744536167109886023> **${guy.nickname} ${guy.user.username} could not be poisoned this night!`)
                                            chan.send(`${alive}`)
                                            bchan.send(`<:visit:744571914034479126> Someone tried to attack you while you were away!`)
                                            bchan.send(`${alive}`)
                                        }
                                    }
                                }

                                // killing
                                if (blackpotion != "0") {
                                    lol.send(`<:redp:821920816596910100> The Alchemist has sent you a potion. Sadly, you cannot make out the colour... you might die at the end of the day.`)
                                    lol.send(`${alive}`)
                                }
                            }
                        })
                    }
                }
            }
        }

        // illusionist delude
        for (let a = 0; a < illu.length; a++) {
            let illusionist = message.guild.channels.cache.get(illu[a])
            let toDelude = db.get(`toDisguise_${illu[a]}`) || null

            if (toDelude != null && toDelude != undefined) {
                let disguise = message.guild.members.cache.find((m) => m.nickname === toDelude)
                if (disguise.roles.cache.has(alive.id)) {
                    let theroleiwant = db.get(`role_${disguise.id}`)
                    // beast hunter trap
                    for (let b = 0; b < bh.length; b++) {
                        let trap = db.get(`setTrap_${bh[b]}`)
                        let active = db.get(`trapActive_${bh[b]}`)
                        if (trap == toDelude && active == true) {
                            let chan = message.guild.channels.cache.get(bh[b])
                            for (let c = 1; c <= alive.members.size + dead.members.size; c++) {
                                let player = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                if (chan.permissionsFor(player).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    c = 99
                                    if (player.roles.cache.has(alive.id)) {
                                        b = 99
                                        chan.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                                        chan.send(`${alive}`)
                                        illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                        illusionist.send(`${alive}`)
                                        db.set(`setTrap_${chan.id}`, null)
                                        db.set(`trapActive_${chan.id}`, false)
                                        toDelude = "0"
                                    }
                                }
                            }
                        }
                    }
                    // jailer protection
                    if (toDelude != "0") {
                        if (jailed.permissionsFor(disguise).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                            for (let b = 1; b <= alive.members.size + dead.members.size; b++) {
                                let player = message.guild.members.cache.find((m) => m.nickname === b.toString)
                                let theRoleIneed = db.get(`role_${player.id}`)
                                if (theRoleIneed == "Jailer") {
                                    b = 99
                                    if (player.roles.cache.has(alive.id)) {
                                        illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                        illusionist.send(`${alive}`)
                                        toDelude = "0"
                                    }
                                }
                            }
                        }
                    }

                    // doctor protection
                    if (toDelude != "0") {
                        for (let b = 0; b < doc.length; b++) {
                            let heal = db.get(`heal_${doc[b]}`)
                            if (heal == disguise.nickname) {
                                console.log(doc[b])
                                let doctor = message.guild.channels.cache.get(doc[b])
                                illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                illusionist.send(`${alive}`)
                                doctor.send(`<:heal:744536259673718894> Your protection saved **${disguise.nickname} ${disguise.user.username}**!`)
                                doctor.send(`${alive}`)
                                toDelude = "0"
                                b = 99
                            }
                        }
                    }

                    // witch potion
                    if (toDelude != "0") {
                        for (let b = 0; b < witch.length; b++) {
                            let chan = message.guild.channels.cache.get(witch[b])
                            let potion = db.get(`potion_${witch[b]}`)
                            if (potion == disguise.nickname) {
                                for (let c = 1; c <= alive.members.size + dead.members.size; c++) {
                                    let player = message.guild.members.cache.find((m) => m.nickname === c.toString())
                                    if (chan.permissionsFor(player).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                        c = 99
                                        if (player.roles.cache.has(alive.id)) {
                                            db.set(`potion_${witch[b]}`, null)
                                            db.set(`witchAbil_${witch[b]}`, "yes")
                                            illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                            illusionist.send(`${alive}`)
                                            chan.send(`<:potion:744536604252700766> Your potion saved **${disguise.nickname} ${disguise.user.username}**!`)
                                            chan.send(`${alive}`)
                                            toDelude = "0"
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // forger
                    if (toDelude != "0") {
                        let chans = message.guild.channels.cache.filter((c) => c.name === `priv-${theroleiwant.toLowerCase().replace(" ", "-")}`).keyArray("id")
                        for (let k = 0; k < chans.length; k++) {
                            let tempchan = message.guild.channels.cache.get(chans[k])
                            if (tempchan.permissionsFor(disguise).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                let shield = db.get(`shield_${tempchan.id}`)
                                if (shield == true) {
                                    tempchan.send(`<:guard:744536167109886023> You were attacked but your shield saved you!`)
                                    tempchan.send(`${alive}`)
                                    illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                    illusionist.send(`${alive}`)
                                    toDelude = "0"
                                    db.set(`shield_${tempchan.id}`, false)
                                }
                            }
                        }
                    }

                    // bodyguard with 1 life
                    if (toDelude != "0") {
                        if (theroleiwant == "Bodyguard") {
                            for (let b = 0; b < bg.length; b++) {
                                let chan = message.guild.channels.cache.get(bg[b])
                                if (chan.permissionsFor(disguise).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    b = 99
                                    let lives = db.get(`lives_${chan.id}`)
                                    if (lives == 2) {
                                        toDelude = "0"
                                        chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                        chan.send(`${alive}`)
                                        illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                        illusionist.send(`${alive}`)
                                        db.subtract(`lives_${chan.id}`, 1)
                                    }
                                }
                            }
                        }
                    }

                    // bg protect
                    if (toDelude != "0") {
                        for (let b = 0; b < bg.length; b++) {
                            let chan = message.guild.channels.cache.get(bg[b])
                            let lives = db.get(`lives_${chan.id}`)
                            let guard = db.get(`guard_${chan.id}`)
                            if (guard == disguise.nickname) {
                                if (lives == 2) {
                                    toDelude = "0"
                                    chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                    chan.send(`${alive}`)
                                    illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                    illusionist.send(`${alive}`)
                                    db.subtract(`lives_${chan.id}`, 1)
                                }
                            }
                        }
                    }

                    // red lady
                    if (toDelude != "0") {
                        if (theroleiwant == "Red Lady") {
                            for (let b = 0; b < rl.length; b++) {
                                let chan = message.guild.channels.cache.get(rl[b])
                                if (chan.permissionsFor(disguise).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                    if (db.get(`visit_${chan.id}`)) {
                                        chan.send(`<:guard:744536167109886023> Someone tried to kill you while you were away!`)
                                        chan.send(`${alive}`)
                                        illusionist.send(`<:guard:744536167109886023> Player **${disguise.nickname} ${disguise.user.username}** could not be disguised!`)
                                        illusionist.send(`${alive}`)
                                    }
                                }
                            }
                        }
                    }

                    if (toDelude != "0") {
                        let alldisguised = db.get(`disguised_${illusionist.id}`) || []
                        alldisguised.push(disguise.nickname)
                        db.set(`disguised_${illusionist.id}`, alldisguised) //.catch(e => message.channel.send("Something went wrong. The Illusionist could not try to add it's disguise!"))
                        illusionist.send(`<:delude:74563265503874568> Player **${disguise.nickname} ${disguise.user.username}** has successfully been disguised!`)
                        illusionist.send(`${alive}`)
                    }
                }
            }
        }

        // kitten conversion
        setTimeout(async () => {
            for (let a = 0; a < kww.length; a++) {
                let conversion = db.get(`scratch_${kww[a]}`)
                if (conversion != null) {
                    let guy = message.guild.members.cache.find((m) => m.nickname === conversion)
                    if (guy) {
                        db.set(`kitten_${kww[a]}`, "yes")
                        if (guy.roles.cache.has(alive.id)) {
                            let kwwrole = db.get(`role_${guy.id}`)
                            if (!kwwrole.toLowerCase().includes("wolf") && kwwrole != "Sorcerer") {
                                if (kwwrole == "Serial Killer" || kwwrole == "Bomber" || kwwrole == "Arsonist" || kwwrole == "Cannibal" || kwwrole == "Illusionist" || kwwrole == "Corruptor" || kwwrole == "Bandit" || kwwrole == "Accomplice" || kwwrole == "Sect Leader" || kwwrole == "Zombie") {
                                    let channel = message.guild.channels.cache.get(kww[a])
                                    channel.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                } else {
                                    // beast hunter
                                    for (let x = 0; x < bh.length; x++) {
                                        let trap = db.get(`setTrap_${bh[x]}`)
                                        let active = db.get(`trapActive_${bh[x]}`)
                                        if (trap == conversion && active == true) {
                                            wwChat.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                            let ctar = message.guild.channels.cache.get(bh[x])
                                            ctar.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                                            ctar.send(`${alive}`)
                                            conversion = "0"
                                        }
                                    }

                                    // jailer
                                    if (conversion != "0") {
                                        if (jailed.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
                                            for (let x = 1; x <= alive.members.size + dead.members.size; x++) {
                                                let ja = message.guild.members.cache.find((c) => c.name === x.toString())
                                                if (db.get(`role_${ja.id}`) == "Jailer") {
                                                    if (ja.roles.cache.has(alive.id)) {
                                                        conversion = "0"
                                                        wwChat.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // doctor
                                    if (conversion != "0") {
                                        for (let x = 0; x < doc.length; x++) {
                                            let ctar = message.guild.channels.cache.get(doc[x])
                                            if (db.get(`heal_${ctar.id}`) == guy.nickname) {
                                                ctar.send(`<:heal:744536259673718894> Your protection saved **${guy.nickname} ${guy.user.username}**!`)
                                                ctar.send(`${alive}`)
                                                wwChat.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                                conversion = "0"
                                            }
                                        }
                                    }

                                    // witch
                                    if (conversion != "0") {
                                        for (let x = 0; x < witch.length; x++) {
                                            let ctar = message.guild.channels.cache.get(witch[x])
                                            if (db.get(`potion_${ctar.id}`) == guy.nickname) {
                                                ctar.send(`<:potion:744536604252700766> Your potion saved **${guy.nickname} ${guy.user.username}**!`)
                                                ctar.send(`${alive}`)
                                                wwChat.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                                conversion = "0"
                                                db.set(`potion_${chan.id}`, null)
                                                db.set(`witchAbil_${chan.id}`, "1")
                                            }
                                        }
                                    }

                                    // bodyguard with 2 lives
                                    if (conversion != "0") {
                                        if (db.get(`role_${guy.id}`) == "Bodyguard") {
                                            for (let x = 0; x < bg.length; x++) {
                                                let ctar = message.guild.channels.cache.get(bg[x])
                                                if (ctar.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                    let lives = db.get(`lives_${ctar.id}`)
                                                    if (lives == 2) {
                                                        ctar.send("<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.")
                                                        conversion = "0"
                                                        ctar.send(`${alive}`)
                                                        wwChat.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                                        db.subtract(`lives_${ctar.id}`, 1)
                                                    }
                                                }
                                            }
                                        } else {
                                            for (let x = 0; x < bg.length; x++) {
                                                let ctar = message.guild.channels.cache.get(bg[x])
                                                if (db.get(`guard_${ctar.id}`) == guy.nickname) {
                                                    if (db.get(`lives_${ctar.id}`) == 2) {
                                                        ctar.send("<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.")
                                                        conversion = "0"
                                                        ctar.send(`${alive}`)
                                                        wwChat.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                                        db.subtract(`lives_${ctar.id}`, 1)
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // red lady
                                    if (conversion != "0") {
                                        if (db.get(`role_${guy.id}`) == "Red Lady") {
                                            for (let x = 0; x < rl.length; x++) {
                                                let chan = message.guild.channels.cache.get(rl[x])
                                                if (chan.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                    if (db.get(`visit_${chan.id}`)) {
                                                        chan.send(`<:guard:744536167109886023> Someone tried to kill you while you were away!`)
                                                        chan.send(`${alive}`)
                                                        wwChat.send(`Player **${guy.nickname} ${guy.user.username}** could not be converted! They were either protected, a solo killer, the Cursed or the Headhunter's target!`)
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (conversion != "0") {
                                        wwChat.permissionOverwrites.edit(guy.id, {
                                            SEND_MESSAGES: false,
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                        })
                                        wwChat.send(`The Kitten Wolf converted **${guy.nickname} ${guy.user.username}**!`)
                                        wwChat.send(`Player **${guy.nickname} ${guy.user.username}** has been converted! Welcome them to the team!`)
                                        db.set(`role_${guy.id}`, "Werewolf")
                                        let whwqye = message.guild.channels.cache.filter((c) => c.name === `priv-${role.replace(" ", "-").toLowerCase()}`)
                                        whwqye.forEach(async (element) => {
                                            if (element.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                element.permissionOverwrites.edit(guy.id, {
                                                    VIEW_CHANNEL: false,
                                                    READ_MESSAGE_HISTORY: false,
                                                    SEND_MESSAGES: false,
                                                })
                                            }
                                        })
                                        let ff = await message.guild.channels.create("priv-werewolf", {
                                            parent: "748959630520090626",
                                        })
                                        ff.permissionOverwrites.create(guy.id, {
                                            SEND_MESSAGES: true,
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                        })
                                        ff.permissionOverwrites.create(message.guild.id, {
                                            VIEW_CHANNEL: false,
                                        })
                                        ff.permissionOverwrites.create(narrator.id, {
                                            SEND_MESSAGES: true,
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                            MANAGE_CHANNELS: true,
                                            MENTION_EVERYONE: true,
                                            ATTACH_FILES: true,
                                        })
                                        ff.permissionOverwrites.create(narrator.id, {
                                            SEND_MESSAGES: true,
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                            MANAGE_CHANNELS: true,
                                            MENTION_EVERYONE: true,
                                            ATTACH_FILES: true,
                                        })

                                        await ff.send(db.get(`roleinfo_werewolf`))
                                        await ff.send(`_ _\n\n_ _\n\nYou have been converted into a Werewolf!`)
                                        let sos = await ff.send(`${alive}`)
                                        setTimeout(async () => {
                                            await sos.delete()
                                        }, 3000)

                                        // rl
                                        for (let x = 0; x < rl.length; x++) {
                                            let chan = message.guild.channels.cache.get(rl[x])
                                            if (db.get(`visit_${chan.id}`) == conversion) {
                                                for (let y = 1; y < 17; y++) {
                                                    let rlguy = message.guild.members.cache.find((m) => m.nickname === y.toString())
                                                    if (rlguy) {
                                                        if (rlguy.roles.cache.has(alive.id)) {
                                                            if (chan.permissionsFor(rlguy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                                                let eij = await message.guild.channels.create("priv-werewolf", {
                                                                    parent: "748959630520090626",
                                                                })
                                                                eij.permissionOverwrites.create(rlguy.id, {
                                                                    SEND_MESSAGES: true,
                                                                    VIEW_CHANNEL: true,
                                                                    READ_MESSAGE_HISTORY: true,
                                                                })
                                                                eij.permissionOverwrites.create(message.guild.id, {
                                                                    VIEW_CHANNEL: false,
                                                                })
                                                                eij.permissionOverwrites.create(narrator.id, {
                                                                    SEND_MESSAGES: true,
                                                                    VIEW_CHANNEL: true,
                                                                    READ_MESSAGE_HISTORY: true,
                                                                    MANAGE_CHANNELS: true,
                                                                    MENTION_EVERYONE: true,
                                                                    ATTACH_FILES: true,
                                                                })
                                                                eij.permissionOverwrites.create(narrator.id, {
                                                                    SEND_MESSAGES: true,
                                                                    VIEW_CHANNEL: true,
                                                                    READ_MESSAGE_HISTORY: true,
                                                                    MANAGE_CHANNELS: true,
                                                                    MENTION_EVERYONE: true,
                                                                    ATTACH_FILES: true,
                                                                })
                                                                await eij.send(db.get(`roleinfo_werewolf`))
                                                                await eij.semd(`_ _\n\nYou have been converted into a Werewolf!`)
                                                                let iwq = await eij.send(`${alive}`)
                                                                setTimeout(async () => {
                                                                    await iwq.delete()
                                                                }, 3000)
                                                                wwChat.permissionOverwrites.edit(rlguy.id, {
                                                                    VIEW_CHANNEL: true,
                                                                    SEND_MESSAGES: false,
                                                                    READ_MESSAGE_HISTORY: true,
                                                                })
                                                                wwChat.send(`The Kitten Wolf converted **${rlguy.nickname} ${rlguy.user.username}**!`)
                                                                wwChat.send(`Player **${rlguy.nickname} ${rlguy.user.username}** has been converted! Welcome them to the team!`)
                                                                chan.permissionOverwrites.edit(rlguy.id, {
                                                                    SEND_MESSAGES: false,
                                                                    VIEW_CHANNEL: false,
                                                                    READ_MESSAGE_HISTORY: false,
                                                                })
                                                                db.set(`role_${rlguy.id}`, "Werewolf")
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, 3000)
        // unlocking prisoners from their chat and clearing jailer chat
        let alljmsg = await jailed.messages.fetch()
        let clearjbmsg = alljmsg.filter((messages) => !messages.pinned && messages.author == client.user)
        let clearjmmsg = alljmsg.filter((messages) => !messages.pinned && messages.author != client.user)
        jailed.bulkDelete(clearjbmsg)
        jailed.bulkDelete(clearjmmsg)
        let prisoner
        for (let a = 1; a <= alive.members.size + dead.members.size; a++) {
            let guy = message.guild.members.cache.find((m) => m.nickname === a.toString())
            if (guy) {
                if (jailed.permissionsFor(guy).has(["VIEW_CHANNEL"])) {
                    prisoner = guy
                }
            }
        }
        if (prisoner) {
            let role = db.get(`role_${prisoner.id}`)
            let role2 = role.toLowerCase().replace(" ", "-")
            let chan = message.guild.channels.cache.filter((c) => c.name === `priv-${role2}`).keyArray("id")
            jailed.permissionOverwrites.edit(prisoner.id, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
            })
            for (let i = 0; i < chan.length; i++) {
                let channe = message.guild.channels.cache.get(chan[i])
                if (channe.permissionsFor(prisoner).has(["VIEW_CHANNEL"])) {
                    channe.permissionOverwrites.edit(prisoner.id, {
                        SEND_MESSAGES: true,
                    })
                }
            }
        }

        // zombie CONVERSION
        let bitten = db
            .all()
            .filter((data) => data.ID.startsWith("bitten"))
            .sort((a, b) => b.data - a.data)
        for (let i = 0; i < bitten.length; i++) {
            let chan = message.guild.channels.cache.get(bitten[i].ID.split("_")[1])
            if (chan) {
                for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                    let tempguy = message.guild.members.cache.find((m) => m.nickname === j.toString())
                    if (tempguy) {
                        if (tempguy.roles.cache.has(alive.id)) {
                            if (chan.permissionsFor(tempguy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                db.set(`role_${tempguy.id}`, "Zombie")
                                db.delete(`bitten_${chan.id}`)
                                chan.permissionOverwrites.edit(tempguy.id, {
                                    VIEW_CHANNEL: false,
                                    READ_MESSAGE_HISTORY: false,
                                    SEND_MESSAGES: false,
                                })

                                let ff = await message.guild.channels.create("priv-zombie", {
                                    parent: "748959630520090626",
                                })
                                ff.permissionOverwrites.create(tempguy.id, {
                                    SEND_MESSAGES: true,
                                    VIEW_CHANNEL: true,
                                    READ_MESSAGE_HISTORY: true,
                                })
                                ff.permissionOverwrites.create(message.guild.id, {
                                    VIEW_CHANNEL: false,
                                })
                                ff.permissionOverwrites.create(narrator.id, {
                                    SEND_MESSAGES: true,
                                    VIEW_CHANNEL: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MANAGE_CHANNELS: true,
                                    MENTION_EVERYONE: true,
                                    ATTACH_FILES: true,
                                })
                                ff.permissionOverwrites.create(narrator.id, {
                                    SEND_MESSAGES: true,
                                    VIEW_CHANNEL: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MANAGE_CHANNELS: true,
                                    MENTION_EVERYONE: true,
                                    ATTACH_FILES: true,
                                })
                                await ff.send(db.get(`roleinfo_zombie`))
                                let tee = await ff.send(`${alive}`)
                                await tee.delete({ timeout: 3000 })
                                zombies.permissionOverwrites.edit(tempguy.id, {
                                    SEND_MESSAGES: true,
                                    VIEW_CHANNEL: true,
                                    READ_MESSAGE_HISTORY: true,
                                })
                                zombies.send(`<:zombie:607528874548527106> Player **${tempguy.nickname} ${tempguy.user.username}** has been converted into a zombie! Welcome them to the team!`)
                            }
                        }
                    }
                }
            }
        }

        // zombie bite
        let brains = []
        for (let i = 0; i < zombie.length; i++) {
            let bite = db.get(`bite_${zombie[i]}`)
            if (bite != null) {
                let tempguy = message.guild.members.cache.find((m) => m.nickname === bite)
                if (tempguy) {
                    if (tempguy.roles.cache.has(alive.id)) {
                        brains.push(tempguy.id)
                    }
                }
            }
        }

        brains.sort(function (a, b) {
            return a - b
        })

        // filtering out if zombies bite the same person
        for (let i = 0; i < brains.length; i++) {
            if (brains[i] == brains[i + 1]) {
                brains.splice(i + 1, 1)
                i = i - 1
            }
        }

        // zombie bite
        for (let i = 0; i < brains.length; i++) {
            let guy = message.guild.members.cache.get(brains[i])
            if (guy) {
                let role = db.get(`role_${guy.id}`)

                // solo killers, cursed and wolves
                if (strongww.includes(role) || role == "Cursed" || soloKillers.includes(role) || role == "Sorcerer" || role == "Sect Leader" || role == "Accomplice" || message.guild.channels.cache.get("682617467767357453").permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    brains[i] = "0"
                    zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                }
                // beast hunter
                if (brains[i] != "0") {
                    for (let j = 0; j < bh.length; j++) {
                        let chan = message.guild.channels.cache.get(bh[j])
                        let trap = db.get(`setTrap_${chan.id}`)
                        let active = db.get(`trapActive_${chan.id}`)
                        if (trap == guy.nickname && active == true) {
                            brains[i] = "0"
                            chan.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                            chan.send(`${alive}`)
                            zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                            db.set(`setTrap_${chan.id}`, null)
                            db.set(`trapActive_${chan.id}`, false)
                        }
                    }
                }

                // jailer
                if (brains[i] != "0") {
                    if (jailed.permissionsFor(guy).has(["VIEW_CHANNEL"])) {
                        for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                            let tempguy = message.guild.members.cache.find((m) => m.nickname === j.toString())
                            if (tempguy) {
                                if (db.get(`role_${tempguy.id}`) == "Jailer") {
                                    if (tempguy.roles.cache.has(alive.id)) {
                                        zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                                        brains[i] = "0"
                                    }
                                }
                            }
                        }
                    }
                }

                // doctor
                if (brains[i] != "0") {
                    for (let j = 0; j < doc.length; j++) {
                        let chan = message.guild.channels.cache.get(doc[j])
                        if (db.get(`heal_${chan.id}`) == guy.nickname) {
                            chan.send(`<:heal:744536259673718894> Your protection saved **${guy.nickname} ${guy.user.username}**!`)
                            chan.send(`${alive}`)
                            zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                            brains[i] = "0"
                        }
                    }
                }

                // witch
                if (brains != "0") {
                    for (let j = 0; j < witch.length; j++) {
                        let chan = message.guild.channels.cache.get(witch[j])
                        if (db.get(`potion_${chan.id}`) == guy.nickname) {
                            chan.send(`<:potion:744536604252700766> Your potion saved **${guy.nickname} ${guy.user.username}**!`)
                            chan.send(`${alive}`)
                            zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                            brains[i] = "0"
                            db.set(`potion_${chan.id}`, null)
                            db.set(`witchAbil_${chan.id}`, "yes")
                        }
                    }
                }

                // forger
                let chan = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
                for (let j = 0; j < chan.length; j++) {
                    let tempchan = message.guild.channels.cache.get(chan[j])
                    if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        if (db.get(`shield_${tempchan.id}`) == true) {
                            tempchan.send(`<:guard:744536167109886023> Your shield saved you a life!`)
                            tempchan.send(`${alive}`)
                            zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                            brains[i] = "0"
                            db.set(`shield_${tempchan.id}`, false)
                        }
                    }
                }

                // bodyguard with 2 lives
                if (role == "Bodyguard") {
                    for (let j = 0; j < bg.length; j++) {
                        let chan = message.guild.channels.cache.get(bg[j])
                        if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            j = 99
                            chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                            chan.send(`${alive}`)
                            zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                            brains[i] = "0"
                            db.subtract(`lives_${chan.id}`, 1)
                        }
                    }
                } else {
                    for (let j = 0; j < bg.length; j++) {
                        let chan = message.guild.channels.cache.get(bg[j])
                        let guard = db.get(`guard_${chan.id}`)
                        let lives = db.get(`lives_${chan.id}`)
                        if (guard == guy.nickname) {
                            if (lives == 2) {
                                j = 99
                                chan.send(`<:guard:744536167109886023> You fought off an attack last night and survived. Next time you are attacked you will die.`)
                                chan.send(`${alive}`)
                                zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                                brains[i] = "0"
                                db.subtract(`lives_${chan.id}`, 1)
                            }
                        }
                    }
                }

                // red lady
                if (brains[i] != "0") {
                    if (role == "Red Lady") {
                        for (let j = 0; j < rl.length; j++) {
                            let chan = message.guild.channels.cache.get(rl[j])
                            if (chan.permissionsFor(guy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                if (db.get(`visit_${chan.id}`)) {
                                    brains[i] = "0"
                                    chan.send(`<:guard:744536167109886023> Someone tried to kill you while you were away!`)
                                    chan.send(`${alive}`)
                                    zombies.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be bitten!`)
                                }
                            }
                        }
                    }
                }

                // biting the player
                if (brains[i] != "0") {
                    zombies.send(`<:bitten:745632614442074223> Player **${guy.nickname} ${guy.user.username}** has been bitten!`)
                    let chan = message.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
                    for (let j = 0; j < chan.length; j++) {
                        let tempchan = message.guild.channels.cache.get(chan[j])
                        if (tempchan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            db.set(`bitten_${tempchan.id}`, true)
                        }
                    }
                    for (let j = 0; j < rl.length; j++) {
                        let rlchan = message.guild.channels.cache.get(rl[j])
                        if (db.get(`visit_${rlchan.id}`) == guy.nickname) {
                            for (let k = 1; k < 17; k++) {
                                let rlguy = message.guild.members.cache.find((m) => m.nickname === k.toString())
                                if (rlguy) {
                                    if (rlguy.roles.cache.has(alive.id)) {
                                        if (rlchan.permissionsFor(rlguy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                                            db.set(`bitten_${rlchan.id}`, true)
                                            zombies.send(`<:bitten:745632614442074223> Player **${rlguy.nickname} ${rlguy.user.username}** has been bitten!`)
                                            k = 99
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // bandits unable to speak in their chat
        for (let i = 0; i < bandits.length; i++) {
            let chan = message.guild.channels.cache.get(bandits[i])
            for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                let tom = message.guild.members.cache.find((m) => m.nickname === j.toString())
                if (tom) {
                    if (chan.permissionsFor(tom).has(["READ_MESSAGE_HISTORY"])) {
                        chan.permissionOverwrites.edit(tom.id, {
                            SEND_MESSAGES: false,
                            READ_MESSAGE_HISTORY: true,
                            VIEW_CHANNEL: true,
                        })
                        db.set(`banditKill_${chan.id}`, null)
                        db.set(`accomplice_${chan.id}`, null)
                    }
                }
            }
        }

        // zombies unable to talk in their chat
        for (let i = 1; i < 17; i++) {
            let tempguy = message.guild.members.cache.find((m) => m.nickname === i.toString())
            if (tempguy) {
                if (zombies.permissionsFor(tempguy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    zombies.permissionOverwrites.edit(tempguy.id, {
                        SEND_MESSAGES: false,
                    })
                }
            }
        }

        // confirming arsonist's douse
        for (let i = 0; i < arso.length; i++) {
            let chan = message.guild.channels.cache.get(arso[i])
            let douses = db.get(`toDouse_${arso[i]}`) || []
            if (douses.length > 0) {
                for (let j = 0; j < douses.length; j++) {
                    if (!douses[j]) {
                        douses[j] = "0"
                    }
                    let guy = message.guild.members.cache.find((m) => m.nickname === douses[j]) || "0"

                    // checking if beast hunter has the player trapped!
                    if (douses[j] != "0") {
                        for (let k = 0; k < bh.length; k++) {
                            let bchan = message.guild.channels.cache.get(bh[k])
                            let trap = db.get(`setTrap_${bchan.id}`)
                            let active = db.get(`trapActive_${bchan.id}`)
                            if (trap == douses[j] && active == true) {
                                chan.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be doused!`)
                                chan.send(`${alive}`)
                                bchan.send(`<:trap:744535154927861761> Your trap was triggered last night but your target was too strong.`)
                                bchan.send(`${alive}`)
                                douses[j] = "0"
                                db.set(`setTrap_${bchan.id}`, null)
                                db.set(`trapActive_${bchan.id}`, false)
                            }
                        }
                    }

                    // checking if the jailer has the user jailed!
                    if (douses[j] != "0") {
                        if (jailed.permissionsFor(guy).has(["VIEW_CHANNEL"])) {
                            for (let k = 1; k < 17; k++) {
                                let tempguy = message.guild.members.cache.find((m) => m.nickname === k.toString())
                                if (tempguy) {
                                    if (tempguy.roles.cache.has(alive.id)) {
                                        if (db.get(`role_${tempguy.id}`) == "Jailer") {
                                            douses[j] = "0"
                                            chan.send(`<:guard:744536167109886023> Player **${guy.nickname} ${guy.user.username}** could not be doused!`)
                                            chan.send(`${alive}`)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // adding the doused players to the list
                    if (douses[j] != "0") {
                        if (guy != "0") {
                            if (guy.roles.cache.has(alive.id)) {
                                let allDouses = db.get(`doused_${arso[i]}`) || []
                                allDouses.push(douses[j])
                                let arsoguy = message.guild.members.cache.find((m) => m.nickname === douses[j])
                                message.guild.channels.cache.get(arso[i]).send(`<:douse:744574203025686568> Player **${douses[j]} ${arsoguy.user.username}** has been doused!`)
                                for (let k = 0; k < rl.length; k++) {
                                    let chan = message.guild.channels.cache.get(rl[k])
                                    if (db.get(`visit_${chan.id}`) == guy.nickname) {
                                        for (let l = 1; l < 17; l++) {
                                            let rlguy = message.guild.members.cache.find((m) => m.nickname === l.toString())
                                            if (rlguy) {
                                                if (rlguy.roles.cache.has(alive.id)) {
                                                    message.guild.channels.cache.get(arso[i]).send(`<:douse:744574203025686568> Player **${l.toString()} ${rlguy.user.username}** has been doused!`)
                                                    allDouses.push(rlguy.nickname)
                                                }
                                            }
                                        }
                                    }
                                }
                                db.set(`doused_${arso[i]}`, allDouses)
                            }
                        }
                    }
                }
            }
        }

        // sheriff getting info
        setTimeout(function () {
            for (let i = 0; i < sheriff.length; i++) {
                let suspects = []
                let targetFailed = true
                let chan = message.guild.channels.cache.get(sheriff[i])
                let snipe = db.get(`snipe_${chan.id}`)
                if (snipe != null) {
                    let guy = message.guild.members.cache.find((m) => m.nickname === snipe)
                    if (guy) {
                        console.log(snipe)
                        if (killedplayers.includes(guy.id)) {
                            console.log(guy.id)
                            let killer = thekiller[killedplayers.indexOf(guy.id)]
                            let KILLME = message.guild.members.cache.get(killer)
                            //console.log(KILLME.id);
                            if (killer == "Werewolf") {
                                let allwolves = []
                                let wolvesID = []
                                for (let j = 0; j <= alive.members.size + dead.members.size; j++) {
                                    let tempguy = message.guild.members.cache.find((m) => m.nickname === j.toString())
                                    if (tempguy) {
                                        if (tempguy.roles.cache.has(alive.id)) {
                                            if (db.get(`role_${tempguy.id}`).toLowerCase().includes("wolf")) {
                                                allwolves.push(db.get(`role_${tempguy.id}`))
                                                wolvesID.push(tempguy.id)
                                            }
                                        }
                                    }
                                }
                                allwolves.sort((a, b) => strongww.indexOf(a) - strongww.indexOf(b))
                                for (let k = 0; k < wolvesID.length; k++) {
                                    if (db.get(`role_${wolvesID[k]}`) == allwolves[0]) {
                                        KILLME = message.guild.members.cache.get(wolvesID[k])
                                        k = 99
                                    }
                                }
                            }

                            if (KILLME) {
                                if (KILLME.roles.cache.has(alive.id)) {
                                    console.log("worked (s2)")
                                    // excluding the sheriff and the killer as the second suspect
                                    for (let j = 1; j <= alive.members.size + dead.members.size; j++) {
                                        let tempguy = message.guild.members.cache.find((m) => m.nickname === j.toString())
                                        if (tempguy) {
                                            if (tempguy != KILLME && !chan.permissionsFor(tempguy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && tempguy.roles.cache.has(alive.id)) {
                                                suspects.push(tempguy)
                                            }
                                        }
                                    }
                                    require("shuffle-array")(suspects)
                                    console.log(suspects)
                                    if (suspects.length > 0) {
                                        let terminus = require("shuffle-array")([suspects[0], KILLME])
                                        chan.send(`<:suspect:789549569750335509> Your target **${guy.nickname} ${guy.user.username}** was either killed by **${terminus[0].nickname} ${terminus[0].user.username}** or **${terminus[1].nickname} ${terminus[1].user.username}**!`)
                                        chan.send(`${alive}`)
                                        targetFailed = false
                                    }
                                }
                            }
                        }
                        if (targetFailed == true) {
                            chan.send("<:suspect:789549569750335509> You could not get any information last night!")
                        }
                    }
                }
            }
        }, 4000)

        // spirit seer getting info
        setTimeout(() => {
            for (let i = 0; i < ss.length; i++) {
                let chan = message.guild.channels.cache.get(ss[i])
                for (let j = 1; j < 17; j++) {
                    let tempguy = message.guild.members.cache.find((m) => m.nickname === j.toString())
                    if (tempguy) {
                        if (chan.permissionsFor(tempguy).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            if (tempguy.roles.cache.has(alive.id)) {
                                let check = db.get(`spirit_${chan.id}`) || []
                                if (check.length > 0) {
                                    let guys = []
                                    let killed = false
                                    for (let k = 0; k < check.length; k++) {
                                        let guy = message.guild.members.cache.find((m) => m.nickname === check[k])
                                        if (guy) {
                                            if (guy.roles.cache.has(alive.id)) {
                                                guys.push(guy)
                                                if (db.get(`role_${guy.id}`).toLowerCase().includes("wolf")) {
                                                    if (thekiller.includes("Werewolf")) {
                                                        killed = true
                                                    }
                                                } else {
                                                    if (thekiller.includes(guy.id)) {
                                                        killed = true
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (guys.length == 1) {
                                        if (killed == true) {
                                            chan.send(`<:yeskill:744534212878794863> **${guys[0].nickname} ${guys[0].user.username}** killed someone last night!`).catch((e) => chan.send(`${alive} An error occured, ping the narrator in charge to give you your info.`))
                                        } else {
                                            chan.send(`<:nokill:744534142515150979> **${guys[0].nickname} ${guys[0].user.username}** didn't kill anyone last night!`).catch((e) => chan.send(`${alive} An error occured, ping the narrator in charge to give you your info.`))
                                        }
                                    } else {
                                        if (killed == true) {
                                            chan.send(`<:yeskill:744534212878794863> **${guys[0].nickname} ${guys[0].user.username}** or **${guys[1].nickname} ${guys[1].user.username}** killed someone last night!`).catch((e) => chan.send(`${alive} An error occured, ping the narrator in charge to give you your info.`))
                                        } else {
                                            chan.send(`<:nokill:744534142515150979> **${guys[0].nickname} ${guys[0].user.username}** and **${guys[1].nickname} ${guys[1].user.username}** didn't kill anyone last night!`).catch((e) => chan.send(`${alive} An error occured, ping the narrator in charge to give you your info.`))
                                        }
                                    }
                                    chan.send(`${alive}`)
                                    db.set(`spirit_${chan.id}`, null)
                                }
                            }
                        }
                    }
                }
            }
        }, 4500)

        // lovers
        setTimeout(async () => {
            if (db.get(`nightCount`) == 1) {
                for (let x = 0; x < cupid.length; x++) {
                    let channel = message.guild.channels.cache.get(cupid[x])
                    let player
                    for (let y = 1; y <= 16; y++) {
                        let lololololol = message.guild.members.cache.find((m) => m.nickname === y.toString())
                        if (lololololol && channel.permissionsFor(lololololol).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                            y = 99
                            player = lololololol
                            if (player.roles.cache.has(alive.id) || player.roles.cache.has(dead.id)) {
                                let couple = []
                                if (couple.length != 0) {
                                    let guy1 = message.guild.members.cache.find((m) => m.nickname === couple[0])
                                    let guy2 = message.guild.members.cache.find((m) => m.nickname === couple[1])
                                    if (!guy1.roles.cache.has(alive.id)) {
                                        let alivePlayers = []
                                        for (let z = 1; z <= alive.members.size + dead.members.size; z++) {
                                            let guuy = message.guild.members.cache.find((m) => m.nickname === z.toString())
                                            if (guuy.roles.cache.has(alive.id)) {
                                                if (db.get(`role_${guuy.id}`) != "President") {
                                                    alivePlayers.push(guuy.id)
                                                }
                                            }
                                        }
                                        if (alivePlayers.length < 2) {
                                            channel.send("There aren't enough players for the couple to happen! The action has been canceled!")
                                        } else {
                                            guy1 = message.guild.members.cache.get(alivePlayers[Math.floor(Math.random() * alivePlayers.length)])
                                        }
                                    }
                                    if (!guy2.roles.cache.has(alive.id)) {
                                        let alivePlayers = []
                                        for (let z = 1; z <= alive.members.size + dead.members.size; z++) {
                                            let guuy = message.guild.members.cache.find((m) => m.nickname === z.toString())
                                            if (guuy.roles.cache.has(alive.id)) {
                                                if (db.get(`role_${guuy.id}`) != "President" && guuy != guy1) {
                                                    alivePlayers.push(guuy.id)
                                                }
                                            }
                                        }
                                        if (alivePlayers.length < 2) {
                                            channel.send("There aren't enough players for the couple to happen! The action has been canceled!")
                                        } else {
                                            guy2 = message.guild.members.cache.get(alivePlayers[Math.floor(Math.random() * alivePlayers.length)])
                                        }
                                    }
                                    lovers.permissionOverwrites.edit(guy1.id, {
                                        VIEW_CHANNEL: true,
                                        READ_MESSAGE_HISTORY: true,
                                        SEND_MESSAGES: false,
                                    })
                                    lovers.permissionOverwrites.edit(guy2.id, {
                                        VIEW_CHANNEL: true,
                                        READ_MESSAGE_HISTORY: true,
                                        SEND_MESSAGES: false,
                                    })
                                    lovers.send(`<:couple:744542381206143026> You are in love with **${guy1.nickname} ${guy1.user.username} (${db.get(`role_${guy1.id}`)})** and **${guy2.nickname} ${guy2.user.username} (${db.get(`role_${guy2.id}`)})**. You win if you stay alive together until the end of the game. You die if your lover dies.\n\n_ _\n\n_ _\n\n${alive}`)
                                    channel.send(`<:couple:744542381206143026> Player **${guy1.nickname} ${guy1.user.username}** and **${guy2.nickname} ${guy2.user.username}** are in love!`)
                                } else {
                                    let aliveplayers = []
                                    alive.members.forEach((play) => {
                                        aliveplayers.push(play)
                                    })
                                    let couple = []
                                    if (player.roles.cache.has(alive.id)) {
                                        aliveplayers.splice(aliveplayers.indexOf(player), 1)
                                    }
                                    if (aliveplayers.length > 1) {
                                        let couple1 = aliveplayers[Math.floor(Math.random() * aliveplayers.length)]
                                        aliveplayers.splice(aliveplayers.indexOf(couple1), 1)
                                        couple[0] = couple1
                                        couple[1] = aliveplayers[Math.floor(Math.random() * aliveplayers.length)]
                                        lovers.permissionOverwrites.edit(couple[0].id, {
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                            SEND_MESSAGES: false,
                                        })

                                        lovers.permissionOverwrites.edit(couple[1].id, {
                                            VIEW_CHANNEL: true,
                                            READ_MESSAGE_HISTORY: true,
                                            SEND_MESSAGES: false,
                                        })
                                        lovers.send(`You are in love with **${couple[0].nickname} ${couple[0].user.username} (${db.get(`role_${couple[0].id}`)})** and **${couple[1].nickname} ${couple[1].user.username} (${db.get(`role_${couple[1].id}`)})**. You win if you stay alive together until the end of the game. You die if your lover dies.\n\n_ _\n\n_ _\n\n${alive}`)
                                        channel.send(`<:couple:744542381206143026> Player **${couple[0].nickname} ${couple[0].user.username}** and **${couple[1].nickname} ${couple[1].user.username}** are in love!`)
                                    } else {
                                        channel.send(`There aren't enough players for the couple to happen! The action has been canceled!`)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }, 4625)

        // deleting the ww-vote
        let ms = await wwVote.messages.fetch()
        let md = await ms.filter((m) => m.author.id === "744538701522010174")
        if (md.size > 0) {
            await wwVote.bulkDelete(md)
        }

        // Code for all protectors to nullify their protection
        for (let i = 0; i < doc.length; i++) {
            db.set(`heal_${doc[i]}`, null)
        }
        for (let i = 0; i < bh.length; i++) {
            if (db.get(`setTrap_${bh[i]}`) != null) {
                db.set(`trapActive_${bh[i]}`, true)
            }
        }
        for (let i = 0; i < witch.length; i++) {
            db.set(`potion_${witch[i]}`, null)
        }

        for (let i = 0; i < zombie.length; i++) {
            db.set(`bite_${zombie[i]}`, null)
        }

        for (let i = 0; i < bg.length; i++) {
            db.set(`guard_${bg[i]}`, null)
        }
        for (let i = 0; i < jailer.length; i++) {
            db.delete(`jail_${jailer[i]}`)
        }
        for (let i = 0; i < bandit.length; i++) {
            db.set(`bandit_${bandit[i]}`, null)
        }
        for (let i = 0; i < bandits.length; i++) {
            db.set(`banditKill_${bandits[i]}`, null)
            db.set(`accomplice_${bandits[i]}`, null)
        }
        for (let i = 0; i < bandit.length; i++) {
            db.set(`bandit_${bandit[i]}`, null)
        }
        for (let i = 0; i < rl.length; i++) {
            db.set(`visit_${rl[i]}`, null)
        }
        for (let i = 0; i < arso.length; i++) {
            db.delete(`toDouse_${arso[i]}`)
        }
        console.log("The code worked up to here!")
        db.set(`vtshadow`, false)
        db.set(`isDay`, "yes")
        db.set(`isNight`, "no")
        // if (args[1] == "test") {
        //   dayChat.send(`${alive}`)
        // }
        console.log(`Day: ${db.get(`dayCount`)}`)
    },
}
