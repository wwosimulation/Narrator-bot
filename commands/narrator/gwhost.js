const db = require("quick.db")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

module.exports = {
    name: "gwhost",
    narratorOnly: true,
    run: async (message, args, client) => {
        let mininarr = message.guild.roles.cache.get("606123620732895232")
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let sup = ""
        if (message.member.roles.cache.has(mininarr.id)) {
            let guy = message.guild.members.cache.get(a + rgs[0]) || message.guild.members.cache.find((m) => m.nickname === args[0]) || message.guild.members.cache.find((m) => m.user.username === args[0]) || message.guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy) return message.channel.send(`Supervisor \`${args[0]}\` was not found!`)
            let rol = message.guild.roles.cache.find((r) => r.name === "Supervisor")
            if (!guy.roles.cache.has(rol.id)) return message.channel.send(`${guy.user.tag} is not a supervisor!`)
            sup = `The supervisor for this game is: ${guy}`
            args.shift()
        }
        let button = new MessageButton().setStyle("SUCCESS").setLabel("Join Game").setCustomID("gwjoin")
        const row = new MessageActionRow().addComponents(button)
        const embed = new MessageEmbed().setTitle("Player and Spectator List:").setDescription("** **").setColor(0x327210)
        let m = await message.guild.channels.cache.get("848405794319368223").send(`We are now starting game ${args.join(" ")}. Our host will be <@${message.author.id}>!\nIf you do not wish to get future pings about the game, go to <#606123783605977108> and react with 🎮${sup ? `\n\n${sup}` : ""}`, { embed, components: [row] })
        db.set(`game`, m.id)
    },
}
