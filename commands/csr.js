module.exports = {
  name: "csr",
  description:
    "Pings the alive role and asks which gamemode (Classic or Sandbox or Random)",

  run: async (message, args, client) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    let alive = message.guild.roles.cache.find(r => r.name === "Alive");
    message.channel.bulkDelete(1);
    let m = await message.channel.send(`${alive} Classic,  Sandbox or Random?`);
    await m.react("1️⃣");
    await m.react("2️⃣");
    await m.react("3️⃣");
  }
};
