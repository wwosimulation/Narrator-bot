const config = require("../../config.js")
const db = require("quick.db")

module.exports = {
    name: "say",
    run: async (message, args, client) => {
        if (!client.botAdmin(message.author.id) && !config.fn.isNarrator(message.member)) return 
        if(db.get("settings.disableSay", true)) return
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
