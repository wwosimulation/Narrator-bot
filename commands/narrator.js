module.exports = {
  name: "narrator",
  run: async (message, args, client) => {
    let narrator = message.guild.roles.cache.find(r => r.name === "Narrator");
    message.member.removeRole(narrator.id);
  }
};
