module.exports = {
    name: "say",
    run: async (message, args, client) => {
        if (message.author.id == "552814709963751425") {
            message.delete()
            let content = ""
            let channel = message.mentions.channels.first() || message.channel
            let tetet = 1
            if (channel == message.channel) {
                tetet = 0
            }
            for (let i = 0 ; i < args.length - tetet; i++) {
                content += args[i] + " "
            }
            channel.send(content)
        }
    }
}