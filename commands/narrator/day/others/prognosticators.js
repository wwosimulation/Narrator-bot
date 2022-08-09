const { getRole, getEmoji } = require("../../../../config") // functions
const db = require("quick.db")

module.exports = async (client) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const gamePhase = db.get(`gamePhase`)
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const prognosticators = players.filter(p => db.get(`player_${p}`).role === "Prognosticator") // get the alive Prognosticators array - Array<Snowflake>
  const night = Math.floor(gamePhase / 3) + 1 // get's the night count
  
  // loop through each prognosticator
  for (const prog of prognosticators) {
  
    let proggy = db.get(`player_${prog}`) // get the prognosticator player - Object 
    
    // check if peace is active, the prog is alive and it's been the next night
    if (proggy.peace === true) {
      
      if (proggy.peaceAt === night - 1)
        db.delete(`player_${prog}.peace`) // delete the peace
        db.delete(`player_${prog}.peaceAt`) // delete the peaceAt
      
        // get all the evils, except bomber fool and headhunter
        const evils = players.filter(p => db.get(`player_${p}`).role === "Red Lady" || (db.get(`player_${p}`).team !== "Village" && !["Fool", "Headhunter", "Bomber", "Zombie"].includes(db.get(`player_${p}`).role)))
        
        // loop through each evildoer and remove their target
        evils.forEach(async evildoer => {
          if (db.get(`player_${evildoer}`).team === "Werewolf") {
            db.delete(`player_${evildoer}.vote`) // deletes the wolf vote
          } else {
            db.delete(`player_${evildoer}.target`) // deletes the target
          }
          
          // cannibal hunger won't go up
          if (db.get(`player_${evildoer}`).role === "Cannibal") {
            db.subtract(`player_${evildoer}.uses`, 1) // subtract the hunger
          }
          
          
        })
    }
    
    // terror
    if (proggy.target) {
    
      let guy = db.get(`player_${proggy.id}.target`) // get the player to terrorize
      
      if (guy.status === "Alive") {
      
        // TERRORIZE THE STOOPID PLAYER WHO CHOSE TO MESS WITH THE PROGNOSTICATOR
        db.set(`player_${guy.id}.terror`, true) // terrorize the player
        await dayChat.send(`${getEmoji("prognosticator", client)} Player **${players.indexOf(guy.id)+1} ${guy.username}** has lost their rights to vote indefinitely because they chose to mess with the Prognosticator.`) // sends the message to daychat
      
      }
      
    }
    
  }

}