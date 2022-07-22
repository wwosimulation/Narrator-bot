const db = require("quick.db") // the database
const { getEmoji, getRole } 

module.exports = async (client, guy) => {
  
  const guild = client.guilds.cache.get("890234659965898813") // the Wolvesville game server - Object
  const werewolvesChat = guild.channels.cache.find(c => c.name === "werewolves-chat") // the werewolves-chat channel - Object
  const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
  const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")
  const players = db.get(`players`) || [] // an array of players id - Array<Snowflake>
  const player = db.get(`players_${guy}`) // get the object of the converted player - Object
  const channel = guild.channels.cache.get(player.channel) // get the private channel of the player - Object
  
  // create a new werewolf channel for the converted player
  const newChannel = await guild.channels.create("priv-werewolf", { 
    parent: "892046231516368906", // the category id
    position: channel.position - 1 // the same position where the channel is
  })
  
  // give permissions to the converted player
  await newChannel.permissionOverwrites.create(guy, {
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
  
  await werewolvesChat.permissionOverwrites.create(guy.id, {
    SEND_MESSAGES: true,
    VIEW_CHANNEL: true,
    READ_MESSAGE_HISTORY: true
  })
  
  await channel.delete() // delete the original channel
  
  await newChannel.send(getRole("werewolf").description)
    .then(c => { await c.pin() ; await c.channel.bulkDelete(1) }) // sends the description, pins the message and deletes the last message
  await newChannel.send(`<@${guy}>`)
    .then(c => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds
  
  db.set(`player_${guy}.role`, "Werewolf") // changes the player's role in the database
  db.set(`player_${guy}.team`, "Werewolf") // changes the player's team in the database
  db.set(`player_${guy}.channel`, newChannel.id) // changes the player's channel in the database
  
  // send a message to the Werewolves chat
  werewolvesChat.send(`${getEmoji(client, "werewolf")} Player **${players.indexOf(guy)+1} ${player.username}** has been converted into a Werewolf!`) // sends a message 
  
  
}