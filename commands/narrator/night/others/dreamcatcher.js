const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions

module.exports = async client => {
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object 
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object 
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object 
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake> 
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake> 
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake> 
  const dreamcatcher = alivePlayers.filter(p => db.get(`player_${p}`).role === "Dreamcatcher") // get the alive dreamcatcher array - Array<Snowflake>
  
  for (let dc in dreamcatcher) {
    
    let attacker = db.get(`player_${dc}`) // get the attacker object - Object
    
    // check if the attacker is alive
    if (attacker.status === "Alive") {
      
      // check if the attacker has selected a target
      if (attacker.target) {
        
        let guy = db.get(`player_${attacker.target}`) // get the guy object - object
        
        // check if the guy is alive
        if (guy.status === "Alive") {
          
          db.set(`player_${guy.id}.hypnotized`, true) // set the hypnotized to true in the database
          let channel = guild.channels.cache.get(guy.channel) // get the victim's channel
          
          // edit the victim's permissions in that channel
          await channel.permissionsOverwrites.edit(guy.id, {
            SEND_MESSAGES: false
          })
          
          // send a message in that channel.
          channel.send(`${guild.roles.cache.find(r => r.name === "Alive")} The dreamcatcher has hypnotized you, The only thing you can do is wait and die..`)
          
          // create the new channel for the dream catcher
          let dcChannel = await guild.channels.create(`priv-${db.get(guy.role).replace(" ", "-").toLowerCase()}`, {
            parent: "892046231516368906",
          })
          
          // edit the permissions for the new dreamcatcher's channel
          dcChannel.permissionOverwrites.edit(attacker.id, {
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            VIEW_CHANNEL: true,
          })
          
          db.set(`player_${attacker.id}.dreamChannel`, dcChannel.id) // set the channel id into the database
          
          dcChannel.send(`${guild.roles.cache.find(r => r.name === "Alive")}\n${getRole(guy.role)?.description}`) // send the description in the new channel
        }
      }
    }
  }
}