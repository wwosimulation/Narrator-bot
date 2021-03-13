const db = require("quick.db");
const Discord = require("discord.js");

module.exports = {
  name: "check",
  run: async (message, args, client) => {
    let shaman1 = await db.fetch(`shaman_606157077705916426`);
    let shaman2 = await db.fetch(`shaman_606156636704473098`);
    let shaman3 = await db.fetch(`shaman_606157075927662741`);
    let shaman4 = await db.fetch(`shaman_606157077315846146`);
    let shaman = message.guild.channels.cache.filter(c => c.name === "priv-wolf-shaman").keyArray("id")
    let illu = message.guild.channels.cache.filter(c => c.name === "priv-illusionist").keyArray("id")
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let dead = message.guild.roles.cache.find(r => r.name === "Dead");
    if (message.channel.name == "priv-aura-seer") {
      if (!args[0]) return message.channel.send("Hey stupid, maybe try inserting an argument for once?")
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      if (!guy) return message.reply("Invalid Target!")
      if (
        !guy.roles.cache.has("606140092213624859") ||
        !ownself.roles.cache.has("606140092213624859")
      ) {
        return await message.reply("Your or your target is not alive");
      } 
      if (guy == ownself) {
        return message.channel.send("Checking yourself is like a whole new level of stupid.")
      } else {
        let ability = await db.fetch(`auraCheck_${message.channel.id}`);
        if (ability == "yes") {
          return await message.reply(
            `You have already used your ability for tonight!`
          );
        } else {
          let role = await db.fetch(`role_${guy.id}`);
          let aura = client.config.roles[role].aura

            for (let i = 0 ; i < illu.length ; i++) {
              let disguised = db.get(`disguised_${illu[i]}`) || []
              if (disguised.length != 0) {
                if (disguised.includes[args[0]]) {
                  aura == "Unknown"
                } 
              }
            }
          
          
            for (let i = 0 ; i < shaman.length ; i++) {
              let disguised = db.get(`shaman_${shaman[i]}`) || ""
              if (disguised == args[0]) {
                aura = "Evil"
              }
            }
          db.set(`auraCheck_${message.channel.id}`, "yes");
          message.channel.send(
            `You checked **${args[0]} ${guy.user.username} (${aura})**`
          );
        }
      }
    } else if (message.channel.name == "priv-seer") {
      if (!args[0]) return message.channel.send("Woah, i discovered a whole new level of stupid...")
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      if (!guy || guy == ownself) return await message.reply("Invalid Target");
      if (
        !guy.roles.cache.has("606140092213624859") ||
        !ownself.roles.cache.has("606140092213624859")
      )
        return await message.channel.send("You or your target is not alive!");
      let checked = await db.fetch(`seer_${message.channel.id}`);
      if (checked == "yes")
        return await message.channel.send(
          "You already used your ability for tonight!"
        );
      let role = await db.fetch(`role_${guy.id}`);
      
      for (let i = 0 ; i < illu.length ; i++) {
        let disguised = db.get(`disguised_${illu[i]}`) || []
        if (disguised.length != 0) {
          if (disguised.includes[args[0]]) {
            role == "Illusionist"
          } 
        }
      }
      
      for (let i = 0 ; i < shaman.length ; i++) {
        let disguised = db.get(`shaman_${shaman[i]}`) || ""
          if (disguised == args[0]) {
            role = "Wolf Shaman"
          }
       }
      
      message.channel.send(
        `You checked **${args[0]} ${guy.user.username} (${role})**!`
      );
      db.set(`seer_${message.channel.id}`, "yes");
    } else if (message.channel.name == "priv-detective") {
      if (args.length != 2)
        return await message.channel.send(
          "Honey, as Detective you need to select 2 players. This won't work. Come back to me when you have learned the basics."
        );
      let guy1 = message.guild.members.cache.find(m => m.nickname === args[0]);
      let guy2 = message.guild.members.cache.find(m => m.nickname === args[1]);
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      if (!guy1 || !guy2 || guy1 == ownself || guy2 == ownself || guy1 == guy2)
        return await message.reply("Invalid Target");
      if (
        !guy1.roles.cache.has("606140092213624859") ||
        !guy2.roles.cache.has("606140092213624859") ||
        !ownself.roles.cache.has("606140092213624859")
      )
        return await message.channel.send(
          "Yeah sure. Checking a dead player or checking while being dead. 1000000iq. Very smart. If you are smart, you can figure your information by yourself."
        );
      let ability = await db.fetch(`detCheck_${message.channel.id}`);
      if (ability == "yes")
        return await message.reply(
          `You have already used your ability for tonight!`
        );

      let role1 = await db.fetch(`role_${guy1.id}`);
      let role2 = await db.fetch(`role_${guy2.id}`);
      let team1 = client.config.roles[role1].team
      let team2 = client.config.roles[role2].team

      if (
        shaman1 == args[0] ||
        shaman2 == args[0] ||
        shaman3 == args[0] ||
        shaman4 == args[0]
      ) {
        team1 = "Werewolf";
        team2 = "Werewolf";
      }

      for (let i = 0 ; i < illu.length ; i++) {
        let disguised = db.get(`disguised_${illu[i]}`) || []
        if (disguised.length != 0) {
          if (disguised.includes[args[0]]) {
            team1 == "Solo"
          } 
        }
      }
      
      for (let i = 0 ; i < illu.length ; i++) {
        let disguised = db.get(`disguised_${illu[i]}`) || []
        if (disguised.length != 0) {
          if (disguised.includes[args[0]]) {
            team2 == "Solo"
          } 
        }
      }
      
      for (let i = 0 ; i < shaman.length ; i++) {
        let disguised = db.get(`shaman_${shaman[i]}`) || ""
          if (disguised == args[0]) {
            team1 = "Werewolf"
          }
       }
      
      for (let i = 0 ; i < shaman.length ; i++) {
        let disguised = db.get(`shaman_${shaman[i]}`) || ""
          if (disguised == args[1]) {
            team2 = "Werewolf"
          }
       }
      
      let result = "";
      if (team1 == "Solo" || team2 == "Solo") {
        result = "different teams";
      } else {
        if (team1 == team2) {
          result = "the same team";
        } else if (team1 != team2) {
          result = "different teams";
        }
      }
      message.channel.send(
        `**${args[0]} ${guy1.user.username}** and **${args[1]} ${
          guy2.user.username
        }** have ${result}!`
      );
      db.set(`detCheck_${message.channel.id}`, "yes");
    } else if (message.channel.name == "priv-wolf-seer") {
      ;
      ;
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      let ability = await db.fetch(`wwseer_${message.channel.id}`);
      if (ability == "yes")
        return await message.channel.send(
          "Yup, cheating to win. That's the norm these days rite?"
        );
      if (message.member.roles.cache.has(client.config.ids.dead))
        return await message.channel.send(
          "Yes. Checking while dead. Dude, you can't even tell the wolves your check."
        );
      if (message.member == guy || !guy)
        return await message.channel.send("Invalid Target");
      if (guy.roles.cache.has(client.config.ids.dead))
        return await message.channel.send(
          "Sure, why not? Checking a dead player. You can become the best pro player."
        );
      let role = await db.fetch(`role_${guy.id}`);
      let roles = role.toLowerCase();
      if (roles.includes("wolf") || role == "Sorcerer")
        return await message.channel.send(
          "Ah yes. Checking a teammate. Gamethrowing is the best option mate."
        );
      let ye = "no";
      for (let i = 1; i <= alive.members.size + dead.members.size; i++) {
        console.log(i);
        let tt = message.guild.members.cache.find(
          m => m.nickname === message.member.nickname
        );
        let h = message.guild.members.cache.find(m => m.nickname === i.toString());
        if (h.roles.cache.has(client.config.ids.alive)) {
          let rolet = await db.fetch(`role_${h.id}`);
          console.log(rolet);
          let roleh = rolet.toLowerCase();
          console.log(roleh);
          console.log(roleh.includes("wolf") && h != tt);
          if (roleh.includes("wolf") && h != tt) {
            ye = "yes";
          }
        }
      }
      if (ye != "yes")
        return await message.channel.send(
          "You probably forgot that you are the last wolf alive smartass"
        );
      let wwchat = message.guild.channels.cache.find(
        c => c.name == "werewolves-chat"
      );

      for (let i = 0 ; i < illu.length ; i++) {
        let disguised = db.get(`disguised_${illu[i]}`) || []
        if (disguised.length != 0) {
          if (disguised.includes[args[0]]) {
            role == "Illusionist"
          } 
        }
      }

      let solokillers = ["Serial Killer", "Arsonist", "Bomber", "Corruptor", "Cannibal", "Illusionist", "Bandit", "Alchemist"]
      message.channel.send(
        `You checked **${args[0]} ${guy.user.username} (${role})**!`
      );
      if (solokillers.includes(role)) {
        wwchat.send(
          `The Wolf Seer checked **${args[0]} ${guy.user.username} (${role})**! As a werewolf, you cannot kill this player at night.`
        );  
      }
      wwchat.send(
        `The Wolf Seer checked **${args[0]} ${guy.user.username} (${role})**!`
      );
      db.set(`wwseer_${message.channel.id}`, "yes");
    } else if (message.channel.name == "priv-sorcerer") {
      let ability = await db.fetch(`sorcerer_${message.channel.id}`);
      let isNight = await db.fetch(`isNight_${message.guild.id}`);
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      if (!guy || guy == ownself)
        return await message.channel.send("Invalid Target!");
      if (!guy.roles.cache.has(client.config.ids.alive) || !ownself.roles.cache.has(client.config.ids.alive))
        return await message.channel.send("Bruh, I rather you gamethrow");
      if (!isNight == "yes")
        return await message.channel.send(
          "Hmm, i think you should be a bot. You will 100% not fail this job. ||Not||"
        );
      if (!ability == "no")
        return await message.channel.send("Yes, why not check every time... ");
      let rol = await db.fetch(`role_${guy.id}`);
      let role = rol.toLowerCase();
      if (role.includes("wolf"))
        return await message.channel.send(
          "I know you are a type of seer, but stop checking your teammates dumb."
        );

        for (let i = 0 ; i < illu.length ; i++) {
          let disguised = db.get(`disguised_${illu[i]}`) || []
          if (disguised.length != 0) {
            if (disguised.includes[args[0]]) {
              role == "Illusionist"
            } 
          }
        }

      message.channel.send(
        "You checked **" +
          args[0] +
          " " +
          guy.user.username +
          " (" +
          role +
          ")**! "
      );
      db.set(`sorcerer_${message.channel.id}`, "yes");
    } else if (message.channel.name == "priv-spirit-seer") {
      let isNight = db.get(`isNight_${message.guild.id}`)
      let guy1 = message.guild.members.cache.find(m => m.nickname === args[0]) || 
            message.guild.members.cache.find(m => m.id === args[0]) ||  
            message.guild.members.cache.find(m => m.user.username === args[0]) || 
            message.guild.members.cache.find(m => m.user.tag === args[0])
      let guy2 = message.guild.members.cache.find(m => m.nickname === args[1]) || 
            message.guild.members.cache.find(m => m.id === args[1]) ||  
            message.guild.members.cache.find(m => m.user.username === args[1]) || 
            message.guild.members.cache.find(m => m.user.tag === args[1])
      if (!message.member.roles.cache.has(client.config.ids.alive)) return message.channel.send("When you are a ghost, you still can't check other people's spirit smart-ass")
      if (isNight != "yes") return message.channel.send("Checking for spirits in the day makes you look dumb.")
      if (args.length < 1 || args.length > 2) return message.channel.send("BRUH YOU NEED TO SELECT AT MOST 2 PEOPLE AND AT LEAST 1 PERSON!")
      let check = []
      for (let i = 0 ; i < args.length ; i++) {
        if (i == 0) {
          if (!guy1 || guy1.id == message.author.id) return message.reply("Invalid Target!")
          if (!guy1.roles.cache.has(client.config.ids.alive)) return message.channel.send("You cannot check a dead player's spirit!")
          check.push(guy1.nickname)
        } else {
          if (!guy2 || guy2.id == message.author.id) return message.reply("Invalid Target!")
          if (!guy2.roles.cache.has(client.config.ids.alive)) return message.channel.send("You cannot check a dead player's spirit!")
          check.push(guy2.nickname)
        }
      }
      db.set(`spirit_${message.channel.id}`, check)
      message.react("744534042329743370")
      
    }
  }
};
