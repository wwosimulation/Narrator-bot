module.exports = {
  name: 'sjjsjs' ,
  run: async (message, args, client) => {
    if (message.member.hasPermission('KICK_MEMBERS')) 
    for (let i = 0;i<10;i++) {
      let a = message.guild.members.cache.find(m => m.nickname === args[0])
    	message.channel.send(`${a} wakey wakey`)
    } 
  } 
} 