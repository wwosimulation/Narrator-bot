module.exports = {
  name: "spectate",
  aliases: ["spectator"],
  run: async (message, args, client) => {
    message.member.roles.add("606140764682190849");

    ;
    let mininarr = message.guild.roles.cache.find(
      r => r.name === "Narrator Trainee"
    );
    let narrator = message.guild.roles.cache.find(r => r.name === "Narrator");
    let immune = message.guild.roles.cache.get("691298564508352563")
    
    if (message.member.roles.cache.has(client.config.ids.alive) && message.member.nickname != alive.members.size) {

      let orang = message.guild.members.cache.find(m => m.nickname === alive.members.size.toString())
      orang.setNickname(message.member.nickname)

    }

    if (!message.member.roles.cache.has(immune.id)) {
      message.member.setNickname("lazy spectatorz")
    } else {
      message.member.setNickname(message.author.username)
    }
    
    if (message.member.roles.cache.has(client.config.ids.alive))
      message.member.roles.remove(client.config.ids.alive);
    if (message.member.roles.cache.has(narrator.id))
      message.member.roles.remove(narrator.id);
    if (message.member.roles.cache.has(mininarr.id))
      message.member.roles.remove(mininarr.id);
    
    
  }
};
