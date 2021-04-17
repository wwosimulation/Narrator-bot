<<<<<<< HEAD:commands/narrator/say.js
const config = require("../../config.js")
=======
const config = require("../config.js")
>>>>>>> 8f5397f16adbf691a32c7f6ed0263bbc00b03dc0:commands/say.js

module.exports = {
    name: "say",
    run: async (message, args, client) => {
        if (!client.botAdmin(message.author.id) && !config.isNarrator(message.member)) return 
         message.delete()
         let idsendreply = args[0]
         let reply = ""
         let channel = await client.channels.cache.get(idsendreply)
         if(!channel) {
            let sf = parseInt(idsendreply)
            reply = sf ? await message.channel.messages.fetch(sf) : null
            if(reply) {
               args.shift()
               return await message.channel.messages.fetch(sf).then(m => m.inlineReply(args.join(' ')))
            } else {
               return message.channel.send(args.join(' '))
            }
         } else {
            args.shift()
            channel.send(args.join(' '))
         }
        
    }
}
