const db = require("quick.db")
const { getEmoji } = require("../../../../config")

module.exports = async client => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object 
    const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object 
    const jailedChat = guild.channels.cache.find(c => c.name === "jailed-chat")
    const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object 
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake> 
    const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake> 
    const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const jailers = alivePlayers.filter(p => db.get(`player_${p}`).role === "Jailer") // get the alive jailers array - Array<Snowflake>
    
    // loop through each jailer
    for (let jailer of jailers) {
      
      let jail = db.get(`player_${jailer}`) // get the jailer object - Object
      
      // check if the jailer is alive
      if (jail.status === "Alive") {
        
        // check if the jailer has selected a target
        if (jail.target) {
          
          let guy = db.get(`player_${jail.target}`) // get the player to be jailed - Object
          let channel = guild.channels.cache.get(guy.channel) // get their channel - Object
          let player = await guild.members.fetch(guy.id) // fetch the discord member - Promise<Object>
          
          // check if the player is alive
          if (guy.status === "Alive") { 
            
            // change the channel's permissions
            channel.permissionOverwrites.edit(guy.id, { 
              SEND_MESSAGES: false, 
              VIEW_CHANNEL: true, 
              READ_MESSAGE_HISTORY: true 
            })
          
            // give access to jailedchat
            jailedChat.permissionOverwrites.edit(guy.id, {
              SEND_MESSAGES: true, 
              VIEW_CHANNEL: true, 
              READ_MESSAGE_HISTORY: true 
            })
            
            // check if they belong to the Werewolf team  
            if (guy.team === "Werewolf" && guy.role !== "Werewolf Fan") {
              
              // send the message 
              werewolvesChat.send(`Your werewolf teammate **${players.indexOf(player.id)+1} ${player.username} (${getEmoji(guy.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${guy.role})** has been jailed!`)
              
            }
            
            
            channel.send(`You have been jailed! You can't do your actions for tonight! Head to <#${jailedChat.id}> to talk with the jailer!`) // send the message
            db.set(`player_${guy.id}.jailed`, true) // set the jailed status to true
          }
        }
      }
    }
  }