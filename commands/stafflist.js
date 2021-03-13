module.exports = {
  name: "sow",
  run: async (message, args, client) => {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      message.react("👍")
      client.emit("stafflist")
    }
  }
};
