module.exports = {
    name: "stafflist",
    run: async (message, args, client) => {
        if (message.member.permissions.has("MANAGE_ROLES")) {
            message.react("👍")
            client.emit("stafflist")
            message.channel.send("Stafflist update has been queued.")
        }
    },
}
