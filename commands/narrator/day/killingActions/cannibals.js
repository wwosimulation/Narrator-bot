const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // functions
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

    // check if the player they are attacking is healed by the tough guy
    getResult = await toughGuy(client, guy, attacker) // checks if a tough guy is protecting them
    if (getResult === true) return false // exits early if a tough guy IS protecting them

    // check if the player they are attacking is a red lady that got away visiting someone else
    getResult = await redLady(client, guy, attacker) // checks if the red lady is not home
    if (getResult === true) return false // exits early if the red lady IS not home

    // check if the player they are protecting has the forger's sheild
    getResult = await forger(client, guy) // checks if the player has the forger's sheild
    if (getResult === true) return false // exits early if the player DOES have the forger's sheild
  }

  return typeof getResult === "object" ? getResult : guy // looks like there were no protections 

}

module.exports = async (client, alivePlayersBefore) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const cannibals = alivePlayersBefore.filter(p => db.get(`player_${p}`).role === "Cannibal") // get the alive Cannibals array - Array<Snowflake>
  
  // loop through each cannibal
  for (let canni of cannibals) {
    
    let attacker = db.get(`player_${canni}`) // the attacker object - Object
    
    // check if the canni has a target
    if (attacker.target) {
        
      // deletes the target
      db.delete(`player_${attacker.id}.target`) // don't worry, this won't affect the current target
      
      for (let target of attacker.target) {
      
        let guy = db.get(`player_${target}`)

        // check if the canni's target is alive
        if (guy.status === "Alive") {

          // check for any protections
          let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>

          // check if the result type is an object - indicating that there were no protections
          if (typeof result === "object") {

            // send a message to the day chat and make the player dead
            db.set(`player_${result.id}.status`, "Dead")
            client.emit("playerKilled", db.get(`player_${result.id}`), attacker)
            let attackedPlayer = await guild.members.fetch(result.id) // fetch the discord member - Object
            let attackedPlayerRoles = attackedPlayer.roles.cache.map(r => r.name === "Alive" ? "892046207428476989" : r.id) // get all the roles and replace the Alive role with Dead.
            
            // check if they were hypnotized
            if (typeof attacker.hypnotize === "string") {    
                await dayChat.send(`${getEmoji("eat", client)} The Dreamcatcher compelled the hungry Cannibal to eat **${players.indexOf(result.id)+1} ${result.username} (${getEmoji(result.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${result.role})**!`)
            } else {
                await dayChat.send(`${getEmoji("eat", client)} The hungry Cannibal ate **${players.indexOf(result.id)+1} ${result.username} (${getEmoji(result.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${result.role})**!`)
            }
            await attackedPlayer.roles.set(attackedPlayerRoles) // removes the Alive and adds the Dead discord role

          } else { // otherwise they were protected

            let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object
            await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id)+1} ${guy.username}** could not be killed!`) // sends an error message
            await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player in the channel

          }

        }
      }
    
    }
    
  }
  
  return true // exit early
  
}