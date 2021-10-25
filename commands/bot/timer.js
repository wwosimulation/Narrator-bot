const ms = require("ms")

module.exports = {
    name: "timer",
    descriprion: "",
    usage: `${process.env.PREFIX}timer <time...>`,
    run: async (message, args, client) => {
        if (args.length < 1) return message.channel.send(message.l10n("timeNoDuration"))
        let timer = ms(args.join(" ").toString())
        if (!timer) return message.channel.send(message.l10n("timeInvalidFormat"))
        message.channel.send(message.l10n("timeSet", { time: `${ms(timer)}` }))

        setTimeout(function () {
            message.channel.send(message.l10n("timeIsUp", { ping: `${message.author}` }))
        }, timer) //.catch(e => message.channel.send(`Error: ${e.message}`))
    },
}
