const Discord = require("discord.js")
const db = require("quick.db")
const shuffle = require("shuffle-array")
const config = require("../../config.js")
const fs = require("fs")

module.exports = {
    name: "reload",
    run: async (message, args, client) => {
        if (!["439223656200273932"].includes(message.author.id)) return

        let command = args[0]
        if (!command) return await message.channel.send(`***Bruh***`)

        if (command.startsWith("/")) {
            command = args.join(" ")

            try {
                require(command)
            } catch (e) {
                message.channel.send(`\`${command}\` is not a valid path!`)
                return undefined
            }

            delete require.cache[require.resolve(command)]
            message.channel.send(`File \`${command}\` is ready to be used. Be sure to reload any commands that need this file to fully apply the changes.`)
        } else {
            let commandfile = client.commands.get(command) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command))
            if (!commandfile) return message.author.send("Unable to find that command.")
            client.commands.delete(command)

            delete require.cache[require.resolve(process.cwd() + `/commands/${commandfile.category}/${commandfile.name}`)]

            let props = require(process.cwd() + `/commands/${commandfile.category}/${commandfile.name}`)
            // console.log(`Reload: Command "${command}" loaded`);
            client.commands.set(props.name, props)

            message.channel.send(`Command \`${commandfile.name}\` successfully reloaded.`)
        }
    },
}
