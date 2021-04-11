module.exports = {
    name: "say",
    run: async (message, args, client) => {
        if (!["552814709963751425", "439223656200273932", "406412325973786624", "620964363729371137"].includes(message.author.id)) return 
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
