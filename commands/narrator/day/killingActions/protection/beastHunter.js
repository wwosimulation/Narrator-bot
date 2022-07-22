const db = require("quick.db") // database
const { getEmoji } = require("../../../config") // functions

module.exports = async (client, guy, attacker) => {
  
  if (typeof guy !== "object" || typeof attacker !== "object") return false // makes sure if "guy" and "attacker" is an object, otherwise exit early
  
  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const isBerserkActive = db.get(`isBerserkActive`) // get the value of isBerserkActive
  const attackerMember = await guild.members.fetch(attacker.id) // get the discord member - Promise<GuildMember - Object>
  const allAttackerRoles = attackerMember.roles.cache.map(c => c.name === "Alive" ? "892046207428476989" : c.id) // get all the roles this member has - Array<Snowflake>
  let allProtected = db.get(`berserkProtected`) || [] // get the array of players who protected the berserk's target - Array<Snowflake>
  
  
  let isProtected = false
  // loop through each player to see if they are a beast hunter
  for (let player of alivePlayers) {
    
    // check and see if the player is a Beast Hunter
    if (db.get(`player_${player}`).role === "Beast Hunter") {
      
      // check and see if the Beast Hunter's trap is on the attacked player and the trap is active
      if (db.get(`player_${player}`).target === guy.id && db.get(`player_${player}`).placed === true) {
        
        // remove the trap from the player
        db.delete(`player_${player}.trap`)
        db.delete(`player_${player}.placed`)
        
        // check if berserk is active and the attacker is from the werewolves' team
        if (isBerserkActive === true && attacker.team === "Werewolf") {
          
          allProtected.push(player)
          db.set(`berserkProtected`, allProtected)
          
        } else {
          
          // alert and exit early
          isProtected = true // set the protection to true
          let channel = guild.channels.cache.get(db.get(`player_${player}`).channel) // get the channel object - Object
          
          // check if the attacker DOES NOT belong to the werewolves' team.
          if (attacker.team !== "Werewolf") {
            await channel.send(`${getEmoji("trap", client)} Your trap was triggered last night but your target was too strong.`) // sends a message to the beast hunter
            await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings alive in the channel
          }
          break; // break out of the loop
        }
      }
    }
  }
  
  // return the isProtected value
  return isProtected 
  
}