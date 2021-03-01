const Discord = require("discord.js");
const db = require("quick.db");
let voteForwws = ["0"];
module.exports = {
  name: "vote",
  run: async (message, args, client) => {
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let dead = message.guild.roles.cache.find(r => r.name === "Dead");
    let wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
    let wwsVote = await db.fetch(`wwsVote_${message.guild.id}`);
    let commandEnabled = await db.fetch(`commandEnabled_${message.guild.id}`);
    if (wwsVote == "yes") {
      if (!message.channel.name.includes("wolf")) return;
    
      let voted =
        message.guild.members.cache.find(m => m.nickname === args[0]) ||
        message.guild.members.cache.find(m => m.id === args[0]) ||
        message.guild.members.cache.find(m => m.user.username === args[0]);
        if (message.member.roles.cache.has(dead.id))
        return message.channel.send(
          "I'm not even gonna say what's your problem."
        );
      if (!voted && args[0] != "cancel") return message.channel.send("Target doesn't exist!");

      if (args[0] == "cancel") {
        let tmtd = db.get(`wwkillmsg_${message.channel.id}`)
        if (tmtd) {
          let a = await wwchat.messages.fetch(tmtd)
          if (a) {
            await a.delete()
	    db.delete(`wolvesKill_${message.author.id}`)
            return
          }
        } else {
          return message.channel.send("If you didn't vote, how am i suppose to cancel your vote")
        }
      }


      if (voted == message.member) return message.channel.send("Bruh, you are a wolf, not a fool")
      if (!voted.roles.cache.has(alive.id))
        return message.channel.send("You can't vote a dead player!");
      

        if (db.get(`role_${message.author.id}`) == "Wolf Seer") {
          if (db.get(`resigned_${message.channel.id}`) != true) {
            for (let j = 1 ; j <= alive.members.size + dead.members.size ; j++) {
              let tempguy = message.guild.members.cache.find(m => m.nickname === j.toString())
              if (tempguy) {
                if (tempguy.roles.cache.has(alive.id)) {
                  if (db.get(`role_${tempguy}`).toLowerCase().includes("wolf")) {
                    return message.channel.send("You need to resign or be the last wolf alive in order to vote dummy")
                  }
                }
              }
            }
          }
        }
      if (db.get(`role_${voted.id}`).toLowerCase().includes("wolf"))
        return message.channel.send("Voting your teammates causes gamethrowing you know");
      
      let bv = db.get(`wwkillmsg_${message.channel.id}`)
      if (bv) {
        let thems = await wwchat.messages.fetch(bv).catch(e => console.log(e.message))
        if (thems) {
          await thems.delete()
        }
      }
      let vb = await wwchat.send(`${message.member.nickname} voted ${args[0]}`);
      let mid = vb.id
      db.set(`wwkillmsg_${message.channel.id}`, mid)
      db.set(`wolvesKill_${message.author.id}`, voted.nickname)


      
    }
    if (commandEnabled == "yes") {
      if (!message.channel.name.includes("priv")) {
        return;
      } else {
        if (message.channel.name == "priv-idiot") {
          let killed = await db.fetch(`idiot_${message.channel.id}`);
          if (killed == "yes")
            return await message.channel.send(
              "You idiot! You were lynched and now can't vote. Bohoo. Go tell your mommy."
            );
        }
        let votedGuy = message.guild.members.cache.find(
          m => m.nickname === args[0]
        );
        let voteChat = message.guild.channels.cache.find(
          c => c.name === "vote-chat"
        );
        if (args[0] == "cancel") {
          let bruh = db.get(`votemsgid_${message.channel.id}`)
          if (bruh) {
            let godei = await voteChat.messages.fetch(bruh)
            if (godei) {
              await godei.delete()
	      return;
            }
          }
        }
        if (
          !votedGuy ||
          votedGuy.roles.cache.has(dead.id) ||
          votedGuy == message.member
        ) {
          return await message.reply(`Target does not exist!`);
        } else if (
          !votedGuy.roles.cache.has("606140092213624859") ||
          !message.member.roles.cache.has("606140092213624859")
        ) {
          return await message.reply(
            `I know I'm just a bot but I know that you or the player you are trying to vote is dead. Get a life and stop breaking me dude!`
          );
        } else {
          let voteChat = message.guild.channels.cache.find(
            c => c.name === "vote-chat"
          );
         
          //voteChat.send(`${message.member.nickname} voted ${args[0]}`);
          let voted = message.guild.members.cache.find(
            m => m.nickname === args[0]
          );
          let votes = ["0"];
          if (args[0] == message.member.nickname) {
            return message.reply(
              `Trying to win as fool by voting yourself won't get you anywhere. Get a life dude.`
            );
          } else {
            let voted = db.get(`votemsgid_${message.channel.id}`)
            if (voted) {
              let tmestodel = await voteChat.messages.fetch(voted).catch(e => console.log(e.message))
              if (tmestodel) {
                await tmestodel.delete()
              }
            }
            let omg = await voteChat.send(`${message.member.nickname} voted ${args[0]}`);
            votes.push(args[0])
            db.set(`vote_${message.author.id}`, args[0]);
            db.set(`votemsgid_${message.channel.id}`, omg.id)
          }
        }
      }
    }
  }
};
