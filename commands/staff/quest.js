const Discord = require("discord.js")
const { fn } = require("../../config")
const { players } = require("../../db.js")

module.exports = {
    name: "quest",
    description: "Add xp to a user after they finished a quest.",
    usage: `${process.env.PREFIX}quest <user> <xp> <quest...>`,
    aliases: ["quests"],
    narratorOnly: true,
    run: async (message, args, client) => {
        if (args.length < 3) return message.channel.send(message.l10n("questFormatInvalid"))

        let guy = fn.getUser(args[0], message)
        if (!guy) return message.channel.send(message.l10n("userInvalid", { user: args[0] }))
        let data = players.findOne({ user: guy.id })

        if (isNaN(args[1])) return message.channel.send(message.l10n("invalidAmount", { amount: args[1] }))

        data.xp += parseInt(args[1])
        data.save()

        args.splice(0, 2)

        let questchan = message.guild.channels.cache.find((c) => c.name === "paid-quest")
        let embed = new Discord.MessageEmbed({ title: "Quest Claimed", description: `${guy} claimed ${args.join(" ")}!` })

        questchan.send({ content: `${guy}`, embeds: [embed] })

        fn.updateXP(guy.id, client)
    },
}
