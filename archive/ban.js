module.exports = {
  name: "ban",
  description: "bans a user from the server",
  args: true,
  usage: "<user mention> <reason>",
  guildOnly: true,
  cooldown: 15,
  show: true,
  modOnly: true,
  run: async (message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.reply("you can't ban members!");
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ");
    if (!user) return message.reply("you didn't mention a user!");
    if (user === message.author)
      return message.channel.send("You can't ban yourself!");
    if (!reason)
      return message.reply("you have to enter a reason for this ban!");
    if (!message.guild.member(user).bannable)
      return message.reply("I can't ban this user!");
    user
      .send(
        `You have been banned from ${message.guild.name}.\nReason: ${reason}`
      )
      .then(msg => message.guild.ban(user));
    message.channel.send(
      `${user.username} has been banned.\nReason: ${reason}`
    );
  }
};
