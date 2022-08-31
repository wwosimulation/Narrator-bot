const db = require("quick.db")
const { ids } = require("../../config")

module.exports = {
    name: "rwhost",
    description: "Host a ranked game.",
    usage: `${process.env.PREFIX}rwhost <game...>`,
    run: async (message, args, client) => {
        let guild = client.guilds.cache.get(ids.server.sim)
        let member = guild.members.fetch(message.author.id)
        if (!member.roles.cache.has(ids.narratorsim)) return
        if (db.get(`game.id`) != null) return message.channel.send("Another game is being hosted!")
        let rs = db.get("rankedseason")
        let button = { type: 2, style: 3, label: "Join Game", custom_id: `gwjoin-rs.${rs}[${args.join(" ")}]` }
        const row = { type: 1, components: [button] }
        const embed = { title: "Player and Spectator List:", description: "** **", color: 0x327210 }
        let m = await guild.channels.cache.get("860552178095882240").send({ content: `<@&606123691889393705>, we are now starting game RS.${rs}[${args.join(" ")}]. Our host will be <@${message.author.id}>!\nIf you do not wish to get future pings about the game, go to <#862712560511221791> and react with 🏆`, embeds: [embed], components: [row] })
        m.crosspost()
        db.set(`game.id`, m.id)
        db.set(`hoster`, message.author.id)
        db.set(`gamePhase`, -5)
        let gameGuild = client.guilds.cache.get(ids.server.game)
        gameGuild.channels.cache.find((c) => c.name === "carl-welcome-left-log")?.send("==== START ====")
    },
}
