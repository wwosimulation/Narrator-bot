const db = require("quick.db")

module.exports = {
    name: "setgrtarget",
    description: "Set a target for the grave robbers.",
    usage: `${process.env.PREFIX}setgrtarget <player> <graveRobber_channelID>`,
    aliases: ["setgr"],
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")

        if (!args[1]) return message.channel.send("Please use the following: `+setgrtarget <user to be the target> <the channel id for grave robber>`")

        let guy = message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.id === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0])

        db.set(`target_${args[1]}`, guy.nickname)
        message.guild.channels.cache.get(args[1]).send("Your target is **" + guy.nickname + " " + guy.user.username + "**!")
    },
}
