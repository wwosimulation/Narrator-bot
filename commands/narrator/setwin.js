const db = require("quick.db")
module.exports = {
    name: "setwin",
    description: "End the game and announce the winner.",
    usage: `${process.env.PREFIX}setwin <winner...>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        db.set(`winner`, args.join(" "))
        message.channel.send("Done!")
        db.set(`gamePhase`, -10)
        db.set(`commandEnabled`, "yes")
        message.guild.channels.cache.find((x) => x.name == "day-chat").send(`Game over! ${args.join(" ")} has won!`)
    },
}
