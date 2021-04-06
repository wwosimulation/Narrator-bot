module.exports = {
    name: "say",
    run: async (message, args, client) => {
        if (!["552814709963751425", "439223656200273932", "406412325973786624", "620964363729371137"].includes(message.author.id)) return 
         message.delete()
         let idsendreply = args[0]
         let reply = ""
         let channel = await client.channels.cache.get(idsendreply).catch(e=>{})
         if(!channel) {
            reply = await message.channel.messages.fetch(idsendreply).catch(e=>{})
            if(reply) {
               args.shift()
               return reply.inlineReply(args.join(''))
            } else {
               return message.channel.send(args.join())
            }
         } else {
            args.shift()
            channel.send(args.join())
         }
        
    }
}
