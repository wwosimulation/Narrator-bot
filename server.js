const http = require("http");
const express = require("express");
const app = express();
require("dotenv").config()
//69 - 5)3)79'6gabidhsnzoz
app.use(express.static("public"));

app.get("/", function(request, response) {
 response.sendFile(__dirname + "/views/index.html");
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`https://werewolf-discord.ashishemmanuel.repl.co`);
}, 2147483647);

//fs for writeFile()
const fs = require("fs");

//quick.db for gameroles
const db = require("quick.db");

//discord.js
const Discord = require("discord.js");

//tictactoe
const TicTacToe = require('discord-tictactoe');

// DanBot hosting to make the bot online 24/7
let yyyy
//Bot client
const client = new Discord.Client();

//Prefix and token from config file
const prefix = process.env.PREFIX
const token = process.env.TOKEN

//Cooldown
const cooldowns = new Discord.Collection();

//Databases
//let economy = require("./economy.json");

//Sync with commands folder


client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command);
}

//Music queue for all servers
var musicServers = {};

//Bot on startup
client.on("ready", async () => {
  client.user.setActivity("Werewolf Online!");
  console.log("Connected!");
  const { Slash } = require("discord-slash-commands")
  const slash = new Slash(client)
  slash.command({
    guildOnly: false,
    data: {
      name: "3061LRTAGSPKJMORMRT",
      description: "Gets free coins!",
      type: 4,
      content: `Benda noob.`
    }
  })
    slash.command({
      guildOnly: false,
      data: {
        name: "ping",
        description: "3061LRTAGSPKJMORMRT RULES! ASHISH IS DA BEST! This is a ping command!",
        type: 4,
        content: `Ping! ${client.ws.ping} ms.`
      }
    })
    
});

//Bot updating roles
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (newMember.guild.id == "472261911526768642") { 
      if (newMember.roles.cache.has("606131202814115882")) { // new member having dead role
        if (newMember.roles.cache.has("606140092213624859")) return
       
        // canceling frenzy
        if (db.get(`role_${newMember.id}`) == "Werewolf Berserk") {
          let wwb = newMember.guild.channels.cache.filter(c => c.name === "priv-werewolf-berserk").keyArray("id")
          for (let a = 0 ; a < wwb.length ; a++) {
            let chan = newMember.guild.channels.cache.get(wwb[a])
            if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
              if (db.get(`frenzy_${chan.id}`) == true) {
                 db.set(`frenzy_${chan.id}`, false)
                 newMember.guild.channels.cache.find(c => c.name === "werewolves-chat").send("<:frenzy:744573088204718412> The frenzy has stopped because the Werewolf Berserk has died!")
              }
            }
          }
        }

        // grave robber
       let alive = newMember.guild.roles.cache.find(r => r.name === "Alive")
       let graverobbers = newMember.guild.channels.cache.filter(c => c.name === "priv-grave-robber").keyArray("id")
       for (let a = 0 ; a < graverobbers.length ; a++) {
          let chan = newMember.guild.channels.cache.get(graverobbers[a])
          if (db.get(`target_${chan.id}`) == newMember.nickname) {
             let role = db.get(`role_${newMember.id}`)
             let invalidroles = ["Jailer", "Doppelganger", "Cupid", "President", "Sect Leader"]
             if (invalidroles.includes(role)) {
                chan.send(`You could not rob the role from **${newMember.nickname} ${newMember.user.username}** because they were the **${role}**!`)
             } else {
                let guy
                for (let b = 1 ; b < 17 ; b++) {
                   let um = newMember.guild.members.cache.find(m => m.nickname === b.toString())
                   if (um) {
                      if (um.roles.cache.has(alive.id)) {
                         if (chan.permissionsFor(um).has(["VIEW_CHANNEL"])) {
                            guy = um
                            b = 99
                         }
                      }
                   }
                }
                if (guy) {
                   let abc = await newMember.guild.channels.create(`priv-${role.toLowerCase().replace(" ", "-")}`, {
                      parent: "748959630520090626",
                      permissionOverwrites: [
                        {
                          id: guy.id,
                          allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }, 
                        {
                          id: newMember.guild.id,
                          deny: ["VIEW_CHANNEL"]
                        },
                        {
                          id: '606139219395608603',
                          allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"]
                        },
                        {
                          id: "606276949689499648",
                          allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"]
                        }
                      ]
                   })
                   await abc.send(db.get(`roleinfo_${role.toLowerCase()}`))
                   let t = await abc.send(alive)
                   await t.delete({timeout: 5000})
                   chan.updateOverwrite(guy.id, {VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false, SEND_MESSAGES: false})
                   await t.send(`You have stolen the role from **${newMember.nickname} ${newMember.user.username}**!`)
                   db.set(`role_${guy.id}`, role)
                   if (role.toLowerCase().includes("wolf")) {
                     newMember.guild.channels.cache.find(c => c.name === "werewolves-chat").updateOverwrite(guy.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true})
                   }
                } 
             }
          }
       }
        // jww tag
        if (db.get(`role_${newMember.id}`) == "Junior Werewolf") {
          let jww = newMember.guild.channels.cache.filter(c => c.name === "priv-junior-werewolf").keyArray("id")
          for (let a = 0 ; a < jww.length ; a++) {
            let chan = newMember.guild.channels.cache.get(jww[a])
            if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
              a = 99
              let tag = db.get(`jwwtag_${oldMember.id}`)
              console.log("heyyy")
              console.log(tag)
              let guy = newMember.guild.members.cache.find(m => m.nickname === tag)
              if (guy.roles.cache.has("606140092213624859") && newMember.roles.cache.has("606131202814115882")) {
                await newMember.guild.channels.cache.find(c => c.name === "day-chat").send(`<:revenge:744572531889012756> The Junior Werewolf's death has been avenged! **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** is dead!`)
                await guy.roles.add("606131202814115882")
                await guy.roles.remove('606140092213624859')
              }
            }
          }
        }

        // avenger tag
        if (db.get(`role_${newMember.id}`) == "Avenger") {
          let jww = newMember.guild.channels.cache.filter(c => c.name === "priv-avenger").keyArray("id")
          for (let a = 0 ; a < jww.length ; a++) {
            let chan = newMember.guild.channels.cache.get(jww[a])
            if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
              let tag = db.get(`atag_${oldMember.id}`)
              let guy = newMember.guild.members.cache.find(m => m.nickname === tag)
              if (guy.roles.cache.has("606140092213624859")) {
                newMember.guild.channels.cache.find(c => c.name === "day-chat").send(`<:avenge:744536638314774558> The Avenger avenged **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
                guy.roles.add("606131202814115882")
                guy.roles.remove('606140092213624859')
              }
            }
          }
        }

        // loudmouth
        if (db.get(`role_${newMember.id}`) == "Loudmouth") {
          let jww = newMember.guild.channels.cache.filter(c => c.name === "priv-loudmouth").keyArray("id")
          for (let a = 0 ; a < jww.length ; a++) {
            let chan = newMember.guild.channels.cache.get(jww[a])
            if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
              let tag = db.get(`mouth_${oldMember.id}`)
              let guy = newMember.guild.members.cache.find(m => m.nickname === tag)
              if (guy.roles.cache.has("606140092213624859")) {
                newMember.guild.channels.cache.find(c => c.name === "day-chat").send(`<:loudmouthed:744571429282119770> The Loudmouth's last will was to reveal **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
              }
            }
          }
        }

        // doppelganger
        let dp = newMember.guild.channels.cache.filter(c => c.name === "priv-doppelganger").keyArray("id")
        for (let a = 0 ; a < dp.length ; a++) {
          let chan = newMember.guild.channels.cache.get(dp[a])
          console.log("worked")
          if (db.get(`copy_${chan.id}`) == oldMember.nickname) {
            console.log("Worked 2")
            let role = db.get(`role_${newMember.id}`)
            console.log(role)
            let guy 
            for (let b = 1 ; b < 17 ; b++) {
              let toGuy = newMember.guild.members.cache.find(m => m.nickname === b.toString())
              //console.log(toGuy.nickname)
              if (toGuy) {
                if (toGuy.roles.cache.has("606140092213624859")) {
                  if (chan.permissionsFor(toGuy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    guy = toGuy
                    let ff = await newMember.guild.channels.create(`priv-${role.toLowerCase().replace(" ", "-")}`, {
                      parent: "748959630520090626",
                      permissionOverwrites: [
                        {
                          id: guy.id,
                          allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                        }, 
                        {
                          id: newMember.guild.id,
                          deny: ["VIEW_CHANNEL"]
                        },
                        {
                          id: '606139219395608603',
                          allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"]
                        },
                        {
                          id: "606276949689499648",
                          allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"]
                        }
                      ]
                    })
                    db.set(`role_${guy.id}`, role)
                    chan.updateOverwrite(guy.id, {
                      VIEW_CHANNEL: false,
                      READ_MESSAGE_HISTORY: false,
                      SEND_MESSAGES: false
                    })
                    await ff.send(`${db.get(`roleinfo_${role.toLowerCase()}`)}`)
                    await ff.send(`_ _\n\n_ _\n\n${guy}\n\nThe Player you selected to copy has died! You have taken over their role and your new role is: **${role}**!`)
                  }
                }
              }
            }
            
            
          }
        }

        // sect leader
        if (db.get(`role_${newMember.id}`) == "Sect Leader") {
          let sectMember = newMember.guild.channels.cache.find(c => c.name === "sect-members")
          for (let b = 1 ; b < 17 ; b++) {
            let guy = newMember.guild.members.cache.find(m => m.nickname === b.toString())
            if (guy) {
              if (guy.roles.cache.has("606140092213624859")) {
                if (sectMember.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                  newMember.guild.channels.cache.find(c => c.name === "day-chat").send(`<:sect_member:774556759523590154> Sect Member **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** commited suicide!`)
                  guy.roles.add("606131202814115882")
                  guy.roles.remove("606140092213624859")
                  sectMember.updateOverwrite(guy.id, {VIEW_CHANNEL: false})
                }
              }
            }
          }
        }
       
       // if someone from the sect dies
       let sectMember = newMember.guild.channels.cache.find(c => c.name === "sect-members")
       if (sectMember.permissionsFor(newMember).has(["VIEW_CHANNEL"])) {
          sectMember.updateOverwrite(newMember.id, {VIEW_CHANNEL: false})
       }


        // seer apprentice
        if (db.get(`role_${newMember.id}`) == "Seer") {
          for (let a = 1 ; a < 17 ; a++) {
            let guy = newMember.guild.members.cache.find(m => m.nickname === a.toString())
            if (guy) {
              if (guy.roles.cache.has("606140092213624859")) {
                if (db.get(`role_${guy.id}`) == "Seer Apprentice") {
                  a = 99
                  let ff = await newMember.guild.channels.create("priv-seer", {
                    parent: "748959630520090626", 
                    permissionOverwrites: [
                      {
                        id: guy.id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                      }, 
                      {
                        id: newMember.guild.id,
                        deny: ["VIEW_CHANNEL"]
                      },
                      {
                        id: '606139219395608603',
                        allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"]
                      },
                      {
                        id: "606276949689499648",
                        allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"]
                      }
                    ]
                  })
                  let seerapp = newMember.guild.channels.cache.filter(c => c.name === "priv-seer-apprentice").keyArray("id")
                  for (let b = 0 ; b < seerapp.length ; b++) {
                    let chan = newMember.guild.channels.cache.get(seerapp[b])
                    if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                      chan.updateOverwrite(guy.id, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false, 
                        READ_MESSAGE_HISTORY: false
                      })
                    }
                  }
                  await ff.send(`${db.get(`roleinfo_Seer`)}\n\n_ _\n${guy}\n\n_ _`)
                  await ff.send(`_ _\nSince the Seer has died, you have become the new Seer!`)
                  db.set(`role_${guy.id}`, "Seer")
                }
              }
            }
          }
        }

        // mad scientist
        if (db.get(`role_${newMember.id}`) == "Mad Scientist") {
          let guild = newMember.guild
          let alive = guild.roles.cache.find(r => r.name === "Alive")
          let dead = guild.roles.cache.find(r => r.name === "Dead")
          let found1 = false
          let found2 = false
          let guy1 
          let guy2
          let thenick = newMember.nickname
          while (found1 == false) {
            let guy = guild.members.cache.find(m => m.nickname === (parseInt(thenick)-1).toString())
            if (!guy) {
              thenick = alive.members.size + dead.members.size + 1
            } else if (newMember.nickname == guy.nickname) {
              found1 = "None"
            } else {
              
              if (guy.roles.cache.has(alive.id)) {
                found1 = true
                guy1 = guy
              } else {
                thenick = thenick - 1
              }
            }
          }
          thenick = newMember.nickname
          while (found2 == false) {
            let guy = guild.members.cache.find(m => m.nickname === (parseInt(thenick)+1).toString())
            if (!guy) {
              thenick = 0
            } else if (newMember.nickname == guy.nickname) {
              found2 = "None"
            } else {
              if (guy.roles.cache.has(alive.id)) {
                found2 = true
                guy2 = guy
              } else {
                thenick = thenick + 1
              }
            }
          }
          if (found1 != "None") {
            guild.channels.cache.find(c => c.name === "day-chat").send(`<:toxic:787676985106890752> The Mad Scientist's toxic was exposed and killed **${guy1.nickname} ${guy1.user.username} (${db.get(`role_${guy1.id}`)})**!`)
            guy1.roles.add(dead.id)
            guy1.roles.remove(alive.id)
          }
          if (found2 != "None") {
            guild.channels.cache.find(c => c.name === "day-chat").send(`<:toxic:787676985106890752> The Mad Scientist's toxic was exposed and killed **${guy2.nickname} ${guy2.user.username} (${db.get(`role_${guy2.id}`)})**!`)
            guy2.roles.add(dead.id)
            guy2.roles.remove(alive.id)
          }
        }

        // red lady
        let rl = newMember.guild.channels.cache.filter(c => c.name === "priv-red-lady").keyArray("id")
        let dead = newMember.guild.roles.cache.find(r => r.name === "Dead").id
        for (let a = 0 ; a < rl.length ; a++) {
          let chan = newMember.guild.channels.cache.get(rl[a])
          //console.log(newMember.nickname + " rl")
          //console.log(db.get(`visit_${chan.id}`))
          if (db.get(`visit_${chan.id}`) == newMember.nickname) {
            for (let b = 1 ; b < 17 ; b++) {
              let guy = newMember.guild.members.cache.find(m => m.nickname === b.toString())
              if (guy) {
                if (guy.roles.cache.has(alive.id)) {
                  if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                   newMember.guild.channels.cache.find(c => c.name === "day-chat").send(`**${guy.nickname} ${guy.user.username} (Red Lady)** visited someone who was attacked and was killed!`)
                    guy.roles.add(dead)
                    guy.roles.remove(alive.id)
                }
              }
              }
            }
          }
        }

        // couple 
        let cupid = newMember.guild.channels.cache.find(c => c.name === "lovers")
        if (cupid.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          for (let a = 1 ; a <= 17 ; a++) {
            let guy = newMember.guild.members.cache.find(m => m.nickname === a.toString())
            if (guy) {
              if (cupid.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (guy != newMember) {
                  if (guy.roles.cache.has(alive.id)) {
                    newMember.guild.channels.cache.find(c => c.name === "day-chat").send(`<:couple:744542381206143026> Player **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** lost the love of their live and commited suicide!`)
                    guy.roles.add(dead)
                    guy.roles.remove(alive.id)
                  }
                }
              } 
            }
          }
        }
      }
  }
})
//When receiving a message
client.on("message", message => {
  function yaises(x) {
    client.commands.get(x).run(message)
  }
  
  //let guy = message.member.nickname;
 if (message.author.bot) return; //Ignore bots and dms 
  // blacklists
  let blacklists = db.get(`blacklistss`) || []
  //console.log(blacklists)
  if (message.channel.type != "dm") {
  if (
    message.guild.id == "472261911526768642" &&
    message.channel.name == "day-chat"
  ) {
    if (message.content.includes("#priv") || message.content.includes("<#")) {
      message.delete();
      message.channel.send(
        `${message.author} This is a warning! Do not mention your channel!`
      );
    }
  }
  if (
    (message.content.includes("fuck") || message.content.includes("fúck")) &&
    (message.channel.name == "enter-game" ||
      message.channel.name == "player-commands")
  ) {
    message.member.addRole("607926461726457879");
    message.delete();
    message.reply("WATCH YOUR LANG! ");
    let ch = message.guild.channels.find(m => m.name === "game-lobby");
    ch.overwritePermissions(message.author.id, { SEND_MESSAGES: false });
  }
  if (message.content == "-pls snipe") {
    message.delete();
    message.channel.send(`We're no strangers to love
You know the rules and so do I
A full commitment's what I'm thinking of
You wouldn't get this from any other guy

I just wanna tell you how I'm feeling
Gotta make you understand
`);
  }

  if (
    message.guild.id == "472261911526768642" &&
    message.channel.name == "day-chat" &&
    message.member.roles.cache.has("606140092213624859") &&
    message.content.length > 140
  ) {
    message.delete();
    return message.channel.send(
      "Maximum length for messages are 140 characters!"
    );
  }
  if (
    message.guild.id == "472261911526768642" &&
    message.channel.name == "day-chat" &&
    message.member.roles.cache.has("606140092213624859") &&
    message.content.includes("\n")
  ) {
    message.delete();
    return message.channel.send(
      "No, sending more than one line is prohibited!"
    );
  } }

  //If user mentions bot
  if (message.content === "<@!549402544066002955>")
    return message.author.send(
      `Hey! My prefix is ${prefix}, you can ask for \`${prefix}help\` if you ever need.`
    );

  //Check if message doesn't start with prefix
  //if (!message.content.startsWith(prefix)) return;


  
  if (!message.content.startsWith(prefix)) return 
  if (blacklists.includes(`/${message.author.id}/`) && message.author.id != "552814709963751425") return message.channel.send("Blacklisted users can't use any command!")

  //Out of game commands
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  yyyy = commandName  
  const command =
    client.commands.get(commandName) || //DO NOT PUT ;
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return; //If such command doesn't exist, ignore it

  //Ignore guild-only commands inside DMs
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command in DMs!");
  }

  //Check if that command needs arguments


  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  //Check if command is in cooldown
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 0) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${Math.ceil(
          timeLeft.toFixed(1)
        )} more seconds before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //Execute command if everything is ok
  try {
    client.channels.cache.get("783013534560419880").send("Command ran: " + yyyy + `\nAuthor: ${message.author.tag} (${message.author.id})`)
    command.run(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("Something went wrong...");
  }
});

client.login(token);
