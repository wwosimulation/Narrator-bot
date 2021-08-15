module.exports = {
    name: "botowner",
    description: "Adds/Removes the `botowner` role to/from Shadow.",
    usage: `${process.env.PREFIX}botowner`,
    gameOnly: true,
    run: async (message, args, client) => {
        if (!["439223656200273932"].includes(message.author.id)) return
        message.delete()
        if (message.member.roles.cache.has("536217490334810122")) return message.member.roles.remove("536217490334810122")
        message.member.roles.add("536217490334810122")
    },
}
