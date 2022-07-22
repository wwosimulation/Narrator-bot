const { getEmoji } = require("../../../config")
const db = require("quick.db")

module.exports = async (client) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const mediums = players.filter(p => db.get(`player_${p}`).role === "Medium" && db.get(`player_${p}`).uses > 0) // get the alive Mediums array - Array<Snowflake>
  
  // loop through each medium
  for (const med of mediums) {
  
    let medium = db.get(`player_${med}`) // get the medium player - Object 
    
    db.delete(`player_${medium}.target`) // reset the target (Won't affect the current target, don't worry)
    
    if (!medium.target) continue; // if the medium doesn't has a target, don't do anything and check for the next medium
    
    let guy = db.get(`player_${medium.target}`) // get the player who the medium had selected to revive
    if (guy.status === "Alive") continue; // if the player is alive, don't do anything and check for the next medium
    
    // revive the player
    db.set(`player_${guy.id}.status`, "Alive") // set the status of the player to Alive
    db.set(`player_${medium.id}.uses`, 0) // set the uses to 0
    let member = await guild.members.fetch(guy.id) // get the discord member
    let memberRoles = member.roles.cache.map(r => r.name === "Dead" ? ["892046206698680390", "892046205780131891"] : r.id).join(",").split(",") // get the roles, and replace the dead role with alive
    await dayChat.send(`${getEmoji("revived", client)} The Medium revived **${players.indexOf(guy.id)+1} ${guy.username} (${getEmoji(guy.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${guy.role})**`) // sends a message in day chat
    await member.roles.set(memberRoles)
      
  }

}