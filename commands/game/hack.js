const db = require("quick.db")

module.exports = {
    name: "watch",
    gameOnly: true,
    run: async (message, args, client) => {
        if (message.channel.name == "priv-hacker") {
          let isNight = db.get(`isNight`)
          let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
          if (!message.member.roles.cache.has(alive.id)) return message.channel.send(`You flew right through the computer.`)
          if (!args[0]) return message.channel.send("Nice hacking no one i see")
          if (isNight != "yes") return message.channel.send("You do not want to be seen hacking")
          
           for (let i = 0; i < args.length; i++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[i]) || message.guild.members.cache.find((m) => m.id === args[i]) || message.guild.members.cache.find((m) => m.user.username === args[i])
                message.guild.members.cache.find((m) => m.user.tag === args[i])
                if (!guy) return message.channel.send(`Player **${args[0]}** could not be found!`)
                if (!guy.roles.cache.has(alive.id)) return message.channel.send(`Player **${guy.nickname} ${guy.user.username}** is dead!`)
                if (guy == message.member) return message.channel.send(`Hacking yourself isn't just gonna work!`)
            }
           let lol = []
            for (let j = 0; j < args.length; j++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[j]) || message.guild.members.cache.find((m) => m.id === args[j]) || message.guild.members.cache.find((m) => m.user.username === args[j])
                message.guild.members.cache.find((m) => m.user.tag === args[j])
                lol.push(guy.nickname)
            }
          db.set(`hack_${message.channel.id}`, lol)
           for (let j = 0; j < args.length; j++) {
                let guy = message.guild.members.cache.find((m) => m.nickname === args[j]) || message.guild.members.cache.find((m) => m.id === args[j]) || message.guild.members.cache.find((m) => m.user.username === args[j])
                message.guild.members.cache.find((m) => m.user.tag === args[j])
                message.channel.send(`<:hack:> You decided to hack **${guy.nickname} ${guy.user.username}**!`)
            }
    },
}
