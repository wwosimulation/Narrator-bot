const db = require("quick.db")
const { ids } = require("../../config")
const gamewarns = require("../../schemas/gamewarns")

module.exports = {
    name: "flee",
    description: "Flee from the game!",
    usage: `${process.env.PREFIX}flee [player]`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.member.permissions.has("MANAGE_CHANNELS")) {
            if (args[0]) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (guy) {
                    let role = db.get(`role_${guy.id}`)
                    db.set(`fled_${guy.id}`, true)
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    day.send("**" + guy.nickname + " " + guy.user.username + " (" + role + ")** has fled from the village!")
                    guy.roles.add(ids.dead)
                    guy.roles.remove(ids.alive)
                }
            }
        } else if (message.channel.name.includes("priv") || message.channel.name == "day-chat") {
            if (!message.member.roles.cache.has(ids.alive)) return
            let row = { type: 1, components: [{ type: 2, style: 3, label: "Flee", custom_id: "flee" }, { type: 2, style: 4, label: "Cancel", custom_id: "cancel" }] }
            message.channel.send({ embeds: [{ color: 0xa84300, title: "Are you sure you want to flee from the game?", description: "You will get a game warn if you flee from the game." }], components: [row] }).then((msg) => {
                const collector = msg.createMessageComponentCollector({ idle: 15000 })
                collector.on("collect", async (interaction) => {
                    if (interaction.user.id !== message.author.id) return interaction.reply({ content: "This is not your flee message. Don't try to trick me!", ephemeral: true })
                    if (interaction.customId === "flee") {
                        interaction.reply("Fleeing...")
                        db.set(`fled_${message.author.id}`, true)
                        let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                        let role = await db.fetch(`role_${message.author.id}`)
                        day.send("**" + message.member.nickname + " " + message.author.username + " (" + role + ")** has fled from village!")
                        message.member.roles.add(ids.dead)
                        message.member.roles.remove(ids.alive)

                        let warn = await gamewarns.create({ user: message.author.id, reason: "Fled from a game", gamecode: db.get("gameCode") })
                        let embed = {
                            title: `You have received a gamewarn! Case: ${warn.index}`,
                            description: `You have received a gamewarn in ${message.guild.name}!\n` +
                                `**Reason:** ${warn.reason}\n` +
                                `**Gamecode:** ${warn.gamecode}\n` +
                                `**Date:** <t:${(Date.now() / 1000).toFixed()}:f>\n\n` +
                                `If you think this gamewarn was given by accident please [open a ticket](https://discord.com/channels/465795320526274561/606230556832825481/905800163069665280) in [#${client.channels.resolve("606230556832825481").name}](https://discord.com/channels/465795320526274561/606230556832825481).\n` +
                                `**Warn ID:** ${warn.index}`,
                            color: 0x992d22,
                        }
                        try {
                            await message.author.send({ embeds: [embed] })
                        } catch (err) {
                            interaction.editReply({ embeds: [embed] })
                            message.channel.send("Unable to send direct message.")
                        }
                        client.emit("gamebanned", message.author)
                    } else {
                        interaction.reply("Successfully canceled!")
                    }
                    collector.stop()
                })
                collector.on("end", (collected) => {
                    row.components.forEach(btn => { btn.disabled = true })
                    msg.edit({ components: [row] })
                })
            })
        }
    },
}
