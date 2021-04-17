module.exports = {
  name: "am2",
  narratorOnly: true,
  run: async (message, args, client) => {
    let amount = parseInt(args[0])
    
    if (!amount) return message.reply("Inavlid Amount! Usage `+am2 <amount> <all players>`")

    for (let i = 1 ; i < args.length ; i++) {
      let guy = message.guild.members.cache.find(m => m.nickname === args[i]) || message.guild.members.cache.find(m => m.id === args[i]) || message.guild.members.cache.find(m => m.user.username === args[i]) || message.guild.members.cache.find(m => m.user.tag === args[i])
      if (!guy) return message.channel.send("Player with the nickname" + args[i] + " was not found")
    }

    for (let i = 1 ; i < args.length ; i++) {
      let guy = message.guild.members.cache.find(m => m.nickname === args[i]) || message.guild.members.cache.find(m => m.id === args[i]) || message.guild.members.cache.find(m => m.user.username === args[i]) || message.guild.members.cache.find(m => m.user.tag === args[i])
      message.channel.send(`-am ${guy.id} ${amount}`)
    }

  }
}
