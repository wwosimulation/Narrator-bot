const fs = require("fs");
const db = require("quick.db")

module.exports = {
  name: "balance",
  aliases: ["bal", "coins", "money"],
  run: async (message, args) => {
   return message.channel.send("This command no longer exists. Another command will be a substitute instead.")
  }
};
