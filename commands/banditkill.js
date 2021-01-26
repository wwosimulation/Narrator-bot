const db =require('quick.db') 

module.exports = {
  name: 'banditkill' ,
  run: async (message, args, client) => {
    if (message.member.hasPermission('MANAGE_CHANNELS')) {
      let dead = message.guild.roles.cache.find(r => r.name === 'Dead')
      let alive = message.guild.roles.cache.find(r => r.name === 'Alive')
      let day = message.guild.channels.cache.find(c => c.name === 'day-chat')
      let guy = message.guild.members.cache.find(m => m.nickname === args[0])
      let role = db.get(`role_${guy.id}`)
      day.send('The Bandits killed **' + args[0] + ' ' + guy.user.username + ' (' + role + ')**!') 
      guy.roles.add(dead.id)
      guy.roles.remove(alive.id) 
    } 
  } 
} 