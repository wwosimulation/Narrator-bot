const db = require("quick.db")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const { ids } = require("../../config")

module.exports = {
    name: "gwhost",
    description: "Creates a game.",
    usage: `${process.env.PREFIX}gwhost [supervisor] <game...>`,
    narratorOnly: true,
    run: async (message, args, client) => {
        let mininarr = message.guild.roles.cache.get(ids.minisim)
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let sup = ""
        if (message.member.roles.cache.has(mininarr.id)) {
            let guy = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy) return message.channel.send(`Supervisor \`${args[0]}\` was not found!`)
            let rol = message.guild.roles.cache.find((r) => r.name === "Supervisor")
            if (!guy.roles.cache.has(rol.id)) return message.channel.send(`${guy.user.tag} is not a supervisor!`)
            sup = `The supervisor for this game is: ${guy}`
            args.shift()
        }
        let button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Join Game")
            .setCustomId("gwjoin-" + args.join(" "))
        const row = new MessageActionRow().addComponents(button)
        const embed = new MessageEmbed({ title: "Player and Spectator List:", description: "** **", color: 0x327210 })
        let m = await message.guild.channels.cache.get("606123818305585167").send({ content: `<@&606123686633799680>, we are now starting game ${args.join(" ")}. Our host will be <@${message.author.id}>!\nIf you do not wish to get future pings about the game, go to <#862712560511221791> and react with 🎮${sup ? `\n\n${sup}` : ""}`, embeds: [embed], components: [row] })
        m.crosspost()
        db.set(`game`, m.id)
        db.set(`hoster`, message.author.id)
        db.set(`gamePhase`, -5)
        db.set("gameCode", args.join(" "))
    },
}
