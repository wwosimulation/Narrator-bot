module.exports = {
    name: "botowner",
    description: "Adds/Removes the `botowner` role to/from Hackante and Shadow.",
    usage: `${process.env.PREFIX}botowner`,
    gameOnly: true,
    run: async (message) => {
        if (!["439223656200273932", "517335997172809728"].includes(message.author.id)) return
        message.delete()
        if (message.member.roles.cache.has("892044956993212486")) return message.member.roles.remove("892044956993212486")
        message.member.roles.add("892044956993212486")
    },
}
