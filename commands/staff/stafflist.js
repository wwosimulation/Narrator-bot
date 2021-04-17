module.exports = {
  name: "stafflist",
  run: async (message, args, client) => {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      message.react("👍")
      client.emit("stafflist")
      message.channel.send("Done! (Note: it is recommended to use the slash command version of this when possible)")
    }
  }
};
