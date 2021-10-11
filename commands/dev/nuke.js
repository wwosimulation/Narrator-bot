const { ids } = require("../../config")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "nuke",
    description: "Deletes all or specific slash commands of the bot you are using.",
    usage: `${process.env.PREFIX}nuke [(here) <commands...>]`,
    run: async (message, args, client) => {
        if (!message.member.roles.cache.has("859099415515627540") && !message.member.roles.cache.has("606123616228343812")) return message.reply({ content: "You are missing permissions to do that!" })
        const s = ["sim", "game"]
        var answer = "**Following actions were executed:**\n"
        /*let skiped = []
        if (args.length !== 0) {
            if (args[0] === "here" && args[1]) {
                let cmdManager = message.guild.commands
                args.slice(1).forEach((arg) => {
                    // Nuking command IDs and names
                    if (cmdManager.cache.has(arg)) {
                        cmdManager.cache
                            .get(arg)
                            .delete()
                            .then((cmd) => {
                                return (answer = answer + `Delete \`${cmd.name}\` (\`${cmd.id}\`, \`${cmd.guild.name}\`)\n`)
                            })
                    } else if (cmdManager.cache.find((cmd) => cmd.name === arg)) {
                        cmdManager.cache
                            .find((cmd) => cmd.name === arg)
                            .delete()
                            .then((cmd) => {
                                return (answer = answer + `Delete \`${cmd.name}\` (\`${cmd.id}\`, \`${cmd.guild.name}\`)\n`)
                            })
                    } else skiped.push(arg)
                })
            } else {
                // Seaching in all servers
                args.forEach((arg) => {
                    // Nuking one server
                    if (s.includes(arg)) {
                        client.guilds.fetch(ids.server[arg]).then((server) => {
                            server.commands.set([])
                            return answer = answer + `Bulk delete of server: \`${server.name}\`\n`
                        })
                    }
                    // Nuking command IDs and names
                    s.forEach((ser) => {
                        if (client.guilds.resolve(ids.server[ser]).commands.cache.has(arg)) {
                            client.guilds
                                .resolve(ids.server[ser])
                                .commands.cache.get(arg)
                                .delete()
                                .then((cmd) => {
                                    answer = answer + `ID delete \`${cmd.name}\` (\`${cmd.id}\`, \`${cmd.guild.name}\`)\n`
                                })
                            return
                        } else if (client.guilds.resolve(ids.server[ser]).commands.cache.find((cmd) => cmd.name === arg) /*.size == 1*\/) {
                            client.guilds
                                .resolve(ids.server[ser])
                                .commands.cache.find((cmd) => cmd.name === arg)
                                .delete()
                                .then((cmd) => {
                                    answer = answer + `Name delete \`${cmd.name}\` (\`${cmd.id}\`, \`${cmd.guild.name}\`)\n`
                                })
                            return
                        } else skiped.push(arg)
                    })
                })
            }
            if (skiped.length !== 0) answer = answer + `\n**Following arguments couln't be resolved:**\n${skiped.map((element) => `\`${element}\``).join(" ")}\nValid CommandResolvables are \`commandID\`, \`commandName\`, \`sim\` and \`game\`!\nUse \`${process.env.PREFIX}nuke here <commands...>\` to delete commands in the current server only.`
            return await message.channel.send({ embeds: [new MessageEmbed().setDescription(answer).setColor(0x7419b4).setThumbnail(client.user.avatarURL())] })
        } else {*/
            client.guilds.cache
                .filter((guild) => guild.id === ids.server.sim || guild.id === ids.server.game)
                .each((server) => {
                    server.commands.set([])
                    answer = answer + `Bulk delete of server: \`${server.name}\`\n`
                })
            answer = answer + `**The servers have the following count of slash commands:**\nSim: \`${client.guilds.resolve(ids.server.sim).commands.cache.size}\`\nGame: \`${client.guilds.resolve(ids.server.game).commands.cache.size}\``
            return await message.channel.send({ embeds: [new MessageEmbed().setDescription(answer).setColor(0x7419b4).setThumbnail(client.user.avatarURL())] })
        //}
    },
}
