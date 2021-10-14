const db = require("quick.db")
module.exports = {
    name: "progterror",
    usage: `${process.env.PREFIX}progterror <channelID> <player>`,
    gameOnly: true,
    narratorOnly: true,
    run: (message, args, client) => {
        let guy = message.guild.members.cache.find((m) => m.nickname === args[1]) || message.guild.members.cache.find((m) => m.id === args[1]) || message.guild.members.cache.find((m) => m.user.username === args[1]) || message.guild.members.cache.find((m) => m.user.tag === args[1])
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        let channel_id = args[0]
        let day = Math.floor(db.get(`gamePhase`) / 3) + 1
        if (!guy || !channel_id) return message.channel.send({ content: `Invalid arguments.\nUse \`${this.usage}\`` })
        dayChat.send({ content: `**${guy.nickname + " " + guy.user.username || guy}** won't be able to vote anymore from tomorrow on.` })
        if (day == "0") return message.channel.send({ content: "Please check the votes manually. I don't know which day we have." })
        db.set(`terror_${channel_id}`, { day: day, guy: guy.nickname })
    },
}
