module.exports = {
    name: "bug",
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send("Stop. You're making your life worse")
        let t = ""
        if (message.attachments.size > 0) {
            message.attachments.forEach(a => t += a.url + '\n')
        } 
            let lol = client.guilds.cache.get(client.config.ids.logServer)
            
            lol.channels.cache.find(c => c.name === "ashishbotreportbug").send(args.join(' ') + `\n${t}`)
        
    }
}