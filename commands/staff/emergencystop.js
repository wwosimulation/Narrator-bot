module.exports = {
  name: 'emergencystop', 
  aliases: ["es", "yesstop", "reboot"], 
  staffOnly: true,
  run: async (message, args, client) => {
    message.channel.send('Oh no! Looks like i am executing a bug that is unstoppable. Please wait while i reboot.') 
      client.user.setStatus("offline")
      require("node-cmd").run(`pm2 restart ${process.env.pm_id}`)
    
  }
  
} 
