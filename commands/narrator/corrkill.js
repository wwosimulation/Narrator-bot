module.exports = {
  name: "corrkill",
  gameOnly: true,
  narratorOnly: true,
  run: async (message, args, client) => {
    let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
    message.guild.channels.cache.get("606132999389708330").send(`<:corrupt:745632706838396989> The Corruptor killed **${guy.nickname} ${guy.user.username}**!`)
    guy.roles.add("606131202814115882")
    guy.roles.remove("606140092213624859")
    guy.roles.add("777400587276255262")
  },
}
