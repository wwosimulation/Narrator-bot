module.exports = {
  name: 'cs',
  description: 'Pings the alive role and asks which gamemode (Classic or Sandbox)', 
  run: async (message, args, client) => {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return
    let alive = message.guild.roles.cache.find(r => r.name === 'Alive')
    message.channel.bulkDelete(1)    
		let m = await message.channel.send(`${alive} Classic or Sandbox?`) 
    await m.react('1️⃣') 
    await m.react('2️⃣') 
  } 
} 