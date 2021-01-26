const Discord = require("discord.js");

module.exports = {
  name: "eval",
  run: async (message, args, client) => {
    if (message.content.includes('TOKEN')) 
      return await message.channel.send('Yeah no, we aren\'t dumb enough to give our token away ok? Now get back to your dumb life')
    if (message.author.id != '552814709963751425') return
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

    /* message.channel.send(new Discord.RichEmbed()
                         .setColor("#566848")
                         .addField("Code", `\`\`\`${code}\`\`\``)
                         .addField("Result", `\`\`\`${clean(evaled)}\`\`\``), {
      code: "xl"
    });*/
    message.delete();
  }
};
