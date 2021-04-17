const shuffle = require('shuffle-array') 


module.exports = {
  name: 'thisisaweirdname',
  run: async (message, args, client) => {
    shuffle(args)
    message.channel.send(args) 
  } 
} 