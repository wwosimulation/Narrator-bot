const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "message",
    description: "This command is for the communication between different roles including medium, jailer and alpha wolf.",
    usage: `${process.env.PREFIX}message <message...>`,
    aliases: ["m", "d", "j"],
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }
        if (["Medium", "Ritualist", "Jailer"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)

        if (!args) return await message.channel.send("You do know that you need to have some content right?")
        let content = args
            .join(" ")
            .replace(/@everyone/g, "everyone")
            .replace(/@here/g, "here")
            .replace(/<([@#])+[&]?[\d]{10,20}>/g, "[ping]")

        if (message.channel.name.startsWith("priv")) {
            if (!["Jailer", "Medium", "Ritualist", "Alpha Werewolf"].includes(player.role) && !["Jailer", "Medium", "Ritualist", "Alpha Werewolf"].includes(player.dreamRole)) return
            if (player.status !== "Alive") return message.channel.send("Listen to me, you need to be ALIVE to send messsages.")
            if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
            if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
            if (content.length > 1850) return await message.channel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")
            // AWW message on the day
            if (player.role === "Alpha Werewolf" || player?.dreamRole == "Alpha Werewolf") {
                if (gamePhase % 3 == 0) return await message.channel.send("You can only send that kind of message during the day.")
                if (player.uses == 0) return await message.channel.send("You already used up your ability!")

                let wwChat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
                wwChat.send(`${getEmoji("alpha_werewolf")} The Alpha Werewolf has sent a message: ${content}\n${message.guild.roles.cache.find(r => r.name === "Alive")}`)
                db.subtract(`player_${message.author.id}.uses`, 1)
                return await message.channel.send("You have sent a message to the werewolves.")
            }

        } else {
            switch (message.channel.name) {
                case "dead-chat":
                    if (player.status !== "Dead") return message.channel.send("Listen to me, you need to be DEAD to send messsages.")
                    if (gamePhase % 3 != 0) return message.channel.send("You can only send messages to the medium(s) during the night.")
                    if (content.length > 1850) return await message.channel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")


                    let ps = players.filter(p => db.get(`player_${p}`).status === "Alive")
                        .map((p) => db.get(`player_${p}`))
                        .filter((p) => ["Medium", "Ritualist"].includes(p.role) || ["Medium", "Ritualist"].includes(p?.dreamRole))
                    message.channel.send(`${getEmoji(player.corrupted ? "corrupt" : player.role.toLowerCase().replace(/\s/g, "_"), client)} ${players.includes(message.author.id) ? players.indexOf(message.author.id) + 1 : ""} ${player.username || message.author.username}: ${content}`)
                    ps.forEach((p) => {
                        if (!p.hypnotised && !p.jailed && !p.nightmared) {
                            message.guild.channels.cache.get(p.channel)
                                .send(`${getEmoji(player.corrupted ? "corrupt" : player.role.toLowerCase().replace(/\s/g, "_"), client)} ${players.includes(message.author.id) ? players.indexOf(message.author.id) + 1 : ""} ${player.username || message.author.username}: ${content}`)
                        }
                    })
                    break;
                case "jailed-chat":
                    if (!player.jailed) return
                    if (player.status !== "Alive") return message.channel.send("Listen to me, you need to be ALIVE to send messsages.")
                    if (gamePhase % 3 != 0) return message.channel.send("You can only send messages to the jailer during the night.")
                    if (content.length > 1850) return await message.channel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")


                    let jailer = players.map((p) => db.get(`player_${p}`)).find((p) => p.role === "Jailer" && p.target === message.author.id)
                    if (jailer.hypnotized) jailer = players.map((p) => db.get(`player_${p}`)).find((p) => p.role === "Dreamcatcher" && p.target === jailer.id)

                    message.guild.channels.cache.get(jailer.channel)
                        .send(`**${getEmoji("jailerselect", client)} ${players.indexOf(message.author.id) + 1} ${db.get(`player_${message.author.id}`).username}**: ${content}`)
                    message.channel.send(`**${getEmoji("jailerselect", client)} ${players.indexOf(message.author.id) + 1} ${db.get(`player_${message.author.id}`).username}**: ${content}`)
                    break;
                default: return
            }
        }
    }
}
