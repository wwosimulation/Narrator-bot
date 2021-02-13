const db = require("quick.db");

module.exports = {
  name: "reset",
  run: async (message, args, client) => {
    if (message.member.roles.cache.has("606139219395608603") || message.member.roles.cache.has("606276949689499648")) {
      let times = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000];
      times = times[Math.floor(Math.random() * times.length)];
      let gunner = message.guild.channels.cache.filter(c => c.name === "priv-gunner").keyArray("id") // gunner
      let grumpy = message.guild.channels.cache.filter(c => c.name === "priv-grumpy-grandma").keyArray("id") // gg
      let seer = message.guild.channels.cache.filter(c => c.name === "priv-seer").keyArray("id") // seer
      let aura = message.guild.channels.cache.filter(c => c.name === "priv-aura-seer").keyArray("id") // aura
      let doctor = message.guild.channels.cache.filter(c => c.name === "priv-doctor").keyArray("id") // doc
      let beasthunter = message.guild.channels.cache.filter(c => c.name === "priv-beast-hunter").keyArray("id") // bh
      let witch = message.guild.channels.cache.filter(c => c.name === "priv-witch").keyArray("id") // witch
      let bodyguard = message.guild.channels.cache.filter(c => c.name === "priv-bodyguard").keyArray("id") // bg
      let det = message.guild.channels.cache.filter(c => c.name === "priv-detective").keyArray("id") // det
      let priest = message.guild.channels.cache.filter(c => c.name === "priv-priest").keyArray("id") // priest
      let paci = message.guild.channels.cache.filter(c => c.name === "priv-pacifist").keyArray("id") // paci
      let flower = message.guild.channels.cache.filter(c => c.name === "priv-flower-child").keyArray("id") // fc
      let guardian = message.guild.channels.cache.filter(c => c.name === "priv-guardian-wolf").keyArray("id") // gww
      let wwpaci = message.guild.channels.cache.filter(c => c.name === "priv-wolf-pacifist").keyArray("id") // wwp
      let wwseer = message.guild.channels.cache.filter(c => c.name === "priv-wolf-seer").keyArray("id") // wws
      let skiller = message.guild.channels.cache.filter(c => c.name === "priv-serial-killer").keyArray("id") // sk
      let arsonist = message.guild.channels.cache.filter(c => c.name === "priv-arsonist").keyArray("id") // arso
      let bomb = message.guild.channels.cache.filter(c => c.name === "priv-bomber").keyArray("id") // bomber
      let secthunter = message.guild.channels.cache.filter(c => c.name === "priv-sect-hunter").keyArray("id") // sect hunter
      let sorcerer = message.guild.channels.cache.filter(c => c.name === "priv-sorcerer").keyArray("id") // sorcerer
      let wwshaman = message.guild.channels.cache.filter(c => c.name === "priv-wolf-shaman").keyArray("id") // wwshaman
      let hh = message.guild.channels.cache.filter(c => c.name === "priv-headhunter").keyArray("id")
      let jailer = message.guild.channels.cache.filter(c => c.name === "priv-jailer").keyArray("id")
      let canni = message.guild.channels.cache.filter(c => c.name === "priv-cannibal").keyArray("id")
      let nmww = message.guild.channels.cache.filter(c => c.name === "priv-nightmare-werewolf").keyArray("id")
      let shadow = message.guild.channels.cache.filter(c => c.name === "priv-shadow-wolf").keyArray("id")
      let ft = message.guild.channels.cache.filter(c => c.name === "flowe-child").keyArray("id")
      let mm = message.guild.channels.cache.filter(c => c.name === "priv-marksman").keyArray("id")
      let illu = message.guild.channels.cache.filter(c => c.name === "priv-illusionist").keyArray("id")
      let corr = message.guild.channels.cache.filter(c => c.name === "priv-corruptor").keyArray("id")
      let nb = message.guild.channels.cache.filter(c => c.name === "priv-naughty-boy").keyArray("id")
      let cupid = message.guild.channels.cache.filter(c => c.name === "priv-cupid").keyArray("id")
      let bandit = message.guild.channels.cache.filter(c => c.name === "priv-bandit").keyArray("id")
      let bandits = message.guild.channels.cache.filter(c => c.name.startsWith("bandits")).keyArray("id")
      let wwb = message.guild.channels.cache.filter(c => c.name === "priv-werewolf-berserk").keyArray("id")
      let tg = message.guild.channels.cache.filter(c => c.name === "priv-tough-guy").keyArray("id")
      let dp = message.guild.channels.cache.filter(c => c.name === "priv-doppelganger").keyArray("id")
      let kww = message.guild.channels.cache.filter(c => c.name === "priv-kitten-wolf").keyArray("id")
      let forger = message.guild.channels.cache.filter(c => c.name === "priv-forger").keyArray("id")
      let zombie = message.guild.channels.cache.filter(c => c.name === "priv-zombie").keyArray("id")

      message.guild.channels.cache.get('606132999389708330').updateOverwrite(message.guild.roles.cache.get('606140092213624859').id, {
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: false,
        VIEW_CHANNEL: false
      })

      message.guild.channels.cache.get('606132387587293195').updateOverwrite(message.guild.roles.cache.get('606140092213624859').id, {
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        VIEW_CHANNEL: true
      })

      //await client.channels.cache.find(c => c.name === "game-warning").messages.cache.get(db.get(`game`)).delete().catch(e => message.channel.send(`Error: ${e.message}`))
      
      let t = client.guilds.cache.get("465795320526274561").roles.cache.get("606123676668133428").members
      
      t.forEach(e => {
        e.roles.remove("606123676668133428")
      })
        
        
      client.channels.cache.find(c => c.name === "game-warning").send(`Game ended! ${db.get(`winner`)} won the match!`)
      db.set(`game`, null)
      for (let i = 0; i < gunner.length ; i++) {
        db.set(`bullets_${gunner[i]}`, 2)
        db.set(`did_${gunner[i]}`,  555)
      }
      
      for (let i = 0; i < grumpy.length ; i++) {
        db.set(`mute_${grumpy[i]}`, null)
      }
      
      for (let i = 0; i < seer.length ; i++) {
        db.set(`seer_${seer[i]}`, "no")
      }
      
      for (let i = 0; i < aura.length ; i++) {
        db.set(`auraCheck_${aura[i]}`, "no")
      }
      
      for (let i = 0; i < doctor.length ; i++) {
        db.set(`heal_${doctor[i]}`, null)
      }
      
      for (let i = 0; i < beasthunter.length; i++) {
        db.set(`setTrap_${beasthunter[i]}`, null) 
        db.set(`trapActive_${beasthunter[i]}`, false) 
      }
      
      for (let i = 0; i < witch.length ; i++) {
        db.set(`potion_${witch[i]}`, null)
        db.set(`witch_${witch[i]}`, 0)
        db.set(`witchAbil_${witch[i]}`, 0)
      }
      
      for (let i = 0; i < bodyguard.length; i++) {
        db.set(`guard_${bodyguard[i]}`, null)
        db.set(`lives_${bodyguard[i]}`, 2)
      }
      
      for (let i = 0 ; i < det.length ; i++) {
        db.set(`detCheck_${det[i]}`, null)
      }
      
      for (let i = 0 ; i < priest.length; i++) {
        db.set(`priest_${priest[i]}`, null)
      }
      
      for (let i = 0; i < paci.length ; i++) {
        db.set(`paci_${paci[i]}`, "no")
      }
      
      for (let i = 0; i < flower.length; i++) {
        db.set(`protest_${flower[i]}`, "no")
        db.set(`flower_${flower[i]}`, null)
      }
      
      for (let i = 0; i < guardian.length; i++) {
        db.set(`protest_${guardian[i]}`, "no")
        db.set(`guardian_${guardian[i]}`, null)
      }
      
      for (let i = 0 ; i < wwpaci.length ; i++) {
        db.set(`paci_${wwpaci[i]}`, "no")
      }
      
      for (let i = 0 ; i < wwseer.length ; i++) {
        db.set(`wwseer_${wwseer[i]}`, "no")
        db.set(`resign_${wwseer[i]}`, false)
      }
      
      for (let i = 0 ; i < skiller.length ; i++) {
        db.set(`stab_${skiller[i]}`, null)
      }
      
      for (let i = 0; i < arsonist ; i++) {
        db.delete(`doused_${arsonist[i]}`)
        db.delete(`toDouse__${arsonist[i]}`)
      }
      
      for (let i = 0 ; i < canni.length ;i++) {
        db.set(`eat_${canni[i]}`, null)
        db.set(`hunger_${canni[i]}`, 1)
      }

      for (let i = 0; i < bomb ; i++) {
        db.set(`bombs_${bomb[i]}`, null)
        db.set(`didCmd_${bomb[i]}`, -1)
      }
      
      for (let i = 0 ; i < secthunter.length ; i++) {
        db.set(`hunt_${message.channel.id}`, null)
      }
      
      for (let i = 0 ; i < sorcerer.length ; i++) {
        db.set(`sorcerer_${sorcerer[i]}`, "no")
      }
      
      for (let i = 0 ; i < wwshaman.length ; i++) {
        db.set(`shaman_${wwshaman[i]}`, null)
      }
      
      for (let i = 0 ; i < hh.length ; i++) {
        db.set(`hhtarget_${hh[i]}`, null)
      }

      for (let i = 0 ; i < nmww.length ; i++) {
        db.set(`sleepy_${nmww[i]}`, null)
        db.set(`nightmare_${nmww[i]}`, 2)
      }

      for (let i = 0 ; i < shadow.length ; i++) {
        db.set(`shadow_${shadow[i]}`, "no")
      }

      for (let i = 0 ; i < ft.length; i++) {
        db.set(`cards_${ft[i]}`, 2) 
      }

      for (let i = 0 ; i < mm.length ; i++) {
        db.set(`mark_${mm[i]}`, null)
        db.set(`markActive_${mm[i]}`, false)
        db.set(`arrows_${mm[i]}`, 2)
      }

      for (let i = 0 ; i < illu.length ; i++) {
        db.delete(`disguised_${illu[i]}`)
        db.delete(`toDisguise_${illu[i]}`)
      }

      for (let i = 0 ; i < corr.length ; i++) {
        db.set(`corrupt_${corr[i]}`, null)
      }

      for (let i = 0 ; i < nb.length ; i++) {
        db.set(`toy_${nb[i]}`, "no")
      }
      for (let i = 0 ; i < jailer.length ; i++) {
        db.set(`jail_${jailer[i]}`, null)
        db.set(`bullet_jail`, 1)
      }

      for (let i = 0 ; i < cupid.length ; i++) {
        db.set(`couple_${cupid[i]}`, null)
      }

      for (let i = 0 ; i < bandit.length ; i++) {
        db.set(`bandit_${bandit[i]}`, null)
      }

      for (let i = 0 ; i < bandits.length ; i++) {
        db.set(`banditKill_${bandits[i]}`, null)
        db.set(`accomplice_${bandits[i]}`, null)
      }

      for (let i = 0 ; i < tg.length ; i++) {
        db.set(`tough_${tg[i]}`, null)
      }

      for (let i = 0 ; i < tg.length ; i++)  {
        db.set(`frenzy_${wwb[i]}`, false)
        db.set(`abil_${wwb[i]}`, "no")
      }

      for (let i = 0 ; i < dp.length ; i++) {
        db.delete(`copy_${dp[i]}`, null)
      }
      
      for (let i = 0 ; i < kww.length ; i++) {
        db.delete(`scratch_${kww[i]}`)
      }
      for (let i = 0 ; i < forger.length ; i++) {
        db.set(`given_${forger[i]}`, true)
        db.set(`forged_${forger[i]}`, 3)
      }

      for (let i = 0 ; i < zombie.length ; i++) {
        db.set(`bite_${zombie[i]}`, null)
      }
      // removing cards, shield and sword from players
      let allChannels = message.guild.channels.cache.filter(c => c.name.startsWith('priv-')).keyArray('id')
      for (let i = 0 ; i < allChannels.length ; i++) {
        if (db.get(`card_${allChannels[i]}`) == true) {
          db.set(`card_${allChannels[i]}`, false)
        }
        if (db.get(`shield_${allChannels[i]}`) == true) {
          db.set(`shield_${allChannels[i]}`, false)
        }
        if (db.get(`sword_${allChannels[i]}`) == true) {
          db.set(`sword_${allChannels[i]}`, false)
        }
        if (db.get(`bitten_${allChannels[i]}`) == true) {
          db.delete(`bitten_${allChannels[i]}`)
        }
      }

      message.channel
        .send(
          "Iniating to reset database. Please allow 15 seconds to 1 minute of your time to allow this process to execute."
        )
        .then(msg => {
          setTimeout(function() {
            msg.edit("Database has successfully reset. Happy hunting 🐺").catch(e => message.channel.send(`Error: ${e.message}`));
          }, times);
        }).catch(e => message.channel.send(`Error: ${e.message}`));
    }
  }
};
