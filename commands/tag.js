const db = require("quick.db");

module.exports = {
  name: "tag",
  aliases: ["revenge", "avenge", "target"],
  run: async (message, args, client) => {
    let night = db.get(`nightCount_${message.guild.id}`) || 1
    let isNight = db.get(`nightCount_${message.guild.id}`) || "yes"
    let jtag = await db.fetch(`jwwtag_${message.author.id}`);
    let atag = await db.fetch(`atag_${message.author.id}`) 
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    let dead = message.guild.roles.cache.find(r => r.name === "Dead");
    let ownself = message.guild.members.cache.find(
      m => m.nickname === message.member.nickname
    );
    if (message.channel.name == "priv-junior-werewolf") {
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You aren't alive dummy....")
      if (!args[0]) return message.channel.send("Ah yes, being stupid. One of the ingredients for a recipe to suicide.")
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      if (!guy) return message.reply("Invalid Target!")
      if (guy == message.member) return message.channel.send("Noob. Tagging yourself is stupid even i feel sorry for you. And i don't even have feelings weirdo.")
      if (!guy.roles.cache.has(alive.id)) return message.channel.send("Stop. Tagging. Dead. Players. It. Makes. You. Look. Stupid. ,. Stupid.")
      let role = db.get(`role_${guy.id}`) 
      let player = role.toLowerCase()
      
      // check if the player tagged is a wolf or a sorcerer
      if (player.includes('wolf') || role == "Sorcerer") {
        return await message.reply('You can\'t tag your teammate!') 
      }
      
      // check if the player tagged is a president
      if (role == 'President') {
        return await message.reply('You can\'t tag the President!')
      } 
      
      // check if the player tagged is a couple of the jww
      let lovers = message.guild.channels.cache.get("606289146700496916")
      if (lovers.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
        if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          return message.channel.send("Bruh, tagging your lover is gamethrowing. Do that one more time and you'll get a softwarn.")
        }
      }
      
      db.set(`jwwtag_${message.author.id}`, args[0])
      message.react('475775484219752453')
      
    }
    if (message.channel.name == "priv-avenger") {
      if (night == 1) {
        if (isNight == "yes") return message.channel.send("You can't tag a player on the first night sweetie.")
      }
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You aren't alive dummy....")
      if (!args[0]) return message.channel.send("Ah yes, being stupid. One of the ingredients for a recipe to suicide.")
      let guy = message.guild.members.cache.find(m => m.nickname === args[0]);
      if (!guy) return message.reply("Invalid Target!")
      if (guy == message.member) return message.channel.send("Noob. Tagging yourself is stupid even i feel sorry for you. And i don't even have feelings weirdo.")
      if (!guy.roles.cache.has(alive.id)) return message.channel.send("Stop. Tagging. Dead. Players. It. Makes. You. Look. Stupid. ,. Stupid.")
      
      let role = db.get(`role_${guy.id}`) 
      
      // check if the player tagged is the president
      if (role == 'President') {
        return await message.reply('You can\'t tag the President!') 
      } 
      
      // check if the player tagged is a couple of the avenger
      let lovers = message.guild.channels.cache.get("606289146700496916")
      if (lovers.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
        if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          return message.channel.send("Bruh, tagging your lover is gamethrowing. Do that one more time and you'll get a softwarn.")
        }
      }
      
      // check if the player tagged is a sect leader and if you are a sect member
      let sl = message.guild.channels.cache.get("682617467767357453")
      if (sl.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
        if (role == "Sect Leader") {
            return message.channel.send("Trying to reveal a sect leader when being sected is gamethrowing. How about a softwarn next time?")
        }
      }
      
      db.set(`atag_${message.author.id}`, args[0]) 
      message.react('482179367485702162')
      
    }
    if (message.channel.name == "priv-loudmouth") {
      if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You know, you can only cry to your mommy when you're alive...")

      if (!args[0]) return message.channel.send("Congratulations! You are now a certified idiot with a brain tumour!")

      let guy = message.guild.members.cache.find(m => m.nickname === args[0]) || message.guild.members.cache.find(m => m.user.username === args[0]) || message.guild.members.cache.find(m => m.id === args[0]) || message.guild.members.cache.find(m => m.user.tag === args[0])

      if (!guy || guy == message.member || !guy.roles.cache.has(alive.id))  
      return message.reply("Invalid Target")

      
     
      if (night == 1) {
        if (isNight == "yes") {
          return message.channel.send("You can't select a player to reveal during the first night!")
        }
      }
     
      let role = db.get(`role_${guy.id}`)
      
      // check if the player tagged is a President
      if (role == 'President') {
        return await message.reply('You can\'t tag the President!') 
      }
      
      // check if the player tagged is a couple of the loudmouth
      let lovers = message.guild.channels.cache.get("606289146700496916")
      if (lovers.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
        if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
          return message.channel.send("Bruh, tagging your lover is gamethrowing. Do that one more time and you'll get a softwarn.")
        }
      }

      // check if the player tagged is a sect leader and if you are a sect member
      let sl = message.guild.channels.cache.get("682617467767357453")
      if (sl.permissionsFor(ownself).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
        if (role == "Sect Leader") {
            return message.channel.send("Trying to reveal a sect leader when being sected is gamethrowing. How about a softwarn next time?")
        }
      }
      
      db.set(`mouth_${message.author.id}`, guy.nickname)
      message.channel.send("<:loudmouthing:744572170507911230> You selected **" + guy.nickname + " " + guy.user.username + "** to be revealed when you die.")

    }
  }
};
