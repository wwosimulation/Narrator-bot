const ms = require("ms")

module.exports = {
    name: "timer",
    run: async (message, args) => {
        if (args.length < 1) return message.channel.send("How long it should be? You forgot to state the duration.")
        let timer = ms(args.join(" ").toString())
        if (!timer) return message.channel.send("Invalid time format!")
        message.channel.send(`Setting the time for ${ms(timer)}`)

        setTimeout(function () {
            message.channel.send(`Time is up! ${message.author}`)
        }, timer) //.catch(e => message.channel.send(`Error: ${e.message}`))
    },
}
