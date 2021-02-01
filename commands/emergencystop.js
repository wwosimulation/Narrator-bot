module.exports = {
  name: 'emergencystop', 
  aliases: ["es", "yesstop", "reboot"], 
  run: async (message, args, client) => {
    let nar = message.guild.roles.cache.find(r => r.name === "Narrator")
    if (message.member.roles.cache.has(nar.id) || message.author.id == "439223656200273932") {
      message.channel.send('Oh no! Looks like i am executing a bug that is unstoppable. Please wait while i reboot.') 
      client.user.setStatus("offline")
      require("node-cmd").run(`pm2 restart ${process.env.pm_id}`)
    } 
  }
  
} 
