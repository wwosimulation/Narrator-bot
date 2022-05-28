const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions
const doctor = require("./protection/doctor.js") // doctor protection
const beastHunter = require("./protection/beastHunter.js") // beast hunter protection
const witch = require("./protection/witch.js") // witch protection
const jailer = require("./protection/jailer.js") // jailer protection
const redLady = require("./protection/redLady.js") // red lady protection
const bodyguard = require("./protection/bodyguard.js") // bodyguard protection
const toughGuy = require("./protection/toughGuy.js") // tough guy protection
const forger = require("./protection/forger.js") // forger protection
const ghostLady = require("./protection/ghostLady.js") // ghost lady protection

async function getProtections(client, guy, attacker) {
    
  let getResult;
  
  // check if the player they are attacking is healed by the beast hunter
  getResult = await beastHunter(client, guy, attacker) // checks if a beast hunter has a trap on them
  if (getResult === true) return false // exits early if a beast hunter DOES have a trap on them

  // check if the player they are attacking is jailed
  getResult = await jailer(client, guy, attacker) // checks if they are jailed
  if (getResult === true) return false // exits early if they are jailed

  // check if the player they are attacking is healed by the ghost lady
  getResult = await ghostLady(client, guy, attacker) // checks if a ghost lady is protecting them
  if (getResult === true) return false // exits early if a ghost lady IS protecting them

  // check if the player they are attacking is healed by the doctor
  getResult = await doctor(client, guy, attacker) // checks if a doctor is protecting them
  if (getResult === true) return false // exits early if a doctor IS protecting them

  // check if the player they are attacking is healed by the witch
  getResult = await witch(client, guy, attacker) // checks if a witch is protecting them
  if (getResult === true) return false // exits early if a witch IS protecting them

  // check if the player they are attacking is healed by the bodyguard
  getResult = await bodyguard(client, guy, attacker) // checks if a bodyguard is protecting them
  if (getResult === true) return false // exits early if a bodyguard IS protecting them

  // check if getResult isn't an object
    if (typeof getResult !== "object") {

    // check if the player they are attacking is a red lady that got away visiting someone else
    getResult = await redLady(client, guy, attacker) // checks if the red lady is not home
    if (getResult === true) return false // exits early if the red lady IS not home

    // check if the player they are protecting has the forger's sheild
    getResult = await forger(client, guy) // checks if the player has the forger's sheild
    if (getResult === true) return false // exits early if the player DOES have the forger's sheild
  }

  return typeof getResult === "object" ? getResult : guy // looks like there were no protections 

}

module.exports = async (client) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const sectLeaders = alivePlayers.filter(p => db.get(`player_${p}`).role === "Sect Leader") // get the alive Sect Leaders array - Array<Snowflake>
  const headhunterTargets = alivePlayers.filter(d => db.get(`player_${d}`).role === "Headhunter").map(d => db.get(`player_${d}`).target)
  
  // loop through each serial killer
  for (let sl of sectLeaders) {
    
    let attacker = db.get(`player_${sl}`) // the attacker object - Object
    
    // check if the sk has a target
    if (attacker.target) {
        
      // delete the target
      db.delete(`player_${sl}.target`) // don't worry, this won't affect the current target
      
      let guy = db.get(`player_${attacker.target}`)
      
      // check if the sk's target is alive
      if (guy.status === "Alive") {
        
        let result;
        
        // check if they are a forbidden role
        if ((guy.team !== "Village" && !["Fool", "Headhunter"].includes(guy.role)) || guy.bitten || headhunterTargets.includes(guy.id) || guy.role === "Cursed") {
        
          // oh well, send them a fail message
          let channel = guild.channels.cache.get(attacker.channel) // gets the channel
          await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id)+1} ${guy.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
          await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player
        
        } else {
        
          // check for any protections
          let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>

          // check if the result type is an object - indicating that there were no protections
          if (typeof result === "object") {

            // make the player part of the sect team
            let playerChannel = guild.channels.cache.get(guy.channel) // get the GUY'S channel. Sect leader bypasses bodyguard with 1 life / tough guy
            let sectChannel = guild.channels.cache.get(attacker.sectChannel) // get the sect channel
            let sectMembers = db.get(`player_${attacker.id}`) || [] // get the sect members
            await playerChannel.send(`${getEmoji("sect_member", client)} You have been converted by the Sect Leader! Player **${players.indexOf(attacker.id)+1} ${attacker.username}** is your leader!`)
            await sectChannel.send(`${guild.roles.cache.find(r => r.name === "Alive")} ${getEmoji("sect_member", client)} Player **${players.indexOf(guy.id)+1} ${guy.username}** is now a sect member.`)
            sectMembers.push(guy.id)
            db.set(`player_${attacker.id}`, sectMembers)
            db.set(`player_${guy.id}.sected`, attacker.id)

          } else { // otherwise they were protected

            // oh well, send them a fail message
            let channel = guild.channels.cache.get(attacker.channel) // gets the channel
            await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id)+1} ${guy.username}** could not be converted! They were either protected, Cursed, a werewolf, a solo killer or the Headhunter's target!`)
            await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player

          }
        
        
        }
        
      }
    
    }
    
  }
  
  return true // exit early
  
}