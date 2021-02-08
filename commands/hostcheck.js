const cmd = require("node-cmd");
module.exports = {
  name: "hostcheck",
  aliases: [],
  run: async (message, args, client) => {
    if (
      message.author.id == "552814709963751425" ||
      message.author.id == "439223656200273932"
    ) {
      cmd.get("git rev-parse --short HEAD", (data) =>
        message.channel.send("I am currently running on commit \`" + data + "\`")
      );
    }
  },
};
