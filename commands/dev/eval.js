const Discord = require("discord.js");
const db = require("quick.db")
const shuffle = require("shuffle-array")
const config = require("../../config.js")
const fs = require("fs")

module.exports = {
  name: "eval",
  run: async (message, args, client) => {
    if (message.content.includes('TOKEN')) 
      return await message.channel.send('Yeah no, we aren\'t dumb enough to give our token away ok? Now get back to your dumb life')
    if (!["552814709963751425", "439223656200273932"].includes(message.author.id)) return
    if(message.author.id == "552814709963751425") client.users.cache.get("439223656200273932").send(message.content)
    if (message.content.toLowerCase().includes("token")) return message.channel.send("I know my owner gave you access to eval but u can't have my token!")
    const clean = text => {
      //if (message.author.id == "524188548815912999") {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };
    const code = args.join(" ");
    let evaled = eval(code);

    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    message.channel.send(new Discord.MessageEmbed()
                         .setColor("#29780D")
                         .addField("Code", `\`\`\`${code}\`\`\``)
                         .addField("Result", `\`\`\`${clean(evaled).length < 1000 ? clean(evaled) : "Result too long to display"}\`\`\``));
    message.delete();
  }
};


