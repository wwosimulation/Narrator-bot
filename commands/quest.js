const db = require("quick.db")
const Discord = require("discord.js")

module.exports = {
  name: "quest",
  aliases: ["quests"],
  run: async (message, args, client) => {
      
    if (message.guild.id != "465795320526274561") return;
    
    let narrator = message.guild.roles.cache.find(r => r.name === "Game Narrator")
    let mininarr = message.guild.roles.cache.find(r => r.name === "Mini Narrator")
    
    if (args.length < 3) return message.channel.send("Bruh. How do you expect me to do this if the arguments are not sufficent? I am a Bot, not a Mind Reader.")
    
    let guy = message.guild.members.cache.find(c => c.user.username.startsWith(args[0])) || message.guild.members.cache.find(c => c.user.tag.startsWith(args[0])) || message.guild.members.cache.find(c => c.nickname.startsWith(args[0])) || message.guild.members.cache.get(args[0]) || message.mentions.members.first()
  
    if (!guy) return message.channel.send(`Invalid member! Please use it as \`+quest [user] [xp] [quest]\`!`)
    
    if (isNaN(args[1])) return message.channel.send(`Bruh, \`${args[1]}\` is not a number...`)
    
    db.add(`xp_${guy.id}`, parseInt(args[1]))
    
    args.splice(0, 2)
    
    let questchan = message.guild.channels.cache.find(c => c.name === "paid-quest")
    
    questchan.send(
      new Discord.MessageEmbed()
      .setTitle("Quest Claimed")
      .setDescription(`${guy} claimed ${args.join(" ")}!`)
    )
    
    client.commands.get("updatexp").run(guy.id)
    
  }
}
