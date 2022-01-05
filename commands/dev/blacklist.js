const db = require("quick.db")

module.exports = {
    name: "blacklist",
    description: "Blacklist a member.",
    usage: `${process.env.PREFIX}blacklist <user>`,
    run: async (message, args, client) => {
        if (message.author.id != "517335997172809728") return
        db.push(`blacklistss`, `/${args[0]}/`)
        let guy = message.guild.members.cache.get(args[0])
        message.channel.send(`${guy.user.tag} has been blacklisted!`)
    },
}
