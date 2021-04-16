console.log("Booting bot...")
require("dotenv").config()
const fs = require("fs")
const db = require("quick.db")
const Discord = require("discord.js")
const client = new Discord.Client({ws: {intents: ["GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS", "GUILD_PRESENCES"]}})

require("./slash.js")(client)
//const shadowadmin = require("shadowadmin")

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}
const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
  require(`./events/${file}`)(client)
}

client.botAdmin = (id) => {
  if (["439223656200273932", "406412325973786624"].includes(id)) return true
  return false
}

client.paginator = async (author, msg, embeds, pageNow, addReactions = true) => {
  if (embeds.length === 1) return
  if (addReactions) {
    await msg.react("⏪")
    await msg.react("◀")
    await msg.react("▶")
    await msg.react("⏩")
  }
  let reaction = await msg.awaitReactions((reaction, user) => user.id == author && ["◀", "▶", "⏪", "⏩"].includes(reaction.emoji.name), { time: 30 * 1000, max: 1, errors: ["time"] }).catch(() => {})
  if (!reaction) return msg.reactions.removeAll().catch(() => {})
  reaction = reaction.first()
  //console.log(msg.member.users.tag)
  if (msg.channel.type == "dm" || !msg.guild.me.hasPermission("MANAGE_MESSAGES")) {
    if (reaction.emoji.name == "◀") {
      let m = await msg.channel.send(embeds[Math.max(pageNow - 1, 0)])
      msg.delete()
      client.paginator(author, m, embeds, Math.max(pageNow - 1, 0))
    } else if (reaction.emoji.name == "▶") {
      let m = await msg.channel.send(embeds[Math.min(pageNow + 1, embeds.length - 1)])
      msg.delete()
      client.paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1))
    } else if (reaction.emoji.name == "⏪") {
      let m = await msg.channel.send(embeds[0])
      msg.delete()
      client.paginator(author, m, embeds, 0)
    } else if (reaction.emoji.name == "⏩") {
      let m = await msg.channel.send(embeds[embeds.length - 1])
      msg.delete()
      client.paginator(author, m, embeds, embeds.length - 1)
    }
  } else {
    if (reaction.emoji.name == "◀") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[Math.max(pageNow - 1, 0)])
      client.paginator(author, m, embeds, Math.max(pageNow - 1, 0), false)
    } else if (reaction.emoji.name == "▶") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[Math.min(pageNow + 1, embeds.length - 1)])
      client.paginator(author, m, embeds, Math.min(pageNow + 1, embeds.length - 1), false)
    } else if (reaction.emoji.name == "⏪") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[0])
      client.paginator(author, m, embeds, 0, false)
    } else if (reaction.emoji.name == "⏩") {
      await reaction.users.remove(author)
      let m = await msg.edit(embeds[embeds.length - 1])
      client.paginator(author, m, embeds, embeds.length - 1, false)
    }
  }
}

//Bot on startup
client.on("ready", async () => {
  client.config = {}
  client.user.setActivity("Wolvesville Simulation!")
  console.log("Connected!")
  //ShadowAdmin initialize
  //shadowadmin.init(client, {prefix, owners: config.botAdmin})
})

require("./stafflist.js")(client)
client.login(process.env.TOKEN)

const { APIMessage, Structures } = require("discord.js")

class Message extends Structures.get("Message") {
  async inlineReply(content, options) {
    const mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === "undefined" ? true : (options || content).allowedMentions.repliedUser
    delete ((options || content || {}).allowedMentions || {}).repliedUser

    const apiMessage = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options).resolveData()
    Object.assign(apiMessage.data, { message_reference: { message_id: this.id } })

    if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0) apiMessage.data.allowed_mentions = { parse: ["users", "roles", "everyone"] }
    if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined") Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser })

    if (Array.isArray(apiMessage.data.content)) {
      return Promise.all(
        apiMessage
          .split()
          .map((x) => {
            x.data.allowed_mentions = apiMessage.data.allowed_mentions
            return x
          })
          .map(this.inlineReply.bind(this))
      )
    }

    const { data, files } = await apiMessage.resolveFiles()
    return this.client.api.channels[this.channel.id].messages.post({ data, files }).then((d) => this.client.actions.MessageCreate.handle(d).message)
  }
}

Structures.extend("Message", () => Message)
