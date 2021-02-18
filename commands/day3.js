const Discord = require("discord.js")
const db = require("quick.db")
const shuffle = require("shuffle-array")

module.exports = {
  name: "day3",
  run: async (message, args, client) => {
    
    if (message.guild.id != "472261911526768642") return
    
    // some functions to make my life easier
    function getchan(x) {
      return message.guild.channels.cache.find(c => c.name === x)
    }
    
    function getallchan(x) {
      return message.guild.channels.cache.filter(c => c.name === x).keyArray("id")
    }
    
    // all the variables
    let dayCount = db.get(`dayCount_${message.guild.id}`) || 0
    let alive = message.guild.roles.cache.find(r => r.name === "Alive")
    let dead = message.guild.roles.cache.find(r => r.name === "Dead")
    let aliveplayers = alive.members.keyArray("id")
    let day = getchan("day-chat")
    let wwChat = getchan("werewolves-chat")
    let zombChat = getchan("zombies")
    let lovers = getchan("lovers")
    let jailedChat = getchan("jailed-chat")
    let siblingChat = getchan("siblings")
    let sectMembers = getchan("sect-members")
    let sk = getallchan("priv-serial-killer")
    let arso = getallchan("priv-arsonist")
    let sl = getallchan("priv-sect-leader")
    let corr = getallchan("priv-corruptor")
    let canni = getallchan("priv-cannibal")
    let illu = getallchan("priv-illusionist")
    let chemi = getallchan("priv-alchemist")
    let bandit = getallchan("priv-bandit")
    let zombie = getallchan("priv-zombie")
    let banditss = getallchan("bandits")
    let jailer = getallchan("priv-jailer")
    let doc = getallchan("priv-doctor")
    let tg = getallchan("priv-tough-guy")
    let bg = getallchan("priv-bodyguard")
    let witch = getallchan("priv-witch")
    let bh = getallchan("priv-beast-hunter")
    let cursed = getallchan("priv-cursed")
    let cupid = getallchan("priv-cupid")
    let kittenwolf = getallchan("kitten-wolf")
    
    // if bandit killed with no accomplice, switch it to a conversion
    banditss.forEach(e => {
      let chan = message.guild.channels.cache.get(e)
    })
    
  }
}
