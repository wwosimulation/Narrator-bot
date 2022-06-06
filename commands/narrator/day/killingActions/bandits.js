const db = require("quick.db") // database
const { getRole, getEmoji } = require("../../../config") // functions
const doctor = require("./protection/doctor.js") // doctor protection
const beastHunter = require("./protection/beastHunter.js") // beast hunter protection
const witch = require("./protection/witch.js") // witch protection
const jailer = require("./protection/jailer.js") // jailer protection
const redLady = require("./protection/redLady.js") // red lady protection
const bodyguard = require("./protection/bodyguard.js") // bodyguard protection
const toughGuy = require("./protection/toughGuy.js") // tough guy protection
const forger = require("./protection/forger.js") // forger protection
const ghostLady = require("./protection/ghostLady.js") // ghost lady protection

async function getProtections(client, guy, attacker) {
    
  let getResult;
  
  // check if the player they are attacking is healed by the beast hunter
  getResult = await beastHunter(client, guy, attacker) // checks if a beast hunter has a trap on them
  if (getResult === true) return false // exits early if a beast hunter DOES have a trap on them

  // check if the player they are attacking is jailed
  getResult = await jailer(client, guy, attacker) // checks if they are jailed
  if (getResult === true) return false // exits early if they are jailed

  // check if the player they are attacking is healed by the ghost lady
  getResult = await ghostLady(client, guy, attacker) // checks if a ghost lady is protecting them
  if (getResult === true) return false // exits early if a ghost lady IS protecting them

  // check if the player they are attacking is healed by the doctor
  getResult = await doctor(client, guy, attacker) // checks if a doctor is protecting them
  if (getResult === true) return false // exits early if a doctor IS protecting them

  // check if the player they are attacking is healed by the witch
  getResult = await witch(client, guy, attacker) // checks if a witch is protecting them
  if (getResult === true) return false // exits early if a witch IS protecting them

  // check if the player they are attacking is healed by the bodyguard
  getResult = await bodyguard(client, guy, attacker) // checks if a bodyguard is protecting them
  if (getResult === true) return false // exits early if a bodyguard IS protecting them

  // check if getResult isn't an object
    if (typeof getResult !== "object") {

    // check if the player they are attacking is healed by the tough guy
    getResult = await toughGuy(client, guy, attacker) // checks if a tough guy is protecting them
    if (getResult === true) return false // exits early if a tough guy IS protecting them

    // check if the player they are attacking is a red lady that got away visiting someone else
    getResult = await redLady(client, guy, attacker) // checks if the red lady is not home
    if (getResult === true) return false // exits early if the red lady IS not home

    // check if the player they are protecting has the forger's sheild
    getResult = await forger(client, guy) // checks if the player has the forger's sheild
    if (getResult === true) return false // exits early if the player DOES have the forger's sheild
  }

  return typeof getResult === "object" ? getResult : guy // looks like there were no protections 

}

module.exports = async (client) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
  const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // get the werewolves channel - Object
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const alivePlayers = players.filter(p => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
  const deadPlayers = players.filter(p => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
  const bandits = alivePlayers.filter(p => db.get(`player_${p}`).role === "Bandit") // get the alive Bandits array - Array<Snowflake>
  const headhunterTargets = alivePlayers.filter(d => db.get(`player_${d}`).role === "Headhunter").map(d => db.get(`player_${d}`).target)
  const phase = db.get(`gamePhase`)
  
  // loop through each bandit
  for (let bandit of bandits) {
    
    let attacker = db.get(`player_${bandit}`) // the attacker object - Object
    
    // check if the bandit selected someone
    if (attacker.accomplice) {
        
      // delete the accomplice database
      db.delete(`player_${attacker.id}.accomplice`) // don't worry, this won't affect the current accomplice
      
      let guy = db.get(`player_${attacker.accomplice}`) // get's the current guy object
      
      // check if the bandit's target is alive
      if (guy.status === "Alive") {
        
        // check if they are not village aligned 
        if ((guy.team !== "Village" && !["Fool", "Headhunter"].includes(guy.role) && (guy.role === "Accomplice" && guy.convertedAt !== phase )) || typeof guy.sected === "string" || guy.bitten === true || headhunterTargets.includes(guy.id)) {
        
          // check for any protections
          let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>

          // check if the result type is an object - indicating that there were no protections
          if (typeof result === "object") {

            // send a message to the day chat and make the player dead
            db.set(`player_${result.id}.status`, "Dead")          
            client.emit("playerKilled", db.get(`player_${result.id}`), attacker)
            let attackedPlayer = await guild.members.fetch(result.id) // fetch the discord member - Object
            let attackedPlayerRoles = attackedPlayer.roles.cache.map(r => r.name === "Alive" ? "892046207428476989" : r.id) // get all the roles and replace the Alive role with Dead.
            let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object
            await channel.send(`${getEmoji("kidnap", client)} Player **${players.indexOf(result.id)+1} ${result.username}** didn't want to be your accomplice, so you killed them instead.`)
            await dayChat.send(`${getEmoji("thieve", client)} Bandits killed **${players.indexOf(result.id)+1} ${result.username} (${getEmoji(result.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${result.role})**!`)
            await attackedPlayer.roles.set(attackedPlayerRoles) // removes the Alive and adds the Dead discord role

          } else { // otherwise they were protected

            let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object
            await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(guy.id)+1} ${guy.username}** could not be converted!`) // sends an error message
            await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player in the channel

          }
        
        } else { // looks like they are village aligned
        
          // try converting them
          let result = await getProtections(client, guy, attacker) // returns - Promise<Object|Boolean>
          
          // check if the result type is an object - indicating that there were no protections
          if (typeof result === "object" && guy.role !== "Accomplice") {
            
            // convert the player then
            let channel = guild.channels.cache.get(result.channel)
            let banditChannel = guild.channels.cache.get(attacker.banditChannel)
             
            const newChannel = await guild.channels.create("priv-accomplice", { 
                parent: "892046231516368906", // the category id
                position: channel.position - 1 // the same position where the channel is
            })

            // give permissions to the converted player
            await newChannel.permissionOverwrites.create(result.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true
            })

            // disable permissions for the everyone role
            await newChannel.permissionOverwrites.create(guild.id, {
                VIEW_CHANNEL: false,
            })

            // give permissions to narrator
            await newChannel.permissionOverwrites.create(narrator.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
                MANAGE_CHANNELS: true,
                MENTION_EVERYONE: true,
                ATTACH_FILES: true,
            })

            // give permissions to narrator trainee
            await newChannel.permissionOverwrites.create(mininarr.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
                MANAGE_CHANNELS: true,
                MENTION_EVERYONE: true,
                ATTACH_FILES: true,
            })

            await banditChannel.permissionOverwrites.create(guy.id, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true
            })

            await channel.delete() // delete the original channel

            await newChannel.send(getRole("accomplice").description)
            .then(c => { await c.pin() ; await c.channel.bulkDelete(1) }) // sends the description, pins the message and deletes the last message
            await newChannel.send(`<@${result.id}>`)
            .then(c => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds

            db.set(`player_${result.id}.role`, "Accomplice") // changes the player's role in the database
            db.set(`player_${result.id}.team`, "Bandits") // changes the player's team in the database
            db.set(`player_${result.id}.channel`, newChannel.id) // changes the player's channel in the database
            db.set(`player_${result.id}.bandit`, attacker.id) // set's the bandit who converted this player
            db.set(`player_${result.id}.convertedAt`, phase) // set when this player was converted
              
            let allAccomplices = db.get(`player_${attacker.id}.accomplices`) || [] // gets all the accomplices
            allAccomplices.push(result.id) // push the player into the array
            db.set(`player_${attacker.id}.accomplices`, allAccomplices) // set the database

            // send a message to the bandits chat
            await banditChannel.send(`${getEmoji("kidnap", client)} Player **${players.indexOf(result.id)+1} ${result.username} (${getEmoji(result.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${result.role})** has been converted into an Accomplice! Together, you can kill players.`) // sends a message 
  
          
          } else { // otherwise they were protected
            
            let channel = guild.channels.cache.get(attacker.channel) // get the channel object - Object
            await channel.send(`${getEmoji("guard", client)} Player **${players.indexOf(result.id)+1} ${result.username}** could not be converted!`) // sends an error message
            await channel.send(`${guild.roles.cache.find(r => r.name === "Alive")}`) // pings the player in the channel
          
          }
        
        }
        
      }
      
    }
    
    
  }
  
  return true // exit early
  
}