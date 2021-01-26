module.exports = {
  name: "end",
  run: async (message, args, client) => {
    if (message.guild.id == "472261911526768642") {
      console.log("5");
      if (message.member.hasPermission("KICK_MEMBERS")) {
        console.log("50");
        let chan = message.guild.channels.cache.filter(c =>
          c.name.startsWith("priv")
        );
        //console.log(chan)
        let chann = chan.keyArray("id");
        for (let i = 0 ; i < chann.length ; i++) {
          let thechan = message.guild.channels.cache.get(chann[i])
          thechan.messages.cache.filter(m => !m.pinned).forEach(msg => msg.delete())
        }
      }
    }
  }
};
