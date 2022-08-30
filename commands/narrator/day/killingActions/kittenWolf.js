const db = require("quick.db") // the database
const { getRole, getEmoji } = require("../../../../config") // functions

module.exports = async (client, guy) => {
    const guild = client.guilds.cache.get("890234659965898813") // the Wolvesville game server - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // the werewolves-chat channel - Object
    const wwVote = guild.channels.cache.find((c) => c.name === "ww-vote") // the ww-vote channel - Object
    const narrator = guild.roles.cache.find((r) => r.name === "Narrator")
    const mininarr = guild.roles.cache.find((r) => r.name === "Narrator Trainee")
    const players = db.get(`players`) || [] // an array of players id - Array<Snowflake>
    const player = db.get(`player_${guy}`) // get the object of the converted player - Object
    const channel = guild.channels.cache.get(player.channel) // get the private channel of the player - Object

    let previousRoles = player.allRoles || [player.role]
    previousRoles.push("Werewolf")
    db.set(`player_${guy}.allRoles`, previousRoles)

    await werewolvesChat.permissionOverwrites.create(guy, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
    })

    await wwVote.permissionOverwrites.create(guy, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
    })

    await channel.edit({ name: "priv-werewolf" }) // edit the channel name

    await channel.bulkDelete(100)

    await channel.send(getRole("werewolf").description).then(async (c) => {
        await c.pin()
        await c.channel.bulkDelete(1)
    }) // sends the description, pins the message and deletes the last message
    await channel.send(`<@${guy}>`).then((c) => setTimeout(() => c.delete(), 3000)) // pings the player and deletes the ping after 3 seconds

    db.set(`player_${guy}.role`, "Werewolf") // changes the player's role in the database
    db.set(`player_${guy}.team`, "Werewolf") // changes the player's team in the database

    // send a message to the Werewolves chat
    werewolvesChat.send(`${getEmoji("werewolf", client)} Player **${players.indexOf(guy) + 1} ${player.username}** has been converted into a Werewolf!`) // sends a message
}
