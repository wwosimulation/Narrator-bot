const db = require("quick.db")

module.exports = {
    name: "blacklist",
    run: async (message, args, client) => {
        if (message.author.id != "552814709963751425") return 
        db.push(`blacklistss`, `/${args[0]}/`)
        let guy = message.guild.members.cache.get(args[0])
        message.channel.send(`${guy.user.tag} has been blacklisted!`)
    }
}