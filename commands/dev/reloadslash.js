const { ids } = require("../../config")

module.exports = {
    name: "reloadslash",
    description: "Loads slash commands, add them if they don't exist yet and overrides the permissions.",
    usage: `${process.env.PREFIX}reloadslash`,
    devOnly: true,
    run: async (message, args, client) => {
        let summary = { created: 0, updated: 0, deleted: 0, failed: 0 }
        async function deploy(com, command, guildId = null) {
            if (!com) {
                // Creating non existing commands
                await client.application.commands.create(command.command, guildId).then(() => {
                    console.log(`✅ Command ${command.command.name} was deployed!`);
                    summary.created++;
                }).catch(err => {
                    console.log(`❎ Error with deploying command ${command.command.name}!\n${err}`);
                    summary.failed++;
                });
            } else {
                // Updating existing commands
                if (!com.equals(command.command, true)) {
                    await client.application.commands.edit(com, command.command, guildId).then(() => {
                        console.log(`✅ Command ${command.command.name} was updated!`);
                        summary.updated++;
                    }).catch(err => {
                        console.log(`❎ Error with updating command ${command.command.name}!\n${err}`);
                        summary.failed++;
                    });
                }
            }
            return
        }

        try {
            let commands = await client.application.commands.fetch()
            // Deploy commands
            new Promise(async (resolve, reject) => {

                let promises = client.slashCommands.map(async command => {
                    let com = commands.find(c => c.name == command.command.name);
                    if (command.server) {
                        // create guild commands
                        let x = command.server.map(async server => {
                            com = (await client.application.commands.fetch({guildId: ids.server[server]})).find(c => c.name == command.command.name);
                            await deploy(com, command, ids.server[server])
                            return true;
                        })
                        await Promise.all(x)
                    } else {
                        // create global commands
                        await deploy(com, command)
                    }
                    return true;
                })
                await Promise.all(promises)
                resolve()
            }).finally(() => {
                message.channel.send(`Deployed ${summary.created} commands, updated ${summary.updated} commands, failed ${summary.failed} commands.\nKeep in mind that you have to manually set the perms for slash commands that are not meant for everyone.`)
            })
        } catch (err) {
            console.error
        }
    },
}
