require("dotenv").config()
const fs = require("fs")
const db = require("quick.db")
const Discord = require("discord.js")

const { APIMessage, Structures } = require("discord.js");

class Message extends Structures.get("Message") {
    async inlineReply(content, options) {
        const mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : ((options || content).allowedMentions).repliedUser;
        delete ((options || content || {}).allowedMentions || {}).repliedUser;

        const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData();
        Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });
    
        if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0)
            apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] };
        if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
            Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });

        if (Array.isArray(apiMessage.data.content)) {
            return Promise.all(apiMessage.split().map(x => {
                x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                return x;
            }).map(this.inlineReply.bind(this)));
        }

        const { data, files } = await apiMessage.resolveFiles();
        return this.client.api.channels[this.channel.id].messages
            .post({ data, files })
            .then(d => this.client.actions.MessageCreate.handle(d).message);
    }
}

Structures.extend("Message", () => Message);

const client = new Discord.Client({ws: {intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS", "GUILD_PRESENCES"]}})
const bot = new Discord.Client()

//Prefix and token from config file
const prefix = process.env.PREFIX
const token = process.env.TOKEN

// Slash commands
require("./slash.js")(client)


//ShadowAdmin
//const shadowadmin = require("shadowadmin")

//Cooldown
const cooldowns = new Discord.Collection()

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.botAdmin = (id) => {
  if(["439223656200273932", "406412325973786624"].includes(id)) return true
  return false
}


client.paginator = async (author, msg, embeds, pageNow, addReactions = true) => {
  if(embeds.length === 1) return
  if (addReactions) {
    await msg.react("⏪")
    await msg.react("◀")
    await msg.react("▶")
    await msg.react("⏩")
  }
  let reaction = await msg.awaitReactions((reaction, user) => user.id == author && ["◀","▶","⏪","⏩"].includes(reaction.emoji.name), {time: 30*1000, max:1, errors: ['time']}).catch(() => {})
  if (!reaction) return msg.reactions.removeAll().catch(() => {})
  reaction = reaction.first()
  //console.log(msg.member.users.tag)
  if (msg.channel.type == 'dm' || !msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
    if (reaction.emoji.name == "◀") {
      let m = await msg.channel.send(embeds[Math.max(pageNow-1, 0)])
      msg.delete()
      client.paginator(author, m, embeds, Math.max(pageNow-1, 0))
    } else if (reaction.emoji.name == "▶") {
      let m = await msg.channel.send(embeds[Math.min(pageNow+1, embeds.length-1)])
      msg.delete()
      client.paginator(author, m, embeds, Math.min(pageNow+1, embeds.length-1))
    } else if (reaction.emoji.name == "⏪") {
      let m = await msg.channel.send(embeds[0])
      msg.delete()
      client.paginator(author, m, embeds, 0)
    } else if (reaction.emoji.name == "⏩") {
      let m = await msg.channel.send(embeds[embeds.length-1])
      msg.delete()
      client.paginator(author, m, embeds, embeds.length-1)
    }
  }
  else {
    if (reaction.emoji.name == "◀") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[Math.max(pageNow-1, 0)])
      client.paginator(author, m, embeds, Math.max(pageNow-1, 0), false)
    } else if (reaction.emoji.name == "▶") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[Math.min(pageNow+1, embeds.length-1)])
      client.paginator(author, m, embeds, Math.min(pageNow+1, embeds.length-1), false)
    } else if (reaction.emoji.name == "⏪") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[0])
      client.paginator(author, m, embeds, 0, false)
    } else if (reaction.emoji.name == "⏩") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[embeds.length-1])
      client.paginator(author, m, embeds, embeds.length-1, false)
    }
  }
}

//Bot on startup
client.on("ready", async () => {
  client.config = {}
  client.user.setActivity("Werewolf Online!")
  console.log("Connected!")
  //ShadowAdmin initialize
  //shadowadmin.init(client, {prefix, owners: ["552814709963751425", "439223656200273932"]})
})

client.on("messageReactionAdd", async (reaction, user) => {
	console.log("Ticket close 1")
	if (reaction.message.channel.name.startsWith("ticket-") && reaction.message.channel.parentID == "606230513103142932") {
		console.log("Ticket close 2")
		if (reaction.emoji.name == "🔒") {
			console.log("Ticket close 3")
			if (reaction.message.author.id == client.user.id) {
				console.log("Ticket close 4")
				if (reaction.message.embeds[0].title.startsWith("Ticket")) {
					console.log("Ticket close 5")
					let t = await reaction.message.channel.send("You are about to close the ticket. Confirm?")
					await t.react("✅")
					const collector = t.createReactionCollector(true, {time: 30000, max: 1})
					collector.on("collect", async (react, us) => {
						if (react.emoji.name == "✅") {
							console.log("Ticket close 6")
							await reaction.channel.delete()
						}
					})
					collector.on("end", async (collected, reason) => {
						if (reason == "time") {
							reaction.channel.send("This action has been canceled!")
						}
					})
				}
			}
		}
	}
})




//Bot updating roles
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (newMember.guild.id == "472261911526768642") {
    console.log("Someone died or just did -narrate")
    if (newMember.roles.cache.has("606131202814115882") && oldMember.roles.cache.has("606131202814115882")) return
    console.log("Someone doesn't has dead role twice")
    if (!newMember.roles.cache.has("606131202814115882")) return
    console.log("They do have dead role")
    console.log("It works!")
    newMember.roles.remove("822806480099999774")
    // canceling frenzy
    if (db.get(`role_${newMember.id}`) == "Werewolf Berserk") {
      let wwb = newMember.guild.channels.cache.filter((c) => c.name === "priv-werewolf-berserk").keyArray("id")
      for (let a = 0; a < wwb.length; a++) {
        let chan = newMember.guild.channels.cache.get(wwb[a])
        if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          if (db.get(`frenzy_${chan.id}`) == true) {
            db.set(`frenzy_${chan.id}`, false)
            newMember.guild.channels.cache.find((c) => c.name === "werewolves-chat").send("<:frenzy:744573088204718412> The frenzy has stopped because the Werewolf Berserk has died!")
          }
        }
      }
    }

    // grave robber
    let alive = newMember.guild.roles.cache.find((r) => r.name === "Alive")
    let graverobbers = newMember.guild.channels.cache.filter((c) => c.name === "priv-grave-robber").keyArray("id")
    for (let a = 0; a < graverobbers.length; a++) {
      let chan = newMember.guild.channels.cache.get(graverobbers[a])
      if (db.get(`target_${chan.id}`) == newMember.nickname) {
        let role = db.get(`role_${newMember.id}`)
        let invalidroles = ["Jailer", "Doppelganger", "Cupid", "President", "Sect Leader"]
        if (invalidroles.includes(role)) {
          chan.send(`You could not rob the role from **${newMember.nickname} ${newMember.user.username}** because they were the **${role}**!`)
        } else {
          let guy
          for (let b = 1; b < 17; b++) {
            let um = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
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
                  allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                  id: newMember.guild.id,
                  deny: ["VIEW_CHANNEL"],
                },
                {
                  id: "606139219395608603",
                  allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                },
                {
                  id: "606276949689499648",
                  allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                },
              ],
            })
            await abc.send(db.get(`roleinfo_${role.toLowerCase()}`))
            let t = await abc.send(alive)
            await t.delete({ timeout: 5000 })
            chan.updateOverwrite(guy.id, { VIEW_CHANNEL: false, READ_MESSAGE_HISTORY: false, SEND_MESSAGES: false })
            await t.send(`You have stolen the role from **${newMember.nickname} ${newMember.user.username}**!`)
            db.set(`role_${guy.id}`, role)
            if (role.toLowerCase().includes("wolf")) {
              newMember.guild.channels.cache.find((c) => c.name === "werewolves-chat").updateOverwrite(guy.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true })
            }
          }
        }
      }
    }
    // jww tag
    if (db.get(`role_${newMember.id}`) == "Junior Werewolf") {
      let jww = newMember.guild.channels.cache.filter((c) => c.name === "priv-junior-werewolf").keyArray("id")
      for (let a = 0; a < jww.length; a++) {
        let chan = newMember.guild.channels.cache.get(jww[a])
        if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          a = 99
          let tag = db.get(`jwwtag_${oldMember.id}`)
          console.log("heyyy")
          console.log(tag)
          let guy = newMember.guild.members.cache.find((m) => m.nickname === tag)
          if (guy.roles.cache.has("606140092213624859") && newMember.roles.cache.has("606131202814115882")) {
            await newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`<:revenge:744572531889012756> The Junior Werewolf's death has been avenged! **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** is dead!`)
            await guy.roles.add("606131202814115882")
            await guy.roles.remove("606140092213624859")
          }
        }
      }
    }

    // avenger tag
    if (db.get(`role_${newMember.id}`) == "Avenger") {
      let jww = newMember.guild.channels.cache.filter((c) => c.name === "priv-avenger").keyArray("id")
      for (let a = 0; a < jww.length; a++) {
        let chan = newMember.guild.channels.cache.get(jww[a])
        if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          let tag = db.get(`atag_${oldMember.id}`)
          let guy = newMember.guild.members.cache.find((m) => m.nickname === tag)
          if (guy.roles.cache.has("606140092213624859")) {
            newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`<:avenge:744536638314774558> The Avenger avenged **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
            guy.roles.add("606131202814115882")
            guy.roles.remove("606140092213624859")
          }
        }
      }
    }

    // loudmouth
    if (db.get(`role_${newMember.id}`) == "Loudmouth") {
      let jww = newMember.guild.channels.cache.filter((c) => c.name === "priv-loudmouth").keyArray("id")
      for (let a = 0; a < jww.length; a++) {
        let chan = newMember.guild.channels.cache.get(jww[a])
        if (chan.permissionsFor(newMember.id).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          let tag = db.get(`mouth_${oldMember.id}`)
          let guy = newMember.guild.members.cache.find((m) => m.nickname === tag)
          if (guy.roles.cache.has("606140092213624859")) {
            newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`<:loudmouthed:744571429282119770> The Loudmouth's last will was to reveal **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})**!`)
            guy.roles.add("822806480099999774")
          }
        }
      }
    }

    // doppelganger
    let dp = newMember.guild.channels.cache.filter((c) => c.name === "priv-doppelganger").keyArray("id")
    for (let a = 0; a < dp.length; a++) {
      let chan = newMember.guild.channels.cache.get(dp[a])
      console.log("worked")
      if (db.get(`copy_${chan.id}`) == oldMember.nickname) {
        console.log("Worked 2")
        let role = db.get(`role_${newMember.id}`)
        console.log(role)
        let guy
        for (let b = 1; b < 17; b++) {
          let toGuy = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
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
                      allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                    },
                    {
                      id: newMember.guild.id,
                      deny: ["VIEW_CHANNEL"],
                    },
                    {
                      id: "606139219395608603",
                      allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                    },
                    {
                      id: "606276949689499648",
                      allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                    },
                  ],
                })
                db.set(`role_${guy.id}`, role)
                chan.updateOverwrite(guy.id, {
                  VIEW_CHANNEL: false,
                  READ_MESSAGE_HISTORY: false,
                  SEND_MESSAGES: false,
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
      let sectMember = newMember.guild.channels.cache.find((c) => c.name === "sect-members")
      for (let b = 1; b < 17; b++) {
        let guy = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
        if (guy) {
          if (guy.roles.cache.has("606140092213624859")) {
            if (sectMember.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
              newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`<:sect_member:774556759523590154> Sect Member **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** commited suicide!`)
              guy.roles.add("606131202814115882")
              guy.roles.remove("606140092213624859")
              sectMember.updateOverwrite(guy.id, { VIEW_CHANNEL: false })
            }
          }
        }
      }
    }

    // if someone from the sect dies
    let sectMember = newMember.guild.channels.cache.find((c) => c.name === "sect-members")
    if (sectMember.permissionsFor(newMember).has(["VIEW_CHANNEL"])) {
      sectMember.updateOverwrite(newMember.id, { VIEW_CHANNEL: false })
    }

    // seer apprentice
    if (db.get(`role_${newMember.id}`) == "Seer") {
      for (let a = 1; a < 17; a++) {
        let guy = newMember.guild.members.cache.find((m) => m.nickname === a.toString())
        if (guy) {
          if (guy.roles.cache.has("606140092213624859")) {
            if (db.get(`role_${guy.id}`) == "Seer Apprentice") {
              a = 99
              let ff = await newMember.guild.channels.create("priv-seer", {
                parent: "748959630520090626",
                permissionOverwrites: [
                  {
                    id: guy.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                  },
                  {
                    id: newMember.guild.id,
                    deny: ["VIEW_CHANNEL"],
                  },
                  {
                    id: "606139219395608603",
                    allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                  },
                  {
                    id: "606276949689499648",
                    allow: ["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS", "ATTACH_FILES", "ADD_REACTIONS", "EMBED_LINKS"],
                  },
                ],
              })
              let seerapp = newMember.guild.channels.cache.filter((c) => c.name === "priv-seer-apprentice").keyArray("id")
              for (let b = 0; b < seerapp.length; b++) {
                let chan = newMember.guild.channels.cache.get(seerapp[b])
                if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                  chan.updateOverwrite(guy.id, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false,
                    READ_MESSAGE_HISTORY: false,
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
      let alive = guild.roles.cache.find((r) => r.name === "Alive")
      let dead = guild.roles.cache.find((r) => r.name === "Dead")
      let found1 = false
      let found2 = false
      let guy1
      let guy2
      let thenick = newMember.nickname
      while (found1 == false) {
        let guy = guild.members.cache.find((m) => m.nickname === (parseInt(thenick) - 1).toString())
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
        let guy = guild.members.cache.find((m) => m.nickname === (parseInt(thenick) + 1).toString())
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
        guild.channels.cache.find((c) => c.name === "day-chat").send(`<:toxic:787676985106890752> The Mad Scientist's toxic was exposed and killed **${guy1.nickname} ${guy1.user.username} (${db.get(`role_${guy1.id}`)})**!`)
        guy1.roles.add(dead.id)
        guy1.roles.remove(alive.id)
      }
      if (found2 != "None") {
        guild.channels.cache.find((c) => c.name === "day-chat").send(`<:toxic:787676985106890752> The Mad Scientist's toxic was exposed and killed **${guy2.nickname} ${guy2.user.username} (${db.get(`role_${guy2.id}`)})**!`)
        guy2.roles.add(dead.id)
        guy2.roles.remove(alive.id)
      }
    }

    // red lady
    let rl = newMember.guild.channels.cache.filter((c) => c.name === "priv-red-lady").keyArray("id")
    let dead = newMember.guild.roles.cache.find((r) => r.name === "Dead").id
    for (let a = 0; a < rl.length; a++) {
      let chan = newMember.guild.channels.cache.get(rl[a])
      //console.log(newMember.nickname + " rl")
      //console.log(db.get(`visit_${chan.id}`))
      if (db.get(`visit_${chan.id}`) == newMember.nickname) {
        for (let b = 1; b < 17; b++) {
          let guy = newMember.guild.members.cache.find((m) => m.nickname === b.toString())
          if (guy) {
            if (guy.roles.cache.has(alive.id)) {
              if (chan.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`**${guy.nickname} ${guy.user.username} (Red Lady)** visited someone who was attacked and was killed!`)
                guy.roles.add(dead)
                guy.roles.remove(alive.id)
              }
            }
          }
        }
      }
    }

    // couple
    let cupid = newMember.guild.channels.cache.find((c) => c.name === "lovers")
    if (cupid.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
      for (let a = 1; a <= 17; a++) {
        let guy = newMember.guild.members.cache.find((m) => m.nickname === a.toString())
        if (guy) {
          if (cupid.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
            if (guy != newMember) {
              if (guy.roles.cache.has(alive.id)) {
                newMember.guild.channels.cache.find((c) => c.name === "day-chat").send(`<:couple:744542381206143026> Player **${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})** lost the love of their live and commited suicide!`)
                guy.roles.add(dead)
                guy.roles.remove(alive.id)
              }
            }
          }
        }
      }
    }

    // disabling everythihng
    let role = db.get(`role_${newMember.id}`) || "None"
    let allchannels = newMember.guild.channels.cache.filter((c) => c.name === `priv-${role.toLowerCase().replace(" ", "-")}`).keyArray("id")
    for (let a = 0; a < allchannels.length; a++) {
      let chan = newMember.guild.channels.cache.get(allchannels[a])
      if (chan) {
        if (chan.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          if (role == "Doctor") {
            db.set(`heal_${chan.id}`, null)
          } else if (role == "Bodyguard") {
            db.set(`guard_${chan.id}`, null)
          } else if (role == "Witch") {
            db.set(`potion_${chan.id}`, null)
          } else if (role == "Tough Guy") {
            db.set(`tough_${chan.id}`, null)
          } else if (role == "Beast Hunter") {
            db.set(`setTrap_${chan.id}`, null)
            db.set(`trapActive_${chan.id}`, false)
          } else if (role == "Bandit") {
            db.set(`bandit_${chan.id}`, null)
            let allbandits = newMember.guild.channels.cache.filter((c) => c.name === "bandits")
            allbandits.forEach((e) => {
              if (e.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                db.set(`banditKill_${e.id}`, null)
              }
            })
          } else if (role == "Accomplice") {
            let allbandits = newMember.guild.channels.cache.filter((c) => c.name === "bandits")
            allbandits.forEach((e) => {
              if (e.permissionsFor(newMember).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                db.set(`accomplice_${e.id}`, null)
              }
            })
            alive.members.forEach((e) => {
              if (db.get(`role_${e.id}`) == "Bandit") {
                allbandits.forEach((m) => {
                  if (m.permissionsFor(e).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    db.set(`banditKill_${m.id}`, null)
                  }
                })
              }
            })
          } else if (role == "Serial Killer") {
            db.delete(`stab_${chan.id}`)
          } else if (role == "Arsonist") {
            db.delete(`douse_${chan.id}`)
          } else if (role == "Corruptor") {
            db.delete(`corrupt_${chan.id}`)
          } else if (role == "Cannibal") {
            db.delete(`eat_${chan.id}`)
          } else if (role == "Illusionist") {
            db.delete(`disguise_${chan.id}`)
          } else if (role == "Sect Leader") {
            db.delete(`sect_${chan.id}`)
          } else if (role == "Zombie") {
            db.delete(`bite_${chan.id}`)
          } else if (role == "Jailer") {
            db.delete(`jail_${chan.id}`)
          } else if (role == "Marksman") {
            db.delete(`mark_${chan.id}`)
          } else if (role == "Sheriff") {
            db.delete(`snipe_${chan.id}`)
          } else if (role == "Kitten Wolf") {
            db.delete(`scratch_${chan.id}`)
          } else if (role == "Nightmare Werewolf") {
            db.delete(`sleepy_${chan.id}`)
          } else if (role == "Naughty Boy") {
            db.delete(`switch_${chan.id}`)
          } else if (role.toLowerCase().includes("wolf")) {
            db.delete(`wolvesKill_${chan.id}`)
          }
        }
      }
    }
  }
})
//When receiving a message
client.on("message", (message) => {
  function yaises(x) {
    client.commands.get(x).run(message)
  }

  //let guy = message.member.nickname;
  if (message.author.bot) return //Ignore bots and dms
  
  if (!message.content.startsWith("+")) {
  	if (message.guild.id == "472261911526768642") {
    		if (db.get(`rolecmitime_${message.author.id}`)) {
      			let allroles = [
	  			"Alchemist",
	  			"Grave Robber",
          			"Fortune Teller",
          			"Kitten Wolf",
          			"Pacifist",
          			"Spirit Seer",
          			"Sheriff", 
          			"Werewolf Berserk",
          			"Wolf Pacifist", 
          			"Cupid",
          			"President",
          			"Mayor",
          			"Grumpy Grandma",
          			"Seer Apprentice",
          			"Tough Guy",
          			"Loudmouth", 
          			"Sorcerer", 
          			"Flower Child",
          			"Guardian Wolf",
          			"Beast Hunter",
          			"Avenger",
          			"Witch",
          			"Detective",
	          		"Forger",
        		  	"Cursed",
          			"Marksman",
          			"Red Lady",
          			"Junior Werewolf", 
          			"Nightmare Werewolf",
          			"Shadow Wolf",         
          			"Random Regular Villager",
          			"Random Strong Villager", 
          			"Random Werewolf", 
          			"Random Killer", 
          			"Random Voting", 
          			"Random",
          			"Arsonist", 
          			"Sect Leader",
          			"Bomber", 
          			"Zombie",
          			"Corruptor", 
          			"Cannibal",
          			"Illusionist",
          			"Bandit" 
        		]
      
        		let rolesPlayerHas = ["Villager", "Gunner", "Doctor", "Bodyguard", "Seer", "Jailer", "Priest", "Aura Seer", "Medium", "Werewolf", "Alpha Werewolf", "Wolf Shaman", "Wolf Seer", "Fool", "Headhunter", "Serial Killer"]
    
		        let boughtroles = db.get(`boughtroles_${message.author.id}`) || []
		        
        		boughtroles.forEach(role => {
          			rolesPlayerHas.push(role)
        		})
      
        		if (!allroles.includes(`${message.content[0].toUpperCase()}${message.content.slice(1).toLowerCase()}`)) return message.channel.send("Role not found!")
        		if (!rolesPlayerHas.includes(`${message.content[0].toUpperCase()}${message.content.slice(1).toLowerCase()}`)) return message.channel.send("You did not buy this role!")
		}
    }
  }
  
  // blacklists
  let blacklists = db.get(`blacklistss`) || []
  //console.log(blacklists)
  if (message.channel.type != "dm") {
    if (message.guild.id == "472261911526768642" && message.channel.name == "day-chat") {
      if ((message.content.includes("#priv") || message.content.includes("<#")) && !message.member.permissions.has(["MANAGE_ROLES"])) {
        message.delete()
        message.channel.send(`${message.author} This is a warning! Do not mention your channel!`)
      }
    }
    if ((message.content.includes("fuck") || message.content.includes("fúck")) && (message.channel.name == "enter-game" || message.channel.name == "player-commands")) {
      message.member.addRole("607926461726457879")
      message.delete()
      message.reply("WATCH YOUR LANG! ")
      let ch = message.guild.channels.find((m) => m.name === "game-lobby")
      ch.overwritePermissions(message.author.id, { SEND_MESSAGES: false })
    }
    if (message.content == "-pls snipe") {
      message.delete()
      message.channel.send(`We're no strangers to love
You know the rules and so do I
A full commitment's what I'm thinking of
You wouldn't get this from any other guy

I just wanna tell you how I'm feeling
Gotta make you understand
`)
    }

    if (message.guild.id == "472261911526768642" && message.channel.name == "day-chat" && message.member.roles.cache.has("606140092213624859") && message.content.length > 140) {
      message.delete()
      return message.channel.send("Maximum length for messages are 140 characters!")
    }
    if (message.guild.id == "472261911526768642" && message.channel.name == "day-chat" && message.member.roles.cache.has("606140092213624859") && message.content.includes("\n")) {
      message.delete()
      return message.channel.send("No, sending more than one line is prohibited!")
    }
  }

  //If user mentions bot
  if (message.content === "<@!549402544066002955>") return message.author.send(`Hey! My prefix is ${prefix}, you can ask for \`${prefix}help\` if you ever need.`)

  if (!message.content.startsWith(prefix)) return
  if (blacklists.includes(`/${message.author.id}/`) && message.author.id != "552814709963751425") return message.channel.send("Blacklisted users can't use any command!")

  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()
  const command =
    client.commands.get(commandName) || //DO NOT PUT ;
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
  if (!command) return //If such command doesn't exist, ignore it

  //Ignore guild-only commands inside DMs
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command in DMs!")
  }

  if (command.gameOnly && message.guild.id != "472261911526768642") return message.channel.send("That command can only be used in the game server!")

  //Check if that command needs arguments

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    }
    return message.channel.send(reply)
  }

  //Check if command is in cooldown
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }
  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 0) * 1000
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`please wait ${Math.ceil(timeLeft.toFixed(1))} more seconds before reusing the \`${command.name}\` command.`)
    }
  }
  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  //Execute command if everything is ok
  try {
    client.channels.cache.get("783013534560419880").send(`Command ran: **${commandName}**\nArguments: **${args.join(" ") || "None"}**\nAuthor: ${message.author.tag} (${message.author.id})`)
    command.run(message, args, client)
  } catch (error) {
    console.error(error)
    message.reply("Something went wrong...")
  }
})

require("./stafflist.js")(client)

bot.on("ready", () => {
	console.log("Bot is ready!")
	
})

require("./testslash.js")(bot)

bot.on("message", async message => {
	let pr = "3061!"
	
	if (message.author.bot) return;
	if (message.content.startsWith("3061!")) {
		let cmd = message.content.slice(5).split(" ")[0].toLowerCase()
		if (cmd) {
			let input = message.content.slice(5 + cmd.length + 1).split(" ")
			
			if (cmd == "games") {
				message.channel.send(new Discord.MessageEmbed()
						    .setTitle("Games")
						    .setDescription("1. **Tic Tac Toe**\n - Classic game\n\n2. **Checkers**\n - Now that's some good shit\n\n3. **Chess**\n - DO you think you are smart enough?")
						    .setColor("YELLOW")
						    .setTimestamp()
						    ).catch(e => message.author.send(`I do not have the \`SEND MESSAGES\` permission in ${message.channel}`).catch(e => console.log(e.message)))
			}
		}
	}
})

bot.login("ODMwMjUxOTAwODY2OTIwNTA4.YHD-Vg.KwIkPJNGiodenHw8VyhR3m9OSAo")
client.login(token)
