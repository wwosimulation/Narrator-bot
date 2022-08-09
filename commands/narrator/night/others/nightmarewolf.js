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
  const nightmare = alivePlayers.filter(p => ["Nightmare Werewolf", "Voodoo Werewolf"].includes(db.get(`player_${p}`).role)) // get the alive nmww and vww array - Array<Snowflake>
  const jailers = alivePlayers.filter(p => db.get(`player_${p}`).role === "Jailer") // get the alive jailers array - Array<Snowflake>
  
  for (let night of nightmare) {
    let nmww = db.get(`player_${night}`)
    
    if (nmww.status === "Alive") {
      
      if (nmww.target) {
        let guy = db.get(`player_${nmww.target}`)
        let player = await guild.members.fetch(guy.id)
        let channel = guild.channels.cache.get(guy.channel)
        

        db.delete(`player_${night}.target`)

        if (guy.status === "Alive") {
          
          channel.permissionOverwrites.edit(guy.id, { 
            SEND_MESSAGES: false, 
            VIEW_CHANNEL: true, 
            READ_MESSAGE_HISTORY: true 
          })
          
          werewolvesChat.send(`${getEmoji("nightmare", client)} Player **${players.indexOf(night)+1} ${nmww.username} (${getEmoji(nmww.role.toLowerCase().replace(/\s/g, "_"))} ${nmww.role})** put **${players.indexOf(player.id)+1} ${player.username}** to sleep!`)
          channel.send(`${getEmoji("nightmared", client)} You are in a deep sleep! You cannot use your abilities this night!`)
      
          if (guy.jailed == true) {
            
            for (let jail in jailers) {
              let jailer = db.get(`player_${jail}`)
              let jailChannel = guild.channels.cache.get(jail.channel)
              jailChannel.send(`${getEmoji("nightmared", client)} The player you have jailed has been nightmared!`)
            }
            
            jailedChat.permissionOverwrites.edit(guy.id, {
              SEND_MESSAGES: false, 
              VIEW_CHANNEL: true, 
              READ_MESSAGE_HISTORY: true 
            })
          }
          
          db.set(`player_${guy.id}.nightmared`, true)
        }
      }
    }
  }
}