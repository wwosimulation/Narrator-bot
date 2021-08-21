module.exports = {
    name: "reverse",
    description: "Use this command to reverse sentences or words.",
    usage: `${process.env.PREFIX}reverse`,
    run: async (message, args, client) => {
        if (!args[0]) return message.channel.send(`Please use the correct command format (${process.env.PREFIX}reverse <sentence>) `)
        const newargs = args.join(" ")
        const msg = newargs.split("").reverse().join("")

        message.channel.send(msg)
    },
}
