module.exports = {
  name: "am2",
  run: async (message, args, client) => {
    
    if (message.guild.id != "472261911526768642") return; 
    let narrator = message.guild.roles.cache.find(r => r.name === "Narrator")

    let mininarr = message.guild.roles.cache.find(r => r.name === "Narrator Trainee")

    if (!message.member.roles.cache.has(narrator.id) && !message.member.roles.cache.has(mininarr.id)) return

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
