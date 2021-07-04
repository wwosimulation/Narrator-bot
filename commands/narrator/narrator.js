module.exports = {
    name: "narrator",
    gameOnly: true,
    run: async (message, args, client) => {
        let narrator = message.guild.roles.cache.find((r) => r.name === "Narrator")
        message.member.removeRole(narrator.id)
    },
}
