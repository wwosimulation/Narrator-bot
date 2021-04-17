const { GuildMember } = require("discord.js")

module.exports = {
    isBeta: (id) => {
        return ["801726595378315264", "719564153072910407", "406412325973786624", "439223656200273932", "159717599993790464", "452632560795648000"].includes(id) ? true : false
      },
}

module.exports.isNarrator = (user, guildid = module.exports.ids.server.sim) => {
    if (!user instanceof GuildMember) return
    let narroles = [module.exports.ids.mini, module.exports.ids.minisim, module.exports.ids.narrator, module.exports.ids.narratorsim]
    let isNarr = user.roles.cache.filter((x) => narroles.includes(x.id))
    if (isNarr.map((x) => x.id).length > 0) return true
    return false
  }