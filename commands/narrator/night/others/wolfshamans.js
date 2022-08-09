const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../config") // funcions

module.exports = async client => {
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object 
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object 
  const jailedChat = guild.channels.cache.find(c => c.name === "jailed-chat")
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object 
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake> 
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake> 
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> c
  const shamans = alivePlayers.filter(p => ["Wolf Shaman"].includes(db.get(`player_${p}`).role)) // get the alive wolf shamans array - Array<Snowflake>
  const jailers = alivePlayers.filter(p => db.get(`player_${p}`).role === "Jailer") // get the alive jailers array - Array<Snowflake>
  
  for (let shaman of shamans) {
    
    let wwshaman = db.get(`player_${shaman}`)
    
    if (wwshaman.status === "Alive") {
      
      if (wwshaman.target) {

        let guy = db.get(`player_${nmww.target}`)

        db.delete(`player_${wwshaman}.target`)

        werewolvesChat.send(`${getEmoji("wolf_shaman", client)} The Wolf Shaman has enchanted **${players.indexOf(player.id)+1} ${player.username}**!`)
        
        db.set(`player_${wwshaman}.shamanned`, true)
        
      }
    }
  }
}