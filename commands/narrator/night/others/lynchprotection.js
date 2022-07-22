const db = require("quick.db")

module.exports = async (client, guy) => {

  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const players = db.get(`players`) // get all the players in an array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players in an array - Array<Snowflake> 
  const protectors = players.filter(p => alivePlayers.includes(p) && ["Flower Child", "Guardian Angel"].includes(db.get(`player_${p}`).role)) // get the day protectors - Array<Snowflake>
  
  let result = false // set the result to false by default
  
  for (let player of protectors) {
    
    let protector = db.get(`player_${player}`) // get the guy object - Object
    
    // check if the target exists
    if (protector.target) {
    
      // check if the target is the same (Logically, I don't need to check if the target is alive, because it has already been confirmed in lynch.js)
      if (protector.target === guy.id) {
        
        db.set(`player_${protector}.uses`, 0) // set the uses to 0 because their ability has been used
        result = true // set the result to true
        break; // break the loop, so we don't continue
      
      }
      
    }
  
  }
  
  return result;

}