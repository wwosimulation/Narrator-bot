const db = require("quick.db")
const { getEmoji, fn } = require("../../config")

module.exports = {
    name: "give",
    description: "Give something to a player.",
    usage: `${process.env.PREFIX}give <player> [<option>]`,
    gameOnly: true,
    run: async (message, args, client) => {
        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`) || []
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to give out items.")
        if (!["Fortune Teller", "Santa Claus", "Easter Bunny", "Forger", "Alchemist", "Baker"].includes(player.role) && !["Fortune Teller", "Santa Claus", "Easter Bunny", "Forger", "Alchemist", "Baker"].includes(player.dreamRole)) return
        if (["Fortune Teller", "Santa Claus", "Easter Bunny", "Forger", "Alchemist", "Baker"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 != 0) return await message.channel.send("You do know that you can only give during the night right? Or are you delusional?")
        if (player.role === "Alchemist" && db.get(`game.peace`) === Math.floor(gamePhase / 3) + 1) return await message.channel.send("This is a peaceful night! You cannot poison anyone!")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")

        if (args[0].toLowerCase() === "cancel" && !["Fortune Teller", "Santa Claus", "Easter Bunny"].includes(player.role)) {
            if (player.role === "Alchemist") {
                let itemType = args[1]?.toLowerCase()
                if (!itemType) return await message.channel.send("You need to state if you want to cancel the black or the red potion!")
                if (!["black", "red"].includes(itemType)) return await message.channel.send("Potion not found! Please choose the black or red potion to cancel.")
                db.delete(`player_${player.id}.${itemType}Target`)
                return await message.channel.send(`${something} Done! I have taken back your ${itemType} potion!`)
            } else {
                db.delete(`player_${player.id}.target`)
                return await message.channel.send(`${getEmoji(player.itemType, client)} Done! I have taken back your item!`)
            }
        }

        if (player.role === "Santa Claus" && args[0].toLowerCase().startsWith("ho")) {
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            await dayChat.send(`${getEmoji("santahoho", client)} HO HO HO`)
            db.subtract(`player_${player.id}.uses`, 1)
            return
        }

        if (player.role === "Fortune Teller") {
            if (player.uses === 0) return await message.channel.send("You have already used up all your abilites!")
        }

        if (player.role === "Forger") {
            if (player.forgedAt >= Math.floor(gamePhase / 3) + 1) return await message.channel.send("You have not finished forging your item yet!")
            if (player.uses !== 3 - (player.givenItems || 0)) return await message.channel.send("You need to forge an item before you can give it someone!")
            if (player.givenItems === 3) return await message.channel.send("You've already given all your forged items!")
        }

        let target = players[Number(args[0]) - 1] || players.find((p) => p === args[0]) || players.map((p) => db.get(`player_${p}`)).find((p) => p.username === args[0])

        if (!target) return await message.channel.send("Player not found!")

        if (["Santa Claus", "Easter Bunny"].includes(player.role)) {
            if (db.get(`player_${target}`)?.status === "Alive") return await message.channel.send(`You need to select a dead but connected player to give your gift!`)
        } else {
            if (db.get(`player_${target}`)?.status !== "Alive") return await message.channel.send(`You need to select an alive player to give!`)
        }

        if (!player.hypnotized) {
            if (player.role === "Alchemist" && db.get(`player_${player.id}`).couple === target) return await message.channel.send("You cannot give your potion to your couple!")

            if (player.id === target) return await message.channel.send(`You do know that you cannot your own items to yourself?`)
        }

        if (player.role === "Fotune Teller") {
            let channel = message.guild.channels.cache.get(db.get(`player_${target}`))
            let embed = {
                title: "You have received a fortune teller's card.",
                description: `${getEmoji("moon", client)} You have received a card from the Fortune Teller. When you're ready, use the button below to reveal yourself!`,
                color: 0xff5f1f, // neon orange
                thumbnail: { url: getEmoji("moon", client).url },
            }
            let row = { type: 1, components: [{ type: 2, style: 3, label: "Reveal", custom_id: "ft_reveal" }] }
            db.subtract(`player_${player.id}.uses`, 1)
            await channel.send({ embeds: [embed], components: [row] })
            await message.channel.send(`${getEmoji("moon", client)} You have given your card to **${players.indexOf(target)} ${db.get(`player_${target}`).user.username}**.`)
        }

        if (["Santa Claus", "Easter Bunny"].includes(player.role)) {
            const players = require("../../schemas/players")
            let channel = message.guild.channels.cache.get(db.get(`player_${target}`))
            db.subtract(`player_${player.id}.uses`, 1)
            players.findOneAndUpdate({ user: target }, { $inc: { roses: 1 } }).exec()
            await channel.send(`You have recieved a gift from ${player.role === "Easter Bunny" ? "the " : ""}${player.role}! Check your profile to see what you got.`)
            await message.channel.send(`${getEmoji(player.role === "Santa Claus" ? "santagift" : "bunny_greet", client)} You have given **${players.indexOf(target)} ${db.get(`player_${target}`).user.username}** your gift!`)
        }

        if (player.role === "Alchemist") {
            if (db.get(`player_${target}`).role === "President") return await message.channel.send("You cannot give potions to the President!")
            let itemType = args[1]?.toLowerCase()
            if (!itemType) return await message.channel.send("You need to state if you want to use the black or red potion!")
            if (!["black", "red"].includes(itemType)) return await message.channel.send("Potion not found! Please choose the black or red potion.")
            db.set(`player_${player.id}.${itemType}Target`, target)
            let additionalMsg = ""
            if (player.redPotions?.includes(target)) additionalMsg = "Since you are giving this player a second potion, they will die at the end of the following day."
            await message.channel.send(`${getEmoji(`${itemType}p`, client)} You have given your ${itemType} potion to **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**. ${additionalMsg}`)
        }

        if (player.role === "Forger") {
            db.set(`player_${player.id}.target`, target)
            await message.channel.send(`${getEmoji(`get${player.itemType}`, client)} You have decided to give your forged ${player.itemType} to **${players.indexOf(target) + 1} ${db.get(`player_${target}`).username}**.`)
        }

        if (player.role === "Baker") {
            db.set(`player_${player.id}.target`, target)
            await message.channel.send(`${getEmoji(`baker_bread`, client)} You have decided to give your bread to **${players.indexOf(target)} ${db.get(`player_${target}`).user.username}**.`)
        }
    },
}
