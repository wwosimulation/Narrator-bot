const { getEmoji } = require("../../../config")
const db = require("quick.db")

module.exports = async (client) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const forgers = players.filter(p => db.get(`player_${p}`).role === "Forger") // get the alive Forgers array - Array<Snowflake>
  
  // loop through each forger
  for (const forg of forgers) {
  
    let forger = db.get(`player_${forg}`) // get the forger player - Object 
    
    db.delete(`player_${forger}.target`) // reset the target (Won't affect the current target, don't worry)
    
    // check if the forger has a target
    if (forger.target) {
    
      let guy = db.get(`player_${forger.target}`) // get the player who the forger had selected to give
    
      // give the player the sword or shield
      db.set(`player_${forger.target}.${forger.itemType}`, true) // give the player the shield or the sword
      db.subtract(`player_${forger.id}.uses`, 1) // subtract the uses from the forger
      
      let channel1 = guild.channels.cache.get(forger.channel) // get the channel of the forger
      let channel2 = guild.channels.cache.get(guy.channel) // get the channel of the player
      
      // send the messages to the forger and player
      await channel1.send(`${getEmoji(`get${forger.type}`, client)} Player **${players.indexOf(guy.id)} ${guy.username}** has succesfully recieved your ${forger.type}`)
      await channel2.send(`${getEmoji(`get${forger.type}`, client)} You have recieved a ${forger.type} from the Forger! ${forger.type === "shield" ? "" : `To use it, do \`+sword [player number]\``}`)
       
    }
    
  } 

}