const { messageEmbed } = require("discord.js")
const players = require("../../schemas/players")

module.exports = {
    name: "register",
    description: "Register your invite link to be able to get the Invite badge.",
    usage: `${process.env.PREFIX}register <invite>`,
    run: async (message, args, client) => {
        if (!args) message.channel.send({ content: `Invalid format! Use \`${this.usage}\`` })
        let code = ""
        let sim = client.guilds.get("simID")

        if (args[0].startsWith("https://discord.gg/")) {
            if (sim.invites.cache.has(args[0])) {
                if (!sim.invites.cache.get([args[0]]).inviter === message.author) return message.channel.send({ content: "It seems like this invite was not created by you. Please use your own invite!" })
                code = args[0].split("https://discord.gg/")[1]
                await players.findOneAndUpdate({ user: message.author.id }, { $set: { "badges.invite.link": code } }, { upsert: true })
            } else {
                message.channel.send({ content: `${args[0]} is not an invite code from this server!` })
            }
        }
    },
}
