const db = require("quick.db")
const Discord = require("discord.js")
const { fn } = require("../../config.js")
const { players } = require("../../db.js")

module.exports = {
    name: "quest",
    aliases: ["quests"],
    narratorOnly: true,
    run: async (message, args, client) => {
        if (args.length < 3) return message.channel.send("Invalid format! Use `+quest [user] [xp] [quest]`")

        let guy = fn.getUser(args[0], message)
        if (!guy) return message.channel.send(`Invalid member! Please use it as \`+quest [user] [xp] [quest]\`!`)
        let data = players.findOne({ user: guy.id })

        if (isNaN(args[1])) return message.channel.send(`Bruh, \`${args[1]}\` is not a number...`)

        data.xp += parseInt(args[1])
        data.save()

        args.splice(0, 2)

        let questchan = message.guild.channels.cache.find((c) => c.name === "paid-quest")

        questchan.send(`${guy}`, new Discord.MessageEmbed().setTitle("Quest Claimed").setDescription(`${guy} claimed ${args.join(" ")}!`))

        fn.updateXP(guy.id, client)
    },
}
