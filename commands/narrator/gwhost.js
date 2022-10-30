const db = require("quick.db")
const stats = require("../../schemas/stats")
const { ids } = require("../../config")

module.exports = {
    name: "gwhost",
    description: "Creates a game.",
    usage: `${process.env.PREFIX}gwhost [supervisor] <game...>`,
    narratorOnly: true,
    run: async (message, args, client, rematch = false) => {
        const guild = client.guilds.cache.get(ids.server.sim)
        const member = await guild.members.fetch(message.author.id)

        if (db.get(`game.id`)) return message.channel.send("Another game is being hosted!")

        let sup = ""

        if (member.roles.cache.has(ids.minisim) && !rematch) {
            let guy = guild.members.cache.get(args[0]) || guild.members.cache.find((m) => m.nickname === args[0]) || guild.members.cache.find((m) => m.user.username === args[0]) || guild.members.cache.find((m) => m.user.tag === args[0])
            if (!guy) return message.channel.send(`Supervisor \`${args[0]}\` was not found!`)
            let rol = guild.roles.cache.find((r) => r.name === "Supervisor")
            if (!guy.roles.cache.has(rol.id)) return message.channel.send(`${guy.user.tag} is not a supervisor!`)
            sup = `The supervisor for this game is: ${guy}`
            args.shift()
        }
        let button = { type: 2, style: 3, label: "Join Game", custom_id: `gwjoin-${args.join(" ")}` }
        const row = { type: 1, components: [button] }

        let description = !rematch
            ? "** **"
            : "** **\n" +
              client.guilds.cache
                  .get(ids.server.game)
                  .members.cache.filter((m) => m.roles.cache.some((r) => ["Alive", "Dead", "Spectator"].includes(r.name)))
                  .map((m) => m.user.tag)
                  .join("\n")

        const embed = { title: "Player and Spectator List:", description, color: 0x327210 }
        let m = await guild.channels.cache.get("606123818305585167").send({ content: `<@&606123686633799680>, we are now starting game ${args.join(" ")}. Our host will be <@${message.author.id}>!\nIf you do not wish to get future pings about the game, go to <#862712560511221791> and react with 🎮${sup ? `\n\n${sup}` : ""}`, embeds: [embed], components: [row] })
        m.crosspost()
        db.set(`game.id`, m.id)
        db.set(`hoster`, message.author.id)
        db.set(`gamePhase`, -5)
        db.set("gameCode", args.join(" "))
        client.guilds.cache
            .get(ids.server.game)
            .channels.cache.find((c) => c.name === "carl-welcome-left-log")
            ?.send("==== START ====")

        let stat = await stats.find()
        stat = stat[0]
        stat.games.push({
            [m.id]: {
                time: new Date(),
                players: [],
                spectators: [],
                host: message.author.id,
                teamWin: "",
                status: "started",
                beta: client.user.username.includes("Beta"),
            },
        })
        stat.save()
    },
}
