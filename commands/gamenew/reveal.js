const Discord = require("discord.js")
const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "reveal",
    description: "Reveal a role in the game.",
    usage: `${process.env.PREFIX}reveal [player]`,
    gameOnly: true,
    aliases: ["show"],
    run: async (message, args, client) => {

        const gamePhase = db.get(`gamePhase`)
        const players = db.get(`players`)
        const daychat = message.guild.channels.cache.find(c => c.name === "day-chat")
        const wwchat = message.guild.channels.cache.find(c => c.name === "werewolves-chat")
        
        let player = db.get(`player_${message.author.id}`) || { status: "Dead" }

        if (!message.channel.name.startsWith("priv")) return; // if they are not in the private channel

        if (player.status !== "Alive") return await message.channel.send("Listen to me, you need to be ALIVE to use the ability!")

        if (args[0].toLowerCase() === "card") {
            if (!player.card) return await message.channel.send("If you don't have the Fortune Teller's card, what are you trying to reveal?")
            let member = await message.guild.members.fetch(player.id)
            await daychat.send(`${getEmoji("sun", client)} **${players.indexOf(player.id)+1} ${player.username} (${getEmoji(player.role.toLowerCase().replace(/\s/g, "_"), client)} ${player.role})** used the Fortune Teller's card to reveal their role!`)
            await member.roles.add(message.guild.roles.cache.find(r => r.name === "Revealed"))
            db.delete(`player_${player.id}.card`)
            return;
        }

        if (!["Mayor", "Pacifist", "Vigilante", "Wolf Pacifist"].includes(player.role) && !["Mayor", "Pacifist", "Vigilante", "Wolf Pacifist"].includes(player.dreamRole)) return;
        if (["Mayor", "Pacifist", "Vigilante", "Wolf Pacifist"].includes(player.dreamRole)) player = db.get(`player_${player.target}`)
        if (gamePhase % 3 === 0) return await message.channel.send("You do know that you can only reveal during the day right? Or are you delusional?")
        if (player.jailed) return await message.channel.send("You are jailed. You cannot use your abilities while in jail!")
        if (player.nightmared) return await message.channel.send("You are nightmared. You cannot use your abilities while you're asleep.")
        if ((player.usesR === 0 && player.role === "Vigilante") || player.uses === 0) return await message.channel.send("You have already used your abilities!")

        if (player.role === "Mayor") {

            let member = await message.guild.members.fetch(player.id)
            await daychat.send(`${getEmoji("mayoring", client)} Player **${players.indexOf(player.id)+1} ${player.username} (${getEmoji("mayor", client)} Mayor)** has revealed themselves as the Mayor!`)
            await member.roles.add(message.guild.roles.cache.find(r => r.name === "Revealed"))
            db.subtract(`player_${player.id}.uses`, 1)

        } else {

            let target = players[Number(args[0])-1] || players.find(p => p === args[0]) || players.map(p => db.get(`player_${p}`)).find(p => p.username === args[0])

            if (!target) return await message.channel.send("Player not found!")

            if (db.get(`player_${target}`).status !== "Alive") return await message.channel.send("You need to select an ALIVE player to reveal.")

            let obj = {
                "Pacifist": `${getEmoji("revealed", client)} The Pacifist revealed`,
                "Wolf Pacifist": `${getEmoji("revealed", client)} The Pacifist revealed`,
                "Vigilante": `${getEmoji("whistle", client)} The Vigilante revealed`
            }

            let member = await message.guild.members.fetch(target)

            await daychat.send(`${obj[player.role]} **${players.indexOf(target)+1} ${db.get(`player_${target}`).username} (${getEmoji(db.get(`player_${target}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${target}`).role})**`)
            await member.roles.add(message.guild.roles.cache.find(r => r.name === "Revealed"))

            

            if (player.role !== "Vigilante") {
                db.set(`noVoting`, true)
                db.subtract(`player_${player.id}.uses`, 1)
            } else {
                db.subtract(`player_${player.id}.usesR`, 0)
            }

            if (player.role === "Wolf Pacifist") {
                await wwchat.send(`${getEmoji("wolf_pacifist", client)} The Wolf Pacifist has revealed **${players.indexOf(target)+1} ${db.get(`player_${target}`).username} (${getEmoji(db.get(`player_${target}`).role.toLowerCase().replace(/\s/g, "_"), client)} ${db.get(`player_${target}`).role}**!`)
            }

        }

        let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
        let deadRole = message.guild.roles.cache.find((r) => r.name === "Dead")
        let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
        let gamePhase = db.get(`gamePhase`)
        let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
        if (message.channel.name == "priv-mayor") {
            let ability = await db.fetch(`ability_${message.channel.id}`)
            if (ability == "yes") return await message.channel.send("You have already used your ability!")
            if (gamePhase % 3 == 0) return await message.channel.send("You can use your ability only at night!")
            dayChat.send(`${getEmoji("mayoring", client)} **${message.member.nickname} ${message.author.username} (Mayor)** has revealed himself!`)
            message.member.roles.add(revealed.id)
            db.set(`ability_${message.channel.id}`, "yes")
        } else if (db.get(`card_${message.channel.id}`) && (!args[0] || args[0] == "card")) {
            if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can not reveal when dead!")
            db.set(`card_${message.channel.id}`, false)
            message.member.roles.add(revealed.id)
            return dayChat.send(``)
        } else if (message.channel.name == "priv-pacifist" || message.channel.name == "priv-wolf-pacifist") {
            let ability = await db.fetch(`paci_${message.channel.id}`)
            let gamePhase = await db.fetch(`gamePhase`)
            let day = Math.floor(gamePhase / 3) + 1
            if (ability == "yes") return await message.reply("You have already used your ability!")
            let cmd = await db.fetch(`commandEnabled`)
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let role = await db.fetch(`role_${guy.id}`)
            let nrole = role.toLowerCase()
            let lovers = message.guild.channels.cache.find((c) => c.name === "lovers")
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            let sected = message.guild.channels.cache.find((c) => c.name === "sect-members")
            let dchat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            if (!message.member.roles.cache.has(alive.id) || !guy.roles.cache.has(alive.id)) return message.channel.send("You can play with alive people only!")
            if (args[0] == "card") {
                if (db.get(`card_${message.channel.id}`) == true) {
                    if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't reveal when dead!")
                    db.set(`card_${message.channel.id}`, false)
                    message.member.roles.add(revealed.id)
                    return dayChat.send(`${getEmoji("sun", client)} **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
                }
            }
            if (gamePhase % 3 == 0) return await message.reply("You can use your ability only during the day!")
            if (day == 1) {
                if (cmd != "yes") return await message.reply("You can reveal after discussion phase of day 1!")
            }
            if (!guy || guy == message.member) return await message.reply("The player is not in game! Mention the correct player number.")
            if (role == "President") return await message.reply("You can't reveal the President!")
            if (message.channel.name == "priv-wolf-pacifist" && nrole.includes("wolf")) return await message.reply("You can not reveal your own teammate!")
            if (guy.roles.cache.has(revealed.id)) return await message.reply("That player is already revealed!")
            if (sected.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]) && role == "Sect Leader") return await message.channel.send("You can't reveal a Sect Leader when sected!")
            if (lovers.permissionsFor(guy).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                if (lovers.permissionsFor(message.member).has(["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    return message.channel.send("Hey, you cannot reveal your lover!")
                }
            }
            db.set(`paci_${message.channel.id}`, "yes")
            dchat.send(`${getEmoji("revealed", client)} The Pacifist revealed **${args[0]} ${guy.user.username} (${role})**!`)
            db.set(`pacday_${message.channel.id}`, day)
            guy.roles.add(revealed.id)
            if (message.channel.name == "priv-wolf-pacifist") message.guild.channels.cache.find((x) => x.name == "werewolves-chat").send(`${getEmoji("revealed", client)} You have revealed **${args[0]} ${guy.user.username} (${role})**!`)

            if (db.get(`card_${message.channel.id}`) == true) {
                if (message.channel.name != "priv-mayor" && message.channel.name != "priv-pacifist" && message.channel.name != "priv-wolf-pacifist") {
                    let alive = message.guild.roles.cache.find((r) => r.name === "Alive")
                    if (!message.member.roles.cache.has(alive.id)) return message.channel.send("You can't reveal when dead!")
                    let day = message.guild.channels.cache.find((c) => c.name === "day-chat")
                    message.member.roles.add(revealed.id)
                    day.send(`${getEmoji("sun", client)} **${message.member.nickname} ${message.author.username} (${db.get(`role_${message.author.id}`)})** used the Fortune Teller's card to reveal their role!`)
                    db.set(`card_${message.channel.id}`, false)
                }
            }
        } else if (message.channel.name == "priv-vigilante" && args?.[0].toLowerCase() != "card") {
            let ability = db.get(`reveal_${message.channel.id}`) ?? true
            if (!ability) {
                message.channel.send("You already used that ability!")
                return console.log("%d already revealed a player", message.member?.nickname)
            }
            let dead = message.guild.roles.cache.find((r) => r.name === "Dead")
            let dayChat = message.guild.channels.cache.find((c) => c.name === "day-chat")
            let gamePhase = db.get(`gamePhase`)
            let dayCount = Math.floor(gamePhase / 3) + 1
            let guy = message.guild.members.cache.find((m) => m.nickname === args[0])
            let revealed = message.guild.roles.cache.find((r) => r.name === "Revealed")
            if (message.member.roles.cache.has(dead.id)) return message.channel.send("You can't your ability right now!")
            if (gamePhase % 3 == 0) return message.channel.send("You can use your ability only during the day!")
            if (!guy || guy.member == message.member || !guy.roles.cache.has(alive.id)) return message.channel.send({ content: "The player is not in game! Mention the correct player number." })
            if (db.get(`did_${message.channel.id}`) == dayCount) return message.channel.send("You already used one of your abilities today.")
            if (db.get(`role_${guy.id}`) == "President") return message.channel.send({ content: "You can't reveal the president!" })
            dayChat.send({ content: `${getEmoji("whistle", client)} The Vigilante revealed ${guy.nickname} ${guy.user.username} (${db.get(`role_${guy.id}`)})` })
            guy.roles.add(revealed.id)
            db.set(`did_${message.channel.id}`, dayCount)
        }
    },
}
