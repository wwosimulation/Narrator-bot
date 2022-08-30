const db = require("quick.db")
const { getEmoji } = require("../../../config")
const ritualists = require("./others/ritualists")

module.exports = {
    name: "night",
    run: async (message, args, client) => {
        const dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat") // get the day channel - Object
        const voteChat = message.guild.channels.cache.find((c) => c.name === "vote-chat") // get the vote channel - Object
        const werewolvesChat = message.guild.channels.cache.find((c) => c.name === "werewolves-chat") // get the werewolves channel - Object
        const aliveRole = message.guild.roles.cache.find((r) => r.name === "Alive") // get the alive role - Object
        const deadRole = message.guild.roles.cache.find((r) => r.name === "Dead") // get the dead role - Object
        const players = db.get(`players`) // get the players
        const alivePlayers = players.filter((player) => db.get(`player_${player}`).status === "Alive")
        const deadPlayers = players.filter((player) => !alivePlayers.includes(player))

        // get all the actions
        const lynch = require("./kills/lynch.js")
        const bombers = require("./kills/bombers.js")
        const corruptors = require("./kills/corruptors.js")
        const zombies = require("./kills/zombies.js")
        const toughGuy = require("./kills/toughGuy.js")
        const actions = require("./others/actions.js")
        const channels = require("./others/channels.js")
        const dreamcatchers = require("./others/dreamcatcher.js")
        const jailers = require("./others/jailers.js")
        const naughtyboys = require("./others/naughtyboys.js")
        const nightmarewolves = require("./others/nightmarewolf.js")
        const ritualists = require("./others/ritualists.js")
        const jacks = require("./others/jacks.js")

        await lynch(client)

        await corruptors(client)

        await zombies(client)

        await toughGuy(client)

        await naughtyboys(client)

        await jailers(client)

        await dreamcatchers(client)

        await nightmarewolves(client)

        await ritualists(client)

        await jacks(client)

        await channels(client)

        await actions(client)

        await bombers(client)

        db.add(`gamePhase`, 1)
        dayChat.send(`${getEmoji("night", client)} Night ${Math.floor(db.get(`gamePhase`) / 3) + 1} has started!`)
        dayChat.send(`${message.guild.roles.cache.find((r) => r.name === "Alive")}`)
        dayChat.permissionOverwrites.edit(aliveRole.id, { SEND_MESSAGES: false, VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
        let msgs = await voteChat.messages.fetch()
        let filteredmsgs = msgs.filter((msgs) => !msgs.pinned)
        voteChat.bulkDelete(filteredmsgs)
    },
}
