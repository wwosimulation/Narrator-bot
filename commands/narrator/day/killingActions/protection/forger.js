const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../../../config") // functions

module.exports = async (client, guy) => {
  
  if (typeof guy !== "object") return false // makes sure if "guy" is an object, otherwise exit early
  
  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  
  let isProtected = false
  
  // check if the guy has a forger sheild
  if (guy.shield === true) {
    let channel = guild.channels.cache.get(guy.channel) // gets the channel
    isProtected = true // set isProtected to true
    db.delete(`player_${guy.id}.shield`) // removes the shield
    await channel.send(`${getEmoji("getshield", client)} You were attacked but your shield saved you!`) // sends a message to the attacked player
    await channel.send(`<@&${guild.roles.cache.find(r => r.name === "Alive")}>`) // pings the alive role
  }
  
  // return the isProtected value
  return isProtected 
  
}