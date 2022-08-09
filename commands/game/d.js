const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "d",
    description: "This command is for the communication between the medium(s) and the dead.",
    usage: `${process.env.PREFIX}d <message...>`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!["priv-ritualist", "priv-medium", "dead-chat"].includes(message.channel.name)) return;

        if (message.channel.name.startsWith("priv")) {
            if (player.status !== "Alive" && message.channel.name !== "dead-chat") return await message.channel.send("Listen to me, you need to be ALIVE to send messsages.")
            if (!["Medium", "Ritualist"].includes(player.role) && !["Medium", "Ritualist"].includes(player.dreamRole) && player.status !== "Dead") return;
            if (["Medium", "Ritualist"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
            if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only send messages during the night right? Or are you delusional?")
            if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
            if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
            if (!args) return await message.channel.send("You do know that you need to have some content right?")

            let content = args.join("  ").replace(/@everyone/g, "everyone").replace(/@here/g, "here").replace(/\<[@\&]?#?[\d]{10,20}>/g, "[ping]")
            if (content.length > 1850) return await message.channel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")

            let deadchat = message.guild.channels.cache.find(c => c.name === "dead-chat")
            let allPlayers = players.filter(p => db.get(`player_${p}`).status === "Alive").map(p => db.get(`player_${p}`)).filter(p => ["Medium", "Ritualist"].includes(p.role) || ["Medium", "Ritualist"].includes(p?.dreamRole))

            allPlayers.forEach(p => {
                deadchat.send(`${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role}: ${content}`)
                if (!p.hypnotized) {
                    let chan = message.guild.channels.cache.get(p.channel)
                    chan.send(`${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role}: ${content}`)
                }
            })
        } else {
            if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only send messages during the night right? Or are you delusional?")
            if (!args) return await message.channel.send("You do know that you need to have some content right?")

            let content = args.join("  ").replace(/@everyone/g, "everyone").replace(/@here/g, "here").replace(/\<[@\&]?#?[\d]{10,20}>/g, "[ping]")
            if (content.length > 1850) return await message.channel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")

            let deadchat = message.guild.channels.cache.find(c => c.name === "dead-chat")
            let allPlayers = players.filter(p => db.get(`player_${p}`).status === "Alive").map(p => db.get(`player_${p}`)).filter(p => ["Medium", "Ritualist"].includes(p.role) || ["Medium", "Ritualist"].includes(p?.dreamRole))

            allPlayers.forEach(p => {
                deadchat.send(`${getEmoji(player.corrupted ? "corrupt" : player.role.toLowerCase().replace(/\s/g, "_"), client)} ${players.includes(message.author.id) ? players.indexOf(message.author.id)+1 : ""} ${player.username || message.author.username}: ${content}`)
                if (!p.hypnotized) {
                    let chan = message.guild.channels.cache.get(p.channel)
                    chan.send(`${getEmoji(player.corrupted ? "corrupt" : player.role.toLowerCase().replace(/\s/g, "_"), client)} ${players.includes(message.author.id) ? players.indexOf(message.author.id)+1 : ""} ${player.username || message.author.username}: ${content}`)
                }
            })
        }
    },
}
