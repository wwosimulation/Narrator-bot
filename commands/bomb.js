const db = require("quick.db");
/*
01 02 03 04
05 06 07 08
09 10 11 12
13 14 15 16
*/

module.exports = {
  name: "bomb",
  aliases: ["explode"],
  run: async (message, args, client) => {
    if (message.channel.name == "priv-bomber") {
      let night = await db.fetch(`nightCount_${message.guild.id}`);
      let didCmd = await db.fetch(`didCmd_${message.channel.id}`);
      let isNight = await db.fetch(`isNight_${message.guild.id}`);
      let alive = message.guild.roles.cache.find(r => r.name === "Alive");
      let dead = message.guild.roles.cache.find(r => r.name === "Dead");
      let ownself = message.guild.members.cache.find(
        m => m.nickname === message.member.nickname
      );
      let guy1 = message.guild.members.cache.find(m => m.nickname === args[0]);
      let guy2 = message.guild.members.cache.find(m => m.nickname === args[1]);
      let guy3 = message.guild.members.cache.find(m => m.nickname === args[2]);
      if (!isNight == "yes")
        return await message.channel.send(
          "Placing bombs in broad day light is good. You should do it often!"
        );
      if (!args.length == 3)
        return await message.channel.send(
          "I know you wanna be the arso but you're not. Select 3 players to place the bomb at."
        );
      if (!guy1 && !guy2 && !guy3)
        return await message.channel.send("Invalid Target!");
      if (
        (!guy1.roles.has(alive.id) &&
          !guy2.roles.has(alive.id) &&
          !guy3.roles.has(alive.id)) ||
        !ownself.roles.has(alive.id)
      )
        return await message.channel.send(
          "Listen, placing bombs aren't possible when dead or to dead players. Now be a lamb and SHUT UP. "
        );
      if (night == didCmd + 1 && night != 1)
        return await message.channel.send(
          "You already placed the bombs yesterday. So no bombs for you."
        );
      let bombs = [args[0], args[1], args[2]];
      let bombPlacements = `${args[0]} ${args[1]} ${args[2]}`;
      console.log(bombPlacements);
      console.log(bombs);
      //console.log(JSON.stringify(bombs) == '123' )
      if (
        bombPlacements == "1 2 3" ||
        bombPlacements == "2 3 4" ||
        bombPlacements == "5 6 7" ||
        bombPlacements == "6 7 8" ||
        bombPlacements == "9 10 11" ||
        bombPlacements == "10 11 12" ||
        bombPlacements == "13 14 15" ||
        bombPlacements == "14 15 16" ||
        bombPlacements == "1 5 9" ||
        bombPlacements == "5 9 13" ||
        bombPlacements == "2 6 10" ||
        bombPlacements == "6 10 14" ||
        bombPlacements == "3 7 11" ||
        bombPlacements == "7 11 15" ||
        bombPlacements == "4 8 12" ||
        bombPlacements == "8 12 16" ||
        bombPlacements == "1 6 11" ||
        bombPlacements == "2 7 12" ||
        bombPlacements == "3 6 9" ||
        bombPlacements == "4 7 10" ||
        bombPlacements == "5 10 15" ||
        bombPlacements == "6 11 16" ||
        bombPlacements == "7 10 13" ||
        bombPlacements == "8 11 14"
      ) {
        //return await message.channel.send(
        // "Honey, you can only place bombs vertically, horizontally or diagonally. Make sure they are in order. \n\n+bomb 7 6 5 - :x:\n+bomb 5 6 7 - :white_check_mark: "
        // );
        message.channel.send(
          `<:explode:745914819353509978> Placed bombs on **${guy1.user.username}**, **${guy2.user.username}** and **${guy3.user.username}**!`
        );
        db.set(`bomb_${message.channel.id}`, bombs);
        db.set(`didCmd_${message.channel.id}`, night);
        console.log(db.get(`bomb_${message.channel.id}`));
        db.pop(`bomb_${message.channel.id}`, message.member.nickname)
      } else {
        return await message.channel.send(
          "Honey, you can only place bombs vertically, horizontally or diagonally. Make sure they are in order. \n\n+bomb 7 6 5 - :x:\n+bomb 5 6 7 - :white_check_mark:"
        );
      }
    }
  }
};
