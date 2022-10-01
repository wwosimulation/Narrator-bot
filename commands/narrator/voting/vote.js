const db = require("quick.db")
const ms = require("ms")
const { fn, getEmoji } = require("../../config")

module.exports = async (client) => {
    const guild = client.guilds.cache.get("890234659965898813") // get the guild object - Object
    const dayChat = guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
    const voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat") // get the vote channel - Object
    const werewolvesChat = guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
    const aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive") // get the Alive role - Object
    const players = db.get(`players`) || [] // get the players array - Array<Snowflake>
    const alivePlayers = players.filter((p) => db.get(`player_${p}`).status === "Alive") // get the alive players array - Array<Snowflake>
    const deadPlayers = players.filter((p) => !alivePlayers.includes(p)) // get the dead players array - Array<Snowflake>
    const gamephase = db.get(`gamePhase`)

    // actions
    const alchemists = require("./kills/alchemists.js")
    const harbingers = require("./kills/harbingers.js")
    const revivedWolves = require("./kills/revivedWolves.js")
    const zombies = require("./kills/zombies.js")
    const ritualists = require("./kills/ritualists.js")
    const seerApprentices = require("./kills/seerApprentices.js")

    if (gamephase % 3 != 1) return message.channel.send("Please first use `+day`")

    await alchemists(client)
    await harbingers(client)
    await revivedWolves(client)
    await zombies(client)
    await ritualists(client)
    await seerApprentices(client)

    if (!args[0]) args[0] = db.get("defaultVT") ?? "1m"
    db.set("defaultVT", args[0])

    let timer = ms(args.join(" "))
    if (!timer) return message.channel.send("Invalid time!")

    db.set(`wwsVote`, "NO")
    db.set(`skipVotes`, [])

    let votes = Math.floor(parseInt(aliveRole.members.size) / 2)

    dayChat.send(`Get ready to vote! (${votes} vote${votes == 1 ? "" : "s"} required)`)

    let droppy = { type: 3, custom_id: "votephase", options: [{ label: `Cancel`, value: `votefor-cancel`, description: `Cancel your vote` }] }

    for (const p of alivePlayers) {
        droppy.options.push({ label: `${players.indexOf(p) + 1}`, value: `votefor-${players.indexOf(p) + 1}`, description: `${db.get(`player_${p}`).username}` })
    }

    let row = { type: 1, components: [droppy] }
    let m = await voteChat.send({ content: `Timer set to ${ms(timer)} <@&${aliveRole.id}>`, components: [row] })

    db.set(`commandEnabled`, `yes`)
    db.add(`gamePhase`, 1)
    message.channel.send(`Setting the vote time for ${ms(timer)}`)

    setTimeout(async () => {
        if (m.editable) await m.edit(fn.disableButtons(m))
        voteChat.send(`Time is up!`)
    }, timer)
}
