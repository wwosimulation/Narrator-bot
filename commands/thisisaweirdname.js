const shuffle = require('shuffle-array') 


module.exports = {
  name: 'thisisaweirdname',
  run: async (message, args, client) => {
    let roles = []
    for (let i = 0;i<args.length;i++) {
      roles.push(args[i]) 
    }
    shuffle(roles)
    message.channel.send(roles) 
  } 
} 