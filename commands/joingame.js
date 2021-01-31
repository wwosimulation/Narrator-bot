const db = require("quick.db");

module.exports = {
  name: "joingame",
  run: async (message, args, client) => {
    if (message.guild.id != "472261911526768642") return; 
    if (
      args[0] == "started" &&
      (message.member.roles.cache.has("606139219395608603") ||
        message.member.roles.cache.has("606276949689499648"))
    ) {
      db.set("started", "yes");
      message.react("👍");
    } else if (
      args[0] == "ended" &&
      (message.member.roles.cache.has("606139219395608603") ||
        message.member.roles.cache.has("606276949689499648"))
    ) {
      db.set("started", "no");
      message.react("👍");
    } else if (args[0] == "code" &&
    (message.member.roles.cache.has("606139219395608603") ||
      message.member.roles.cache.has("606276949689499648"))) {
        let reactionss = ['✅', '👀', '👤']

        let d = await message.guild.channels.cache.get("606132299372822582").send("To join the game, react with ✅!\nTo spectate, react with 👀!\nTo narrate, react with 👤!")
        await d.react("✅")
        await d.react("👀")
        await d.react("👤")
        const filter = (reaction, user) => reactionss.includes(reaction.emoji.name)

        let e = await message.guild.channels.cache.get("606132387587293195").send("To spectate, react with 👀!\nTo narrate, react with 👤!")
        await e.react("👀")
        await e.react("👤")

        const collector = d.createReactionCollector(filter, { time: 2147483647 })
        
        // starts at #enter-game
        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name == "✅") {
            reaction.users.remove(user)
            if (db.get("started") == "yes") return message.guild.channels.cache.get("606132299372822582").send(`${user} Game has started!`)
            let guy = message.guild.members.cache.find(m => m.id === user.id)
            if (guy.roles.cache.has("606140764682190849")) guy.roles.remove("606140764682190849") //spec
            if (guy.roles.cache.has("606276949689499648")) guy.roles.remove("606276949689499648") //narr
            if (guy.roles.cache.has("606139219395608603")) guy.roles.remove("606139219395608603") //mininarr
            let role = message.guild.roles.cache.get("606140092213624859") 
            setTimeout(async function() {
            await guy.roles.add("606140092213624859").catch(e => message.channel.send(`Error: ${e.message}`))
            await guy.setNickname((role.members.size).toString()).catch(e => message.channel.send(`Error: ${e.message}`))
            await message.guild.channels.cache.get("606132387587293195").send(`${user.tag} joined the game!`)
            })
            } else if (reaction.emoji.name === "👀") {
              reaction.users.remove(user)
              let guy = message.guild.members.cache.get(user.id)
              let role = message.guild.roles.cache.get("606140764682190849")
              if (!guy.roles.cache.has("691298564508352563")) {
                guy.setNickname("lazy spectatorz")
              } else {
                guy.setNickname(guy.user.username)
              }
              guy.roles.add(role.id)
              if (guy.roles.cache.has("606140092213624859")) guy.roles.remove("606140092213624859") //alive
              if (guy.roles.cache.has("606276949689499648")) guy.roles.remove("606276949689499648") //narr
              if (guy.roles.cache.has("606139219395608603")) guy.roles.remove("606139219395608603") //mininarr
              if (guy.roles.cache.has("606138907817672714")) guy.roles.remove("606138907817672714") //yoloofwwo

            } else if (reaction.emoji.name === "👤") {
              reaction.users.remove(user)
              let guy = message.guild.members.cache.get(user.id)
              if (!guy.roles.cache.has("606140995897393164") && !guy.roles.cache.has("606155761286119425")) return message.guild.channels.cache.get("606132387587293195").send(`${guy}, You are not a narrator! Do not try to fool me!`)
              if (guy.roles.cache.has("606140092213624859")) guy.roles.remove("606140092213624859") //alive
              guy.setNickname(guy.user.username)
              if (guy.roles.cache.has("606140764682190849")) guy.roles.remove("606140764682190849") //spec
              if (guy.roles.cache.has('606140995897393164')) {guy.roles.add("606139219395608603")} //narr
              else if (guy.roles.cache.has("606155761286119425")) {guy.roles.add("606276949689499648")} //mininar
              else {
                message.guild.channels.cache.get("606132299372822582").send(`${guy}, You are not a narrator! Do not try to fool me!`)
              }
            }
        });

        collector.on('end', collected => {
            message.channel.send("Reaction in enter-game have been deleted!")
        })

        // start at #game-lobby
        const collectorv2 = e.createReactionCollector(filter, { time: 2147483647 })

        collectorv2.on('collect', (reaction, user) => {
          if (reaction.emoji.name === "👀") {
            reaction.users.remove(user)
            let guy = message.guild.members.cache.get(user.id)
            let role = message.guild.roles.cache.get("606140764682190849")
            if (!guy.roles.cache.has("691298564508352563")) {
              guy.setNickname("lazy spectatorz")
            } else {
              guy.setNickname(guy.user.username)
            }
            guy.roles.add(role.id)
            let alive = message.guild.roles.cache.get("606140092213624859")
            if (guy.roles.cache.has(alive.id) && guy.nickname != alive.members.size) {
              let orang = message.guild.members.cache.find(m => m.nickname === alive.members.size.toString())
              orang.setNickname(guy.nickname) 
            }
            if (guy.roles.cache.has("606140092213624859")) guy.roles.remove("606140092213624859") //alive
            if (guy.roles.cache.has("606276949689499648")) guy.roles.remove("606276949689499648") //narr
            if (guy.roles.cache.has("606139219395608603")) guy.roles.remove("606139219395608603") //mininarr
          } else if (reaction.emoji.name === "👤") {
            reaction.users.remove(user)
            let guy = message.guild.members.cache.get(user.id)
            if (!guy.roles.cache.has("606140995897393164") && !guy.roles.cache.has("606132387587293195")) return message.guild.channels.cache.get("606132387587293195").send(`${guy}, You are not a narrator! Do not try to fool me!`)
            if (guy.roles.cache.has("606140092213624859")) guy.roles.remove("606140092213624859") //alive
            guy.setNickname(guy.user.username)
            if (guy.roles.cache.has("606140764682190849")) guy.roles.remove("606140764682190849") //spec
            if (guy.roles.cache.has('606140995897393164')) {guy.roles.add("606139219395608603")} //narr
            else if (guy.roles.cache.has("606155761286119425")) {guy.roles.add("606276949689499648")} //mininar
            else {
              message.guild.channels.cache.get("606132387587293195").send(`${guy}, You are not a narrator! Do not try to fool me!`)
            }
          }
        })

        collectorv2.on('end', collected => {
          message.channel.send(`Reactions in game lobby have been deleted!`)
        })

      }
  }
};
