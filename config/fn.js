const { GuildMember } = require("discord.js")
const ids = require("./ids.js")
const db = require("quick.db")

module.exports = {
  isBeta: (id) => {
    return ["801726595378315264", "719564153072910407", "406412325973786624", "439223656200273932", "159717599993790464", "452632560795648000"].includes(id) ? true : false
  },
}

module.exports.isNarrator = (user) => {
  if (!user instanceof GuildMember) return
  let narroles = [ids.mini, ids.minisim, ids.narrator, ids.narratorsim]
  let isNarr = user.roles.cache.filter((x) => narroles.includes(x.id))
  if (isNarr.map((x) => x.id).length > 0) return true
  return false
}

module.exports.updateXP = (id, client) => {
  let guy = client.users.cache.get(id)
  let xp = db.get(`xp_${id}`) || 0
  let level = db.get(`level_${guy.id}`)
  let req = module.exports.nextLevel(xp, level)
  if(xp > req) {
      db.add(`lootbox_${guy.id}`, 1)
      db.add(`level_${guy.id}`, 1)
      guy.send(`Congrats! You have reached Level ${db.get(`level_${guy.id}`)}!\n\nYou have recieved a lootbox. To open it, do \`+use lootbox\`.`)
      module.exports.updateXP(id, client)
  }

    
}

module.exports.nextLevel = (xp, level = 0) => {
  return 1000 + (1000 * (1.5 * level))
}