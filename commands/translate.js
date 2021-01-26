const googleTranslate = require("@vitalets/google-translate-api");

module.exports = {
  name: "translate",
  run: async (message, args, client) => {
    if (!args)
      return await message.channel.send(
        "<:denied:730345256914255902> No. There is no such thing as translating nothing to a language"
      );
      if (!message.channel.name == "player-commands") return message.channel.send("No! Only do this in #player-commands!")
    let content = "";
    for (let i = 0; i < args.length; i++) {
      content += args[i] + " ";
    }
    googleTranslate(content, { to: "en" }).then(res => {
      message.channel.send('From ' + res.from.language.iso + ': ' + res.text).catch(e => message.channel.send(e.message));
    });
  }
};