module.exports = {
    name: "stafflist",
    description: "Update the staff list.",
    usage: `${process.env.PREFIX}stafflist`,
    run: async (message, args, client) => {
        if (message.member.permissions.has("MANAGE_ROLES")) {
            message.react("👍")
            client.emit("stafflist")
            message.channel.send(message.l10n("stafflistQueued"))
        }
    },
}
