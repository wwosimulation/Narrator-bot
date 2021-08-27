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
<<<<<<< HEAD
        if (args.length < 3) return message.channel.send("Invalid format! Use `+quest <user> <xp> <quest>`")

        let guy = fn.getUser(args[0], message)
        if (!guy) return message.channel.send(`Invalid member! Please use it as \`+quest <user> <xp> <quest>\`!`)
=======
        if (args.length < 3) return message.channel.send(message.i10n("questFormatInvalid"))

        let guy = fn.getUser(args[0], message)
        if (!guy) return message.channel.send(message.i10n("userInvalid", {user: args[0]}))
>>>>>>> 31694f1203063b079222a5132c68c3e316757018
        let data = players.findOne({ user: guy.id })

        if (isNaN(args[1])) return message.channel.send(message.i10n("invalidAmount", {amount: args[1]}))

        data.xp += parseInt(args[1])
        data.save()

        args.splice(0, 2)

        let questchan = message.guild.channels.cache.find((c) => c.name === "paid-quest")
        let embed = new Discord.MessageEmbed().setTitle("Quest Claimed").setDescription(`${guy} claimed ${args.join(" ")}!`)

        questchan.send({ content: `${guy}`, embeds: [embed] })

        fn.updateXP(guy.id, client)
    },
}
