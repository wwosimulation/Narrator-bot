const db = require("quick.db")
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const { ids } = require("../../config")

module.exports = {
    name: "rwhost",
    description: "Host a ranked game.",
    usage: `${process.env.PREFIX}rwhost <game...>`,
    run: async (message, args, client) => {
        let narrator = message.guild.roles.cache.get(ids.narratorsim)
        if (!message.member.roles.cache.has(narrator.id)) return
        if (db.get(`game`) != null) return message.channel.send("Another game is being hosted!")
        let rs = db.get("rankedseason")
        let button = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Join Game")
            .setCustomId(`gwjoin-rs.${rs}[${args.join(" ")}]`)
        const row = new MessageActionRow().addComponents(button)
        const embed = new MessageEmbed().setTitle("Player and Spectator List:").setDescription("** **").setColor(0x327210)
        let m = await message.guild.channels.cache.get("860552178095882240").send({ content: `<@&606123691889393705>, we are now starting game RS.${rs}[${args.join(" ")}]. Our host will be <@${message.author.id}>!\nIf you do not wish to get future pings about the game, go to <#862712560511221791> and react with 🏆`, embeds: [embed], components: [row] })
        db.set(`game`, m.id)
        db.set(`hoster`, message.author.id)
        db.set(`gamePhase`, -5)
    },
}
