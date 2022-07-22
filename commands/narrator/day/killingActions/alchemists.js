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

module.exports = async client => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const alchemists = alivePlayers.filter(p => db.get(`player_${p}`).role === "Corruptor") // get the alive Alchemists array - Array<Snowflake>
  
  // loop through each alchemist
  for (let alch of alchemists) {
    
    let attacker = db.get(`player_${alch}`) // the attacker object - Object
    
    // send a message to the player who got a red potion
    let rVictim = db.get(`player_${attacker.redTarget}`) // the victim object - Object
    let rChannel = guild.channels.cache.get(rVictim?.channel) // get the channel object - Object
    await rChannel.send(`${getEmoji("redp", client)} The Alchemist has sent you a potion. Sadly, you cannot make out the colour... you might die at the end of the day.`)
    await rChannel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
    
    // check if red potion exists
    if (attacker.redTarget) {
      
        // check if the player was already given a red potion before
        if (attacker.redPotions?.includes(rVictim.id)) {
      
            // set that they will die at night because of alchemist
            let allRedPotions = db.get(`player_${attacker.redTarget}.poisoned`) || [] // gets all the Alchemists id who poisoned this player - Array<Snowflake>
            allRedPotions.push(attacker.id) // pushes the attacker to the alchemist list
            db.set(`player_${attacker.redTarget}.poisoned`, allRedPotions) // sets the new array
      
        } else { // otherwise add the player into the redPotions array
      
            let redPotions = attacker.redPotions || [] // get the players who have been given a red potion - Array
            redPotions.push(rVictim.id) // pushes the player into the array
            db.set(`player_${attacker.id}.redPotions`, redPotions) // set them into the database
              
        }
    }
    
    // check if the alch has given a black potion to a player
    if (attacker.blackTarget) {
      
      let guy = db.get(`player_${attacker.blackTarget}`) // get the black potion victim object - Object
      
      // check if the alch's target is alive 
      if (guy.status === "Alive") {
        
        // check for any protections
        let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>
        
        // check if the result type is an object - indicating that there were no protections
        let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object
        
        if (typeof result === "object") {
            
          let guyChannel = guild.channels.cache.get(result.channel) // get the channel of the player that was given a potion
          
          // check if player is poisoned to avoid duplicate messages
          if (typeof result.poisoned !== "object") {
            
              // set their poisoned status and send a message   
              let allAlchemistPotions = db.get(`player_${result.id}.poisoned`) || [] // gets all the alchemist ids, in array, that have poisoned this player - Array<Snowflake>
              allAlchemistPotions.push(attacker.id) // push the attacker into the array
              db.set(`player_${result.id}.poisoned`, allAlchemistPotions) // set the poisoned as the current array
              await guyChannel.send(`${getEmoji("redp", client)} The Alchemist has sent you a potion. Sadly, you cannot make out the colour... you might die at the end of the day.`) // sends the potion message
              await guyChannel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player
          }
                    
          
        } else { // otherwise they were protected
          
          await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id)+1} ${guy.username}** could not be poisoned!`) // sends an error message
          await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player in the channel
        
        }
        
      }
    
    }
    
  }
  
  return true // exit early
  
}