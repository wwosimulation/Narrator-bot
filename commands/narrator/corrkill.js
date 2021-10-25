const { getEmoji } = require("../../config")
const ids = require("../../config/src/ids")

module.exports = {
    name: "corrkill",
    description: "Kill a player in corrupter's name.",
    usage: `${process.env.PREFIX}corrkill <player>`,
    gameOnly: true,
    narratorOnly: true,
    run: async (message, args, client) => {
        let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
        message.guild.channels.cache.find((x) => x.name == "day-chat").send(`${getEmoji("corrupt", client)} The Corruptor killed **${guy.nickname} ${guy.user.username}**!`)
        guy.roles.add(ids.dead)
        guy.roles.remove(ids.alive)
        guy.roles.add(ids.corrupted)
    },
}
