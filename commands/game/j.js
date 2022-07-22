const db = require("quick.db")

module.exports = {
    name: "j",
    description: "This command is for the communication between the jailer and the jailee.",
    usage: `${process.env.PREFIX}j <message...>`,
    gameOnly: true,
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }


        if (message.channel.name.startsWith("priv")) {
            if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to send messsages.")
            if (!["Jailer"].includes(player.role) && !["Jailer"].includes(player.dreamRole) && player.status !== "Dead") return;
            if (["Jailer"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
            if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only send messages during the night right? Or are you delusional?")
            if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
            if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
            if (!args) return await message.channel.send("You do know that you need to have some content right?")

            let content = args.join("  ").replace(/@everyone/g, "everyone").replace(/@here/g, "here").replace(/\<[@\&]?#?[\d]{10,20}>/g, "[ping]")
            if (content.length > 1850) return await message.channel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")

            let jailedchat = message.guild.channels.cache.find(c => c.name === "jailed-chat")
            let jailerchat = message.channel

            jailedchat.send(`${getEmoji("jailer", client)} Jailer: ${content}`)
            jailerchat.send(`${getEmoji("jailer", client)} Jailer: ${content}`)
            
        } else {
            if (message.channel.name !== "jailed-chat") return;
            if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only send messages during the night right? Or are you delusional?")
            if (!args) return await message.channel.send("You do know that you need to have some content right?")

            let content = args.join("  ").replace(/@everyone/g, "everyone").replace(/@here/g, "here").replace(/\<[@\&]?#?[\d]{10,20}>/g, "[ping]")
            if (content.length > 1850) return await message.channel.send("The maximum amount of characters you can send is 1850! Please shorten your message.")

            let jailor = message.guild.channels.cache.find(c => c.name === "jailed-chat")
            let allPlayers = players.filter(p => db.get(`player_${p}`).status === "Alive").map(p => db.get(`player_${p}`)).filter(p => ["Jailer"].includes(p.role) || ["Jailer"].includes(p?.dreamRole))

            let jailer = players.map(p => db.get(`player_${p}`)).find(p => p.role === "Jailer" && p.target === message.author.id).id
            let jailedchat = message.channel
            
            if (jailer.hypnotized) jailer = players.map(p => db.get(`player_${p}`)).find(p => p.role === "Dreamcatcher" && p.target === jailer)

            let jailerchat = message.guild.channels.cache.get(jailer.channel)

            jailedchat.send(`${getEmoji("jailerselect", client)} ${players.indexOf(message.author.id)+1} ${db.get(`player_${message.author.id}`).username}: ${content}`)
            jailerchat.send(`${getEmoji("jailerselect", client)} ${players.indexOf(message.author.id)+1} ${db.get(`player_${message.author.id}`).username}: ${content}`)
        }
    },
}
