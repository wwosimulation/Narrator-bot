const db = require("quick.db")
const Discord = require("discord.js")
const {fn} = require("../../config.js")

module.exports = {
  name: "quest",
  aliases: ["quests"],
  narratorOnly: true,
  run: async (message, args, client) => {
    if (args.length < 3) return message.channel.send("Invalid format! Use `+quest [user] [xp] [quest]`")

    let guy = fn.getUser(args[0], message)

    if (!guy) return message.channel.send(`Invalid member! Please use it as \`+quest [user] [xp] [quest]\`!`)

    if (isNaN(args[1])) return message.channel.send(`Bruh, \`${args[1]}\` is not a number...`)

    db.add(`xp_${guy.id}`, parseInt(args[1]))

    args.splice(0, 2)

    let questchan = message.guild.channels.cache.find((c) => c.name === "paid-quest")

    questchan.send(new Discord.MessageEmbed().setTitle("Quest Claimed").setDescription(`${guy} claimed ${args.join(" ")}!`))

    fn.updateXP(guy.id, client)
  },
}
