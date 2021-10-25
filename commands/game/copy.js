const db = require("quick.db")

module.exports = {
    name: "copy",
    description: "As doppelganger you can copy another player's role. Use this command to perform the ritual.",
    usage: `${process.env.PREFIX}copy <player>`,
    gameOnly: true,
    run: async (message, args) => {
        if (message.channel.name == "priv-doppelganger") {
            const gamePhase = db.get(`gamePhase`)
            const night = Math.floor(gamePhase / 3) + 1 || 1
            const alive = message.guild.roles.cache.find((r) => r.name === "Alive")

            if (night != 1 || gamePhase % 3 != 0) return message.channel.send("You can only copy on the first night!")

            if (!args[0]) return message.channel.send("Who you want to copy? Insert the player number next time.")

            let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((m) => m.user.username === args.join(" ")) || message.guild.members.cache.find((m) => m.user.tag === args.join(" "))

            if (!guy || !guy.roles.cache.has(alive.id)) return message.reply("The player is not in game! Mention the correct player number.")

            db.set(`copy_${message.channel.id}`, guy.nickname)
            message.react("787582587593162762")
        }
    },
}
