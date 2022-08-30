const db = require("quick.db")
const { getEmoji } = require("../../../../config")

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const jailedChat = guild.channels.cache.find((c) => c.name === "jailed-chat")
    const wardenChat = guild.channels.cache.find((c) => c.name === "warden-jail")
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const jailers = alivePlayers.filter((p) => ["Jailer", "Warden"].includes(db.get(`player_${p}`).role)) // get the alive jailers array - Array<Snowflake>

    // loop through each jailer and warden
    for (let jailer of jailers) {
        let jail = db.get(`player_${jailer}`) // get the jailer or warden object - Object

        // check if the jailer is alive
        if (jail.status === "Alive") {
            // check if the jailer has selected a target
            if (jail.target) {
                if (jail.role === "Jailer") {
                    let guy = db.get(`player_${jail.target}`) // get the player to be jailed - Object
                    let channel = guild.channels.cache.get(guy.channel) // get their channel - Object

                    // check if the player is alive
                    if (guy.status === "Alive") {
                        // change the channel's permissions
                        channel.permissionOverwrites.edit(guy.id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })

                        // give access to jailedchat
                        jailedChat.permissionOverwrites.edit(guy.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })

                        // check if they belong to the Werewolf team
                        if (guy.team === "Werewolf" && guy.role !== "Werewolf Fan") {
                            // send the message
                            werewolvesChat.send(`Your werewolf teammate **${players.indexOf(player.id) + 1} ${player.username} (${getEmoji(guy.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${guy.role})** has been jailed by the Jailer!`)
                        }

                        channel.send(`You have been jailed by the Jailer! You can't do your actions for tonight! Head to <#${jailedChat.id}> to talk with the jailer!`) // send the message
                        db.set(`player_${guy.id}.jailed`, true) // set the jailed status to true
                    }
                } else {
                    let [guy1, guy2] = [db.get(`player_${jail.target[0]}`), db.get(`player_${jail.target[1]}`)] // get the players to be jailed - Object
                    let channel1 = guild.channels.cache.get(guy1.channel) // get their channel - Object
                    let channel2 = guild.channels.cache.get(guy2.channel) // get their channel - Object
                    let channel = guild.channels.cache.get(jail.channel) // get the warden's channel - Object

                    // check if the player is alive
                    if (guy1.status === "Alive" && guy2.status === "Alive") {
                        // change the channel's permissions
                        channel1.permissionOverwrites.edit(guy1.id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })

                        channel2.permissionOverwrites.edit(guy2.id, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })

                        // give access to wardenchat
                        wardenChat.permissionOverwrites.edit(guy1.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })

                        wardenChat.permissionOverwrites.edit(guy2.id, {
                            SEND_MESSAGES: true,
                            VIEW_CHANNEL: true,
                            READ_MESSAGE_HISTORY: true,
                        })

                        // check if they belong to the Werewolf team
                        if (guy1.team === "Werewolf" && guy1.role !== "Werewolf Fan") {
                            // send the message
                            werewolvesChat.send(`Your werewolf teammate **${players.indexOf(guy1.id) + 1} ${guy1.username} (${getEmoji(guy1.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${guy1.role})** has been jailed by the Warden!`)
                        }

                        if (guy2.team === "Werewolf" && guy2.role !== "Werewolf Fan") {
                            // send the message
                            werewolvesChat.send(`Your werewolf teammate **${players.indexOf(guy2.id) + 1} ${guy2.username} (${getEmoji(guy2.role?.toLowerCase()?.replace(/\s/g, "_"), client)} ${guy2.role})** has been jailed by the Warden!`)
                        }

                        channel1.send(`${getEmoji("warden_jail", client)} You have been jailed by the Warden! You can't do your actions for tonight! Head to <#${wardenChat.id}> to talk with your inmate!`) // send the messages
                        channel2.send(`${getEmoji("warden_jail", client)} You have been jailed by the Warden! You can't do your actions for tonight! Head to <#${wardenChat.id}> to talk with your inmate!`) // send the messages
                        channel.send(`${getEmoji("warden_jail", client)} **${jail.target.map((o) => `${players.indexOf(o) + 1} ${db.get(`player_${o}`)}`).join("** and **")}** have been jailed! You can hear them talk now.`) // send the message

                        db.set(`player_${guy1.id}.jailed`, true) // set the jailed status to true
                        db.set(`player_${guy2.id}.jailed`, true) // set the jailed status to true
                    } else {
                        channel.send(`${getEmoji("warden_jail", client)} One of your targets weren't alive anymore so you failed to jail anyone.`)
                        channel.send(`${guild.roles.cache.find((r) => r.name === "Alive")}`)
                    }
                }
            }
        }
    }
}
