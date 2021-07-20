const ms = require("ms")

module.exports = {
    name: "timer",
    descriprion: "",
    usage: `${process.env.PREFIX}timer <time>`,
    run: async (message, args) => {
        if (args.length < 1) return message.channel.send(message.i10n("timeNoDuration"))
        let timer = ms(args.join(" ").toString())
        if (!timer) return message.channel.send(message.i10n("timeInvalidFormat"))
        message.channel.send(message.i10n("timeSet", { time: `${ms(timer)}` }))

        setTimeout(function () {
            message.channel.send(message.i10n("timeIsUp", { ping: `${message.author}` }))
        }, timer) //.catch(e => message.channel.send(`Error: ${e.message}`))
    },
}
