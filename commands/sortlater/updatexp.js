const db = require("quick.db")

module.exports = {
  name: "updatexp",
  narratorOnly: true,
  run: async (id, client) => {
    let guy = client.users.cache.get(id)
    let req = db.get(`xpreq_${id}`)
    let xp = db.get(`xp_${id}`) || 0
    if (!req) {
      db.set(`xpreg_${id}`, 1000)
    }
    req = db.get(`xpreq_${id}`)
    
    if (guy) {
      if (xp > req) {
        db.add(`lootbox_${guy.id}`, 1)
        db.add(`xpreq_${guy.id}`, req * 1.5)
        db.add(`level_${guy.id}`, 1)
        guy.send(`Congrats! You have reached level ${db.get(`level_${guy.id}`)}!\n\nYou have recieved a lootbox. To open it, do \`+use lootbox\`.`)
      }
    }
  }
}
