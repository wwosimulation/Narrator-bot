const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("quick.db")
const { ids } = require("../../config")
const gamewarns = require("../../schemas/gamewarns")

module.exports = {
    name: "suicide",
    description: "Kill yourself... In game! NOT IN REAL LIFE!",
    usage: `${process.env.PREFIX}suicide [player]`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.member.permissions.has("MANAGE_CHANNELS")) {
            if (args[0]) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
                if (guy) {
                    let role = db.get(`role_${guy.id}`)
                    db.set(`suicided_${guy.id}`, true)
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    day.send("**" + guy.nickname + " " + guy.user.username + " (" + role + ")** has commited suicide!")
                    guy.roles.add(ids.dead)
                    guy.roles.remove(ids.alive)
                    message.reply({content: "Please use `/gamewarn add` to warn the user if necessary."})
                }
            }
        } else if (message.channel.name.includes("priv") || message.channel.name == "day-chat") {
            if (!message.member.roles.cache.has(ids.alive)) return
            let row = new MessageActionRow({ components: [new MessageButton({ style: "SUCCESS", label: "Suicide", customId: "suicide" }), new MessageButton({ style: "DANGER", label: "Cancel", customId: "cancel" })] })
            message.channel.send({ embeds: [new MessageEmbed({ color: "DARK_ORANGE", title: "Are you sure you want to commit suicide?", description: "You will get a game warn if you commit suicide now." })], components: [row] }).then((msg) => {
                const collector = msg.createMessageComponentCollector({ idle: 15000 })
                collector.on("collect", async (interaction) => {
                    if (interaction.user.id !== message.author.id) return interaction.reply({ content: "This is not your suicide message. Don't try to trick me!", ephemeral: true })
                    if (interaction.customId === "suicide") {
                        interaction.reply("Suiciding...")
                        db.set(`suicided_${message.author.id}`, true)
                        let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                        let role = await db.fetch(`role_${message.author.id}`)
                        day.send("**" + message.member.nickname + " " + message.author.username + " (" + role + ")** has commited suicide!")
                        message.member.roles.add(ids.dead)
                        message.member.roles.remove(ids.alive)

                        let warn = await gamewarns.create({user: message.author.id, reason: "Suiciding during a game", gamecode: db.get("gameCode")})
                        let embed = new MessageEmbed({title: `You have received a gamewarn! Case: ${warn.index}`, description: 
`You have received a gamewarn in ${message.guild.name}!
**Reason:** ${warn.reason}
**Gamecode:** ${warn.gamecode}
**Date:** <t:${(Date.now()/1000).toFixed()}:f>

If you think this gamewarn was given by accident please [open a ticket](https://discord.com/channels/465795320526274561/606230556832825481/905800163069665280) in [#${client.channels.resolve("606230556832825481").name}](https://discord.com/channels/465795320526274561/606230556832825481).
**Warn ID:** ${warn.index}`, color: "DARK_RED"})
                        try{
                            await message.author.send({embeds: [embed]})
                        } catch(err) {
                            interaction.editReply({embeds: [embed]})
                            message.channel.send("Unable to send direct message.")
                        }
                        client.emit("gamebanned", message.author)
                    } else {
                        interaction.reply("Successfully canceled!")
                    }
                    collector.stop()
                })
                collector.on("end", (collected) => {
                    let dead = new MessageActionRow().setComponents([row.components[0].setDisabled(), row.components[1].setDisabled()])
                    msg.edit({ components: [dead] })
                })
            })
        }
    },
}
