const { getEmoji } = require("../../../config")
const db = require("quick.db")

module.exports = async (client) => {

  // define all the variables
  const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
  const dayChat = guild.channels.cache.find(c => c.name === "day-chat") // get the day channel - Object
  const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
  const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")
  const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
  const graverobbers = players.filter(p => db.get(`player_${p}`).role === "Grave Robber")
  
  // loop through each grave robber
  for (const gr of graverobbers) {
  
    let graver = db.get(`player_${gr}`) // get the grave robber player - Object    
    let guy = db.get(`player_${graver.target}`) // get the player who the medium had selected to revive
    
    if (guy.status === "Alive" || guy.corrupted === true) continue; // if the player is alive or is corrupted, don't do anything and check for the next grave robber
    
    let channel = guild.channels.cache.get(graver.channel)
    
    // delete the target since they are getting converted
    db.delete(`player_${gr}.target`)
    
    // steal the player's role
    Object.entries(guy).forEach(entry => {
      
      // copy relevant info from the dead player
      if (!["username", "id", "status", "channel", "allRoles"].includes(entry[0])) {
        db.set(`player_${gr}.${entry[0]}`, entry[1])
      }
      
    })
    
    // set their previous roles into the database, for logs
    let previousRoles = db.get(`player_${gr}.allRoles`) || ["Grave Robber"] // get their previous roles, if any
    previousRoles.push(db.get(`player_${gr}.role`)) // push them to the array
    db.set(`player_${gr}.allRoles`, previousRoles) // set them into the database
     
    // create the channel
    const newChannel = await guild.channels.create(`priv-${guy.role.toLowerCase().replace(/\s/g, "-")}`, { 
        parent: "892046231516368906", // the category id
        position: channel.position - 1 // the same position where the channel is
    })

    // give permissions to the grave robber
    await newChannel.permissionOverwrites.create(graver.id, {
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
    
    await channel.delete() // delete the old channel
    
    await newChannel.send(getRole(guy.role.toLowerCase().replace(/\s/g, "-")).description)
    .then(c => { await c.pin() ; await c.channel.bulkDelete(1) }) // sends the description, pins the message and deletes the last message
    await newChannel.send(`<@${graver.id}>`)
    .then(c => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds
    
    if (guy.team === "Werewolf") {
      
      // give perms to the werewolves' chat 
      const wolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat")
      await wolvesChat.send(`${getEmoji("werewolf", client)} Player **${players.indexOf(graver.id)} ${graver.username} (${getEmoji("grave_robber", client)} Grave Robber)** was a grave robber that now took over the role of **${players.indexOf(guy.id)+1} ${guy.username} (${getEmoji(guy.role?.toLowerCase().replace(/\s/g, "_"))} ${guy.role})**! Welcome them to your team.`) // send a message
      await wolvesChat.send(`${guild.roles.cache.find(r => r.name === "Alive")}`)
    
    }
  
  }

}