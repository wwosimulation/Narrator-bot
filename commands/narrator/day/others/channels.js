const db = require("quick.db")

module.exports = async client => {

  // get all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const players = db.get(`players`) // get all the players in an array - Array<Snowflakes>
  
  players.forEach(async player => {
    
    let guy = db.get(`player_${player}`) // get the player object - Object
    
    db.delete(`player_${guy.id}.jailed`)
    db.delete(`player_${guy.id}.nightmared`)
    db.delete(`player_${guy.id}.hypnotized`)
    
    // if the player was nightmared or jailed
    if (guy.nightmared || guy.jailed || guy.hypnotized) {
      
      // unlock their channel
      let channel = guild.channels.cache.get(guy.channel) // gets the channel
      
      // edit the permissions of that channel
      await channel.permissionOverwrites.edit(guy.id, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true
      })
      
      // check if the player was jailed
      if (guy.jailed) {
        
        let jailedChat = guild.channels.cache.find(c => c.name === "jailed-chat") // gets the channel
        
        // delete the permissions of that channel for that guy
        await channel.permissionOverwrites.delete(guy)
        
        // delete the messages
        let allMessages = await channel.messages.fetch({ limit: 100, cache: false }) // fetches up to 100 messages from the channel
        await channel.bulkDelete(allMessages.filter(m => !m.pinned)) // deletes every message but pinned
        
      }
      
    }
    
  })

}