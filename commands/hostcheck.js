const cmd = require("node-cmd");
module.exports = {
  name: "hostcheck",
  aliases: [],
  run: async (message, args, client) => {
    if (
      message.author.id == "552814709963751425" ||
      message.author.id == "439223656200273932"
    ) {
      const { exec } = require("child_process");
      exec("git rev-parse --short HEAD", (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          message.channel.send("An error has occured")
          console.error(err);
        } else {
          // the *entire* stdout and stderr (buffered)+
          message.channel.send("I am currently running on commit `" + stdout + "`");
        }
      });
    }
  },
};
