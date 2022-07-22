const Discord = require("discord.js")
const db = require("quick.db")
const { getEmoji } = require("../../config")

module.exports = {
    name: "reveal",
    description: "Reveal a player in the game.",
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

    },
}
