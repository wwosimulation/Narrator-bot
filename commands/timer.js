const ms = require("ms")

module.exports = {
    name: "timer",
    run: async (message, args, client) => {
        if (args.length < 1) return message.channel.send("No. You have to state what time")
        let timer = ms(args.join(' ').toString())
        if (!timer) return message.channel.send("Invalid time format!")
        message.channel.send(`Setting the time for ${ms(timer)}`)
        //if (parseInt(timer)) return message.channel.send("Invalid time format!")
        setTimeout(function () {
            message.channel.send(`Time is up! ${message.author}`)
        }, timer)//.catch(e => message.channel.send(`Error: ${e.message}`))
    }
}