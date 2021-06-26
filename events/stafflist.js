const db = require("quick.db")

const config = {
  guild: "465795320526274561",
  channel: "769232898632581180",
  roles: {
    staff: "606138123260264488",
    content: "606138315845926912",
    afk: "612750104973017207",
    mininarr: "606123620732895232",
    supervisor: "762061739848106024",
    narr: "606123619999023114",
    helper: "606123621252988931",
    minimod: "606123618849521674",
    mod: "606123617868316683",
    megamod: "606123616987512853",
    botdev: "606123616228343812",
    manager: "606123615645204490",
  },
}

module.exports = (client) => {
  client.on("stafflist", async () => {
    console.log("Generating staff list")
    let wovsim = client.guilds.cache.get(config.guild)
    let chan = wovsim.channels.cache.get(config.channel),
      mid = db.get("stafflist"), mid2 = db.get("stafflist2")
    let msg = await chan.messages.fetch(mid).catch(() => {})
    let msg2 = await chan.messages.fetch(mid2).catch(() => {})
    console.log("Message: " + mid)
    let m2 = ""
    let m = `**Managers**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.manager))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Bot Developers**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.botdev))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Mega Moderators**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.megamod))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Moderators**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.mod))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Mini Moderators**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.minimod))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m += `**Helpers**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.helper))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    
    m2 += `\n**Game Narrators**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.narr))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
      m += `**Supervisors**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.supervisor)).map((x) => `<@${x.id}> - ${x.user.tag}`).join("\n> ")}\n`
    m2 += `**Mini Narrators**\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.mininarr))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    m2 += `\n\n**AFK Staff/Content**\nThis includes less active staff members.\n> ${wovsim.members.cache
      .filter((x) => x.roles.cache.has(config.roles.afk))
      .map((x) => `<@${x.id}> - ${x.user.tag}`)
      .join("\n> ")}\n`
    if (!msg) {
      msg = await chan.send("Generating staff list...")
      msg2 = await chan.send("...")
      db.set("stafflist", msg.id)
      db.set("stafflist2", msg2.id)
    }
    msg.edit(m)
    msg2.edit(m2)
    console.log("Stafflist complete!")
  })
}
