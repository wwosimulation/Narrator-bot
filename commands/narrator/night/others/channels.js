const db = require('quick.db')

module.exports = async client => {
  
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object 
  const players = db.get(`players`) // get all the players in an array - Array<Snowflake> 
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players in an array - Array<Snowflake>
  const zombieChat = guild.channels.cache.find(c => c.name === "zombies-chat") // get the zombie chat channel - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day chat channel - Object
  const wwChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves chat channel - Object
  const wwVote = guild.channels.cache.find(c => c.name === "ww-vote") // get the werewolves vote channel - Object

  let droppy = { type: 3, custom_id: "wolves-vote", options: [] }  
  alivePlayers.forEach(p => {
      if (db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan") return;
      droppy.options.push({ label: `${players.indexOf(p)+1} ${db.get(`player_${p}`).username}`, value: `votefor-${players.indexOf(p)+1}`, description: `${db.get(`player_${p}`).username}` })
  })

  if (db.get(`game.isShadow`)) db.delete(`game.isShadow`)

  // loop through each player
  players.forEach(async player => {
    
    let guy = db.get(`player_${player}`) // get the player object - Object
    let channel = guild.channels.cache.get(guy.channel) // get the player's channel object - Object

    dayChat.permissionOverwrites.delete(player)
    
    // check if NOT they are nightmared, jailed, or hypnotized
    if (!guy.nightmared || !guy.jailed || !guy.hypnotized) {
      
      // check if they are a zombie
      if (guy.role === "Zombie") {
        
        // change the channel's permissions
        zombieChat.permissionOverwrites.edit(guy.id, { 
          SEND_MESSAGES: true, 
          VIEW_CHANNEL: true, 
          READ_MESSAGE_HISTORY: true 
        })
        
      } else if (guy.role === "Bandit" || guy.role === "Accomplice") { // check if they are a Bandit or an accomplice

        // change the channel's permissions
        const banditChat = guild.channels.cache.get(guy.banditChannel) // get the bandit chat channel - Object
        banditChat.permissionOverwrites.edit(guy.id, { 
          SEND_MESSAGES: true, 
          VIEW_CHANNEL: true, 
          READ_MESSAGE_HISTORY: true 
        })
        
      } else if (guy.team === "Werewolf" && guy.role !== "Sorcerer" && guy.role !== "Werewolf Fan" && guy.status === "Alive") { // check if they are a werewolf
        
        // change the channel's permissions
        wwChat.permissionOverwrites.edit(guy.id, { 
          SEND_MESSAGES: true, 
          VIEW_CHANNEL: true, 
          READ_MESSAGE_HISTORY: true 
        })
        
      }
    }
  })

  if (players.filter(p => db.get(`player_${p}`).status === "Alive" && (db.get(`player_${p}`).role === "Werewolf Fan" || db.get(`player_${p}`).team !== "Werewolf")).length === 0) return;
  if (players.filter(p => db.get(`player_${p}`).status === "Alive" && db.get(`player_${p}`).team === "Werewolf" && db.get(`player_${p}`).role !== "Werewolf Fan").length === 0) return;
  wwVote.send({ content: `${guild.roles.cache.find(r => r.name === "Alive")} Time to vote!`, components: [{ type: 1, components: [droppy] }] })
}