const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions

module.exports = async (client, guy, attacker) => {
  
  if (typeof guy !== "object" || typeof attacker !== "object") return false // makes sure if "guy" and "attacker" is an object, otherwise exit early
  
  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const isBerserkActive = db.get(`isBerserkActive`) // get the value of isBerserkActive
  let allProtected = db.get(`berserkProtected`) || [] // get the array of players who protected the berserk's target
  
  let isProtected = false
  // loop through each player to see if they are a jailer
  for (let player of alivePlayers) {
    
    // check and see if the player is a Jailer
    if (db.get(`player_${player}`).role === "Jailer") {
      
      // check and see if the Jailer jailed the player and the player is jailed.
      if (db.get(`player_${player}`).jailedTarget === guy.id && guy.jailed === true) {
        
        // check if berserk is active and the attacker is from the werewolves' team
        if (isBerserkActive === true && attacker.team === "Werewolf") {
          allProtected.push(player)
          db.set(`berserkProtected`, allProtected)
        } else {
          
          // set protection to true and exit early
          isProtected = true // set the protection to true
          break; // break out of the loop
        }
      }
    }
  }
  
  // return the isProtected value
  return isProtected 
  
}