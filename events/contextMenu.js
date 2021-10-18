const db = require("quick.db")
const { ids } = require("../config")
module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isContextMenu()) return
        console.log(interaction)
        if (interaction.guild.id == ids.server.game) {
            let action = interaction.commandName
            let user = interaction.options.getMember("user")
            let daychat = interaction.guild.channels.cache.find((c) => c.name === "day-chat")

            if (user.roles.cache.has(ids.dead)) return interaction.reply("You cannot use this action on a Dead player!")

            if (action == "Kill") {
                if (!user.roles.cache.has(ids.alive)) return interaction.reply({ content: "You cannot use this action on spectators!", ephemeral: true })
                user.roles.add(ids.dead)
                user.roles.remove(ids.alive)
                daychat.send(`**${user.nickname} ${user.user.username} (${db.get(`role_${user.id}`)})** was killed by the narrator!`)
                interaction.reply({ content: "Done!", ephemeral: true })
            }

            if (action == "Spectate") {
                if (!user.roles.cache.has("691298564508352563")) {
                    user.setNickname("lazy spectatorz")
                } else {
                    user.setNickname(user.user.username)
                }
                user.roles.add(ids.spectator)
                if (user.roles.cache.has(ids.alive)) user.roles.remove(ids.alive) //alive
                interaction.reply({ content: "Done!", ephemeral: true })
                daychat.send(`${user.user.tag} is now spectating the game!`)
            }
        }
    })
}
