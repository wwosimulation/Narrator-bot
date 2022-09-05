const { ids } = require("../../config")

module.exports = {
    name: "nuke",
    description: "Deletes all or specific slash commands of the bot you are using.",
    usage: `${process.env.PREFIX}nuke (here|all|global) [commandNames...]`,
    devOnly: true,
    guildOnly: true,
    run: async (message, args, client) => {
        var answer = "**Following actions were executed:**\n"

        async function bulkDelete(guildId = null) {
            await client.application.commands.set([], guildId).then((coll) => {
                answer += `Bulk delete - ${guildId ? client.guilds.resolve(guildId).name : "global"}`
            })
        }

        async function deleteCommand(commandName, guildId = null) {
            let command = guildId ? (await client.application.commands.fetch({ guildId: guildId })).find(c => c.name == commandName) : (await client.application.commands.fetch()).find(c => c.name == commandName)
            await command?.delete()?.then((cmd) => {
                answer += `Delete ${cmd.name} - ${guildId ? client.guilds.resolve(guildId).name : "global"}\n`
            })
        }

        if (args[0] == "here") {
            if (args.length == 1) await bulkDelete(message.guild.id)
            else {
                args.shift()
                let promises = await args.map(async (commandName) => {
                    await deleteCommand(commandName, message.guild.id)
                    return null
                })
                await Promise.all(promises)
            }

        } else if (args[0] == "global") {
            if (args.length == 1) await bulkDelete()
            else {
                args.shift()
                let promises = await args.map(async (commandName) => {
                    await deleteCommand(commandName)
                    return null
                })
                await Promise.all(promises)
            }
        } else if (args[0] == "all") {
            if (args.length == 1) {
                await bulkDelete()
                let promises = await client.guilds.cache.filter(g => g.commands.size > 0).map(async g => {
                    await bulkDelete(g.id)
                    return null
                })
                await Promise.all(promises)
            } else {
                args.shift()
                await args.map(async (commandName) => {
                    await deleteCommand(commandName)
                    let promises = await client.guilds.cache.filter(g => g.commands.size > 0).map(async g => {
                        await deleteCommand(commandName, g.id)
                        return null
                    })
                    await Promise.all(promises)
                })
            }
        }

        message.channel.send(answer)
    },
}
